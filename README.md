# Description
WebsocketCommandTerminal: A proof of concept frontend/backend that you can indeed stream the results of a command like below directly seeing the live updates in your browser. **This is NOT SAFE FOR PRODUCTION, NEVER USE IT IN PRODUCTION.**

```bash
# If host is linux
for i in {1..10}; do echo $i; sleep 1; done
```
```powershell
# If host is windows
powershell -command "1..10 | % {Write-Host $_; Start-Sleep -Seconds 1}"
```

# How to Launch
* Install Node.JS from website, then open 2 terminals and run one in each:
  * cd backend ; npm i ; node server.js
  * cd frontend ; npm i ; npm run dev
* Open your browser to http://localhost:5173/
* Launch a command that _takes a while_ and you can see it live update as it goes!

# Sample Photo
![Sample Photo of WebsocketCommandTerminal](https://github.com/user-attachments/assets/212fba48-db98-4ce2-b063-655e56b3d547 "A sample photo of the WebsocketCommandTerminal webpage.")

# How It Works
The backend uses Node.js with Socket.IO to establish a WebSocket connection that streams command output in real-time. 

When a command is executed, the server spawns a child process and pipes its stdout/stderr through the WebSocket connection to connected clients/browsers!!!

The frontend is built with Vite and uses the Socket.IO client library to establish the connection and display incoming command output in real-time in the browser window.

My goal was that this setup enables live streaming of command output **without** needing to wait for the command to complete or relying on polling mechanisms. 

So... The WebSocket connection ensures minimal latency between command execution and output display, making it feel like you're running the command directly in a terminal!!!