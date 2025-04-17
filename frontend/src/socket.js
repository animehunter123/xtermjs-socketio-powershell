import { io } from 'socket.io-client';

// Create a socket connection to the backend
const socket = io('http://localhost:3000');

// Event listeners
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Function to execute a command
export const executeCommand = (command) => {
  socket.emit('execute-command', command);
};

// Function to listen for command output
export const onCommandOutput = (callback) => {
  socket.on('command-output', callback);
};

export default socket;
