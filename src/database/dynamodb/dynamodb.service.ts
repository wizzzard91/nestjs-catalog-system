import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamodbService {
  private client: DynamoDBDocumentClient;
  private readonly tableName = 'CatalogItems';

  constructor(private configService: ConfigService) {
    const dynamoClient = new DynamoDBClient({
      region: this.configService.get('AWS_REGION'),
      endpoint: this.configService.get('DYNAMODB_ENDPOINT'),
    });

    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async createItem(item: any) {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      }),
    );
    return item;
  }

  async getItem(id: string) {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id },
      }),
    );
    return result.Item;
  }

  async getAllItems() {
    const result = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );
    return result.Items || [];
  }

  async updateItemStatus(id: string, status: string) {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': status },
      }),
    );
  }
}
