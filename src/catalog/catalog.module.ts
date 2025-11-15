import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { ScoringService } from './scoring/scoring.service';
import { AiSuggestionService } from './ai-suggestion/ai-suggestion.service';

@Module({
  providers: [CatalogService, ScoringService, AiSuggestionService],
  controllers: [CatalogController],
})
export class CatalogModule {}
