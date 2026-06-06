import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as imageService from '../../services/imageService.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';

const router = Router();

/**
 * POST /api/images/generate
 * Initiates an asynchronous image generation process.
 * Responds immediately with status 202 and a taskId.
 */
router.post('/generate', asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({
            success: false,
            error: 'Prompt parameter is required and must be a non-empty string'
        });
    }

    // Generate unique taskId
    const taskId = uuidv4();

    // Trigger the background mock AI processing
    imageService.generateImageMock(taskId, prompt);

    // Return 202 Accepted status
    return res.status(202).json({
        success: true,
        message: 'Image generation job successfully queued in background.',
        taskId,
        status: 'queued'
    });
}));

export default router;
