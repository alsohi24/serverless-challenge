import { Request, Response, NextFunction } from 'express';
import { HistoryService } from '../services/history-service';

/**
 * @swagger
 * /historial:
 *   get:
 *     summary: Get history
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "custom-1712345678901"
 *                   key:
 *                     type: string
 *                     example: "miClave"
 *                   value:
 *                     type: string
 *                     example: "miValor"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-02-23T14:22:10.123Z"
 *       400:
 *         description: Parámetros de paginación inválidos
 */
export const listHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validación del req
    const { page, limit } = validatePagination(
      String(req.query.page),
      String(req.query.limit)
    );

    // Llama al servicio para obtener el historial
    const history = await HistoryService.getHistory(page, limit);

    res.json(history);
  } catch (error) {
    next(error);
  }
};

const validatePagination = (
  page?: string,
  limit?: string
): { page: number; limit: number } => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 10;
  const MAX_LIMIT = 100;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  return {
    page:
      isNaN(parsedPage) || parsedPage < 1
        ? DEFAULT_PAGE
        : Math.floor(parsedPage),
    limit:
      isNaN(parsedLimit) || parsedLimit < 1
        ? DEFAULT_LIMIT
        : Math.min(Math.floor(parsedLimit), MAX_LIMIT),
  };
};
