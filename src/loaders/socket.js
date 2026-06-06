import { Server } from 'socket.io';

let tasksNamespace = null;
const taskProgressHistory = new Map();

/**
 * Initialize Socket.IO on the HTTP server.
 * Sets up CORS and mounts the '/tasks' namespace.
 * 
 * @param {Object} server - The HTTP server instance.
 * @returns {Server} The initialized Socket.IO server instance.
 */
export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    // Create the '/tasks' namespace for dynamic task monitoring rooms
    tasksNamespace = io.of('/tasks');

    tasksNamespace.on('connection', (socket) => {
        console.log(`[Socket] Client connected to /tasks namespace: ${socket.id}`);

        // Listen for client request to join a specific room for their taskId
        socket.on('join-task', (taskId) => {
            if (taskId) {
                socket.join(`task:${taskId}`);
                console.log(`[Socket] Client socket ${socket.id} joined room "task:${taskId}"`);

                // Replay historical progress steps if any have already been emitted
                const history = taskProgressHistory.get(taskId);
                if (history && history.length > 0) {
                    console.log(`[Socket] Replaying ${history.length} progress events to socket ${socket.id} for task:${taskId}`);
                    history.forEach((payload) => {
                        socket.emit('task-progress', payload);
                    });
                }
            }
        });

        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected from /tasks namespace: ${socket.id}`);
        });
    });

    return io;
};

/**
 * Emit a progress event to a specific task room inside the '/tasks' namespace.
 * 
 * @param {string} taskId - The unique UUID of the task.
 * @param {string} event - Event name (e.g. 'task-progress', 'task-completed').
 * @param {Object} payload - Event payload.
 */
export const emitToTask = (taskId, event, payload) => {
    if (tasksNamespace) {
        // Cache the progress events so we can replay them if client joins late
        if (event === 'task-progress') {
            if (!taskProgressHistory.has(taskId)) {
                taskProgressHistory.set(taskId, []);
            }
            taskProgressHistory.get(taskId).push(payload);
        }

        console.log(`[Socket Emit] Room task:${taskId} -> "${event}" (${payload.progress}%) - ${payload.status}`);
        tasksNamespace.to(`task:${taskId}`).emit(event, payload);
    } else {
        console.warn(`[Socket] Warning: Tried to emit task event to "${taskId}" but /tasks namespace is not initialized.`);
    }
};
