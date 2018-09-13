:: %~dp0 is the directory where this file is located, similar to node's __dirname
:: Explanation of %~dp0 http://stackoverflow.com/a/5034119/151312

@ECHO OFF

for /f "delims=[] tokens=2" %%a in ('ping -4 -n 1 %ComputerName% ^| findstr [') do set NetworkIP=%%a

set "WebAddress=http://%NetworkIP%:3000"

ECHO BudgetApp is now running!
ECHO You can access the application from any web browser on any computer on your network with the following URL:
ECHO %WebAddress%
ECHO (or use localhost:3000 as the URL, if accessing budget from this PC)
ECHO When finished, you can close this window.

start "" %WebAddress%

:: Run a local node instance if it exists, otherwise a global node instance
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe" "%~dp0\server.js" %*
) ELSE (
  node "%~dp0\server.js" %*
)
