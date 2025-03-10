import { DynamoDBRepository } from '../repositories/dynamodb';

export class CustomDataService {
  // Guarda data customizada en DB
  public static async saveCustomData(data: Record<string, any>): Promise<void> {
    try {
      await DynamoDBRepository.saveCustomData(data);
    } catch (error) {
      throw new Error('[DatabaseRepository.saveCustomData]');
    }
  }
}
