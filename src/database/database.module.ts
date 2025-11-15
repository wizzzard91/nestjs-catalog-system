import { Module } from '@nestjs/common';
import { DynamodbService } from './dynamodb/dynamodb.service';

@Module({
  providers: [DynamodbService],
})
export class DatabaseModule {}
