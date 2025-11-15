import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { DatabaseModule } from '../database/database.module';
import { ScoringService } from './scoring/scoring.service';
import { AiSuggestionService } from './ai-suggestion/ai-suggestion.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CatalogController],
  providers: [CatalogService, ScoringService, AiSuggestionService],
})
export class CatalogModule {}
