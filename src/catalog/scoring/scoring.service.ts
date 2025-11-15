import { Injectable, Logger } from '@nestjs/common';

interface CatalogItem {
  id?: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
}

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  async calculateScore(
    item: CatalogItem,
    allItems: CatalogItem[],
  ): Promise<number> {
    let score = 40;

    const titleLength = item.title.length;
    if (titleLength >= 12 && titleLength <= 50) {
      score += 20;
      this.logger.debug(`Title length bonus: +20 (length: ${titleLength})`);
    }

    if (item.description.length >= 60) {
      score += 15;
      this.logger.debug(
        `Description length bonus: +15 (length: ${item.description.length})`,
      );
    }

    if (item.category) {
      score += 10;
      this.logger.debug(`Category bonus: +10`);
    }

    if (item.tags && item.tags.length > 0) {
      if (item.tags.length <= 3) {
        score += 10;
        this.logger.debug(`Tags bonus (1-3): +10 (count: ${item.tags.length})`);
      } else {
        score += 20;
        this.logger.debug(`Tags bonus (4+): +20 (count: ${item.tags.length})`);
      }
    }

    const hasDuplicate = allItems.some(
      (existingItem) =>
        existingItem.title === item.title && existingItem.id !== item.id,
    );
    if (!hasDuplicate) {
      score += 5;
      this.logger.debug(`Unique title bonus: +5`);
    } else {
      this.logger.debug(`Duplicate title found, no bonus`);
    }

    const finalScore = Math.min(score, 100);
    this.logger.log(`Final score calculated: ${finalScore}`);

    return finalScore;
  }
}