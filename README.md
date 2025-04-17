# Description
WebsocketCommandTerminal: A proof of concept frontend/backend that you can indeed stream the results of a command like below directly seeing the live updates in your browser

```powershell
powershell -command "1..10 | % {Write-Host $_; Start-Sleep -Seconds 1}"
```

# How to Launch
* cd backend ; node server.js
* cd frontend ; npm run dev

# Sample Photo
![Sample Photo of WebsocketCommandTerminal](https://github.com/user-attachments/assets/212fba48-db98-4ce2-b063-655e56b3d547 "A sample photo of the WebsocketCommandTerminal webpage.")
