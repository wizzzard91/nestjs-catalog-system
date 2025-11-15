import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

export interface SuggestionResponse {
  suggestedTitle: string;
  suggestedDescription: string;
}

@Injectable()
export class AiSuggestionService {
  private readonly anthropic: Anthropic;

  private readonly MODEL = 'claude-sonnet-4-20250514';
  private readonly MAX_TOKENS = 1024;
  private readonly MIN_TITLE_LENGTH = 12;
  private readonly MAX_TITLE_LENGTH = 50;
  private readonly MIN_DESCRIPTION_LENGTH = 60;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');

    this.anthropic = new Anthropic({
      apiKey: apiKey || '',
    });
  }

  async getSuggestions(
    title: string,
    description: string,
  ): Promise<SuggestionResponse> {
    const prompt = this.buildPrompt(title, description);

    const message = await this.anthropic.messages.create({
      model: this.MODEL,
      max_tokens: this.MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === 'text');

    if (textBlock?.type === 'text') {
      return JSON.parse(textBlock.text) as SuggestionResponse;
    }

    throw new Error('No text response from AI');
  }

  private buildPrompt(title: string, description: string): string {
    return `You are helping improve catalog items to achieve a higher quality score.

Scoring criteria:
- Title should be ${this.MIN_TITLE_LENGTH}-${this.MAX_TITLE_LENGTH} characters (current: ${title.length})
- Description should be ${this.MIN_DESCRIPTION_LENGTH}+ characters (current: ${description.length})
- Content should be clear, engaging, and informative

Current item:
Title: ${title}
Description: ${description}

Provide improved versions that will score higher. Return ONLY valid JSON with no markdown or additional text:
{
  "suggestedTitle": "improved title here",
  "suggestedDescription": "improved description here"
}`;
  }
}
