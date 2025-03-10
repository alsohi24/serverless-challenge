import { Request, Response, NextFunction } from 'express';
import { FusionService } from '../services/FusionService';

/**
 * @swagger
 * /fusionados:
 *   get:
 *     summary: Get podracers and participants
 *     tags: [Fusion]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Datos fusionados obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 vehicle:
 *                   type: string
 *                 planet:
 *                   type: string
 *       400:
 *         description: Unsuccessfully.
 */
export const podracersParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const fusionData = await FusionService.getFusionDataWithCache(id);

    res.json(fusionData);
  } catch (error) {
    next(error);
  }
};
