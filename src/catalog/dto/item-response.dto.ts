export class ItemResponseDto {
  id: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  score: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
