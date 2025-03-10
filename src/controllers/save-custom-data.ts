import { Request, Response, NextFunction } from 'express';
import { CustomDataService } from '../services/custom-data';
/**
 * @swagger
 * /almacenar:
 *   post:
 *     summary: Save custom data on DB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               id: "id"
 *               broadcast_name: "value"
 *               team_name : "value"
 *     responses:
 *       201:
 *         description: Success
 *       400:
 *         description: Body reques can be empty.
 */
export const saveCustomData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body;

    // Asegura de que el body no esté vacío data = req.body;

    if (!data || Object.keys(data).length === 0) {
      res
        .status(400)
        .json({ error: 'El cuerpo de la solicitud no puede estar vacío.' });
      return;
    }

    // Guardar datos personalizados
    await CustomDataService.saveCustomData(data);

    res.json({ message: 'Storaged successfully', data });
  } catch (error) {
    next(error);
  }
};
