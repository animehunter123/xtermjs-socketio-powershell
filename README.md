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
