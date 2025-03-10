import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { config } from 'dotenv';

config();

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.AWS_DYNAMODB_TABLE || 'podracers';

export class DynamoDBRepository {
  public static async saveCustomData(data: Record<string, any>): Promise<void> {
    const params = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        id: `CUSTOM#${Date.now().toString()}`,
        ...data,
        createdAt: new Date().toISOString(),
      },
    });

    try {
      await dynamoDB.send(params);
      console.log('[saveCustomData] Data successfully saved in DynamoDB!');
    } catch (error) {
      throw new Error(
        `[saveCustomData]Error saving custom data to DynamoDB: ${error}`
      );
    }
  }

  public static async saveMergedData(data: any): Promise<void> {
    console.log('Saving to DynamoDB: ', data);

    const params = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        id: `PODRACERS#${Date.now().toString()}`,
        ...data,
        createdAt: new Date().toISOString(),
      },
    });

    try {
      await dynamoDB.send(params);
      console.log('[saveMergedData] Data successfully saved in DynamoDB!');
    } catch (error) {
      throw new Error(
        `[saveMergedData] Error saving data to DynamoDB: ${error}`
      );
    }
  }

  public static async fetchHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<any[]> {
    try {
      const params = new ScanCommand({ TableName: TABLE_NAME });
      const result = await dynamoDB.send(params);

      if (!result.Items || result.Items.length === 0) {
        return [];
      }

      const startIndex = (page - 1) * limit;
      console.log('[fetchHistory] Data successfully fetched from DynamoDB!');

      return result.Items?.slice(startIndex, startIndex + limit) || [];
    } catch (error) {
      console.log('[fetchHistory] Data successfully fetched from DynamoDB!');

      throw new Error(`Error fetching data from DynamoDB: ${error}`);
    }
  }
}
