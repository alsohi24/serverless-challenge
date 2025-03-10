import { Request, Response, NextFunction } from 'express';
import { generateRaceParticipants } from '@/services/podracers-participans';

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
    const fusionData = await generateRaceParticipants();

    res.json(fusionData);
  } catch (error) {
    next(error);
  }
};
