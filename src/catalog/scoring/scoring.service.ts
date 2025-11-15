import { Injectable, Logger } from '@nestjs/common';
import { CatalogItem } from '../entities/catalog-item.entity';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  private readonly BASE_SCORE = 40;

  private readonly MAX_SCORE = 100;

  calculateScore(item: CatalogItem, allItems: CatalogItem[]): number {
    let score = this.BASE_SCORE;

    score += this.scoreTitleLength(item.title);
    score += this.scoreDescriptionLength(item.description);
    score += this.scoreCategory(item.category);
    score += this.scoreTags(item.tags);
    score += this.scoreUniqueness(item, allItems);

    const finalScore = Math.min(score, this.MAX_SCORE);
    this.logger.log(`Final score for "${item.title}": ${finalScore}`);

    return finalScore;
  }

  private scoreTitleLength(title: string): number {
    const length = title.length;
    if (length >= 12 && length <= 50) {
      this.logger.debug(`Title length bonus: +20 (${length} chars)`);
      return 20;
    }
    return 0;
  }

  private scoreDescriptionLength(description: string): number {
    const length = description.length;
    if (length >= 60) {
      this.logger.debug(`Description bonus: +15 (${length} chars)`);
      return 15;
    }
    return 0;
  }

  private scoreCategory(category?: string): number {
    if (category) {
      this.logger.debug('Category bonus: +10');
      return 10;
    }
    return 0;
  }

  private scoreTags(tags?: string[]): number {
    if (!tags || tags.length === 0) return 0;

    const bonus = tags.length <= 3 ? 10 : 20;
    this.logger.debug(`Tags bonus: +${bonus} (${tags.length} tags)`);
    return bonus;
  }

  private scoreUniqueness(item: CatalogItem, allItems: CatalogItem[]): number {
    const hasDuplicate = allItems.some(
      (existing) => existing.title === item.title && existing.id !== item.id,
    );

    if (hasDuplicate) {
      this.logger.debug('Duplicate title found, no bonus');
      return 0;
    }

    this.logger.debug('Unique title bonus: +5');
    return 5;
  }
}
