@echo off 

ECHO info - Starting Program

ECHO "Starting Open House Form" nodex86.exe src/node/webServer.js
start "Starting Open House Form" nodex86.exe src/node/webServer.js

ECHO %ERRORLEVEL%

If %ERRORLEVEL% NEQ 0 (
	ECHO info - could not start 32 bit node file, trying 64 bit
	start "Starting Open House Form" nodex64.exe src/node/webServer.js
)

If %ERRORLEVEL% NEQ 0 (
	ECHO error - could not start 32 or 64 bit node file, Exiting
	EXIT
)

TIMEOUT 6
ECHO opening browser

start "starting Browser" "http://127.0.0.1"

