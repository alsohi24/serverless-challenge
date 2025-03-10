import { DynamoDBRepository } from '../repositories/dynamodb';
export class HistoryService {
  // Obtiene historial
  public static async getHistory(page: number, limit: number): Promise<any[]> {
    try {
      return await DynamoDBRepository.fetchHistory(page, limit);
    } catch (error) {
      console.log('[DynamoDBRepository]:', error);
      throw new Error('');
    }
  }
}
