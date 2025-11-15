import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DynamodbService } from '../database/dynamodb/dynamodb.service';
import { ScoringService } from './scoring/scoring.service';
import {
  AiSuggestionService,
  SuggestionResponse,
} from './ai-suggestion/ai-suggestion.service';
import { CreateItemDto } from './dto/create-item.dto';
import { CatalogItem } from './entities/catalog-item.entity';
import { ItemStatus } from './entities/item-status.enum';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);
  private readonly MIN_APPROVAL_SCORE = 70;

  constructor(
    private readonly dbService: DynamodbService,
    private readonly scoringService: ScoringService,
    private readonly aiService: AiSuggestionService,
  ) {}

  async createItem(dto: CreateItemDto): Promise<CatalogItem> {
    const allItems = await this.dbService.getAllItems();

    const item: CatalogItem = {
      id: randomUUID(),
      ...dto,
      status: ItemStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    item.score = this.scoringService.calculateScore(item, allItems);

    this.logger.log(`Creating item "${item.title}" with score ${item.score}`);

    return await this.dbService.createItem(item);
  }

  async getItem(id: string): Promise<CatalogItem> {
    const item = await this.dbService.getItem(id);

    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    return item;
  }

  async getSuggestions(id: string): Promise<SuggestionResponse> {
    const item = await this.getItem(id);
    return await this.aiService.getSuggestions(item.title, item.description);
  }

  async approveItem(id: string): Promise<void> {
    const item = await this.getItem(id);

    if (!item.score || item.score < this.MIN_APPROVAL_SCORE) {
      throw new BadRequestException(
        `Item score must be ${this.MIN_APPROVAL_SCORE} or higher (current: ${item.score})`,
      );
    }

    await this.dbService.updateItemStatus(id, ItemStatus.APPROVED);
    this.logger.log(`Item ${id} approved`);
  }

  async rejectItem(id: string): Promise<void> {
    await this.getItem(id);
    await this.dbService.updateItemStatus(id, ItemStatus.REJECTED);
    this.logger.log(`Item ${id} rejected`);
  }
}
