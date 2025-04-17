const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: '*', // In production, specify your frontend URL
        methods: ['GET', 'POST']
    }
});

// Serve static files if needed
app.get('/', (req, res) => {
    res.send('WebSocket Server Running');
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle command execution
    socket.on('execute-command', (command) => {
        console.log(`Executing command: ${command}`);

        // Parse the command string into command and arguments
        let args = command.split(' ');
        const cmd = args.shift();

        // For Windows, determine if we need to use shell
        const isWindows = process.platform === 'win32';
        let childProcess;

        if (isWindows) {
            // On Windows, use PowerShell to execute the command
            childProcess = spawn('powershell.exe', ['-Command', command], {
                shell: true
            });
        } else {
            // On other platforms, spawn the command directly
            childProcess = spawn(cmd, args);
        }

        // Stream stdout data as it's generated
        childProcess.stdout.on('data', (data) => {
            const output = data.toString();
            socket.emit('command-output', { error: false, output, complete: false });
        });

        // Stream stderr data as it's generated
        childProcess.stderr.on('data', (data) => {
            const output = data.toString();
            socket.emit('command-output', { error: true, output, complete: false });
        });

        // Handle process completion
        childProcess.on('close', (code) => {
            socket.emit('command-output', {
                error: code !== 0,
                output: `Command exited with code ${code}`,
                complete: true
            });
        });

        // Handle process errors
        childProcess.on('error', (error) => {
            socket.emit('command-output', {
                error: true,
                output: `Failed to start command: ${error.message}`,
                complete: true
            });
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
