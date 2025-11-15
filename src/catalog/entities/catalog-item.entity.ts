import { ItemStatus } from './item-status.enum';

export class CatalogItem {
  id?: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  score?: number;
  status?: ItemStatus;
  createdAt?: string;
}
