require('dotenv').config();
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
});

async function setupTable(params) {
  try {
    await client.send(new CreateTableCommand(params));
    console.log(`Table ${params.TableName} created`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`Table ${params.TableName} already exists, skipping`);
    } else {
      console.error(`Failed to create table ${params.TableName}:`, err.message);
    }
  }
}

(async () => {
  const catalogItemsTableParams = {
    TableName: 'CatalogItems',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };

  await setupTable(catalogItemsTableParams);
})();
