export class CreateItemDto {
  title: string;
  description: string;
  category?: string;
  tags?: string[];
}
