import { emitToTask } from '../loaders/socket.js';

/**
 * Simulates a background AI Image Generation process.
 * Periodically broadcasts progress updates to the client's task room.
 * 
 * @param {string} taskId - The UUID representing this unique task.
 * @param {string} prompt - The text prompt sent by the client.
 */
export const generateImageMock = (taskId, prompt) => {
    console.log(`[ImageService] Starting background image generation for taskId: ${taskId}, Prompt: "${prompt}"`);

    // Step 1: Initializing
    setTimeout(() => {
        emitToTask(taskId, 'task-progress', {
            taskId,
            status: 'queued',
            progress: 10,
            message: 'Queued in generation server.'
        });

        // Step 2: Processing (Denoising)
        setTimeout(() => {
            emitToTask(taskId, 'task-progress', {
                taskId,
                status: 'processing',
                progress: 40,
                message: 'Running diffusion denoising steps (12/30)...'
            });

            // Step 3: Detailing & Upscaling
            setTimeout(() => {
                emitToTask(taskId, 'task-progress', {
                    taskId,
                    status: 'processing',
                    progress: 80,
                    message: 'Enhancing facial features and upscaling resolution...'
                });

                // Step 4: Complete
                setTimeout(() => {
                    emitToTask(taskId, 'task-progress', {
                        taskId,
                        status: 'completed',
                        progress: 100,
                        message: 'Success',
                        resultUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80'
                    });
                    console.log(`[ImageService] Finished background image generation for taskId: ${taskId}`);
                }, 3000);

            }, 3000);

        }, 3000);

    }, 3000);
};
