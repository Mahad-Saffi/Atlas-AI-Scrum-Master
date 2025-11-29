@echo off
echo ========================================
echo Atlas MCP Server Setup for Claude
echo ========================================
echo.

REM Step 1: Check if Atlas backend is running
echo [1/4] Checking Atlas backend...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Atlas backend is not running!
    echo Please start it first:
    echo   cd backend
    echo   python -m uvicorn main:app --reload --port 8000
    pause
    exit /b 1
)
echo OK - Backend is running
echo.

REM Step 2: Get JWT token
echo [2/4] Getting JWT token...
curl -s -X POST http://localhost:8000/api/v1/auth/demo-login > token_response.json
if %errorlevel% neq 0 (
    echo ERROR: Failed to get token
    pause
    exit /b 1
)

REM Extract token using Python
python -c "import json; data=json.load(open('token_response.json')); print(data['access_token'])" > token.txt 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Failed to parse token
    type token_response.json
    pause
    exit /b 1
)

set /p TOKEN=<token.txt
echo OK - Token obtained
echo.

REM Step 3: Create Claude config
echo [3/4] Creating Claude Desktop config...
set CONFIG_DIR=C:\Users\HP\AppData\Roaming\Claude
if not exist "%CONFIG_DIR%" mkdir "%CONFIG_DIR%"

echo {> "%CONFIG_DIR%\claude_desktop_config.json"
echo   "mcpServers": {>> "%CONFIG_DIR%\claude_desktop_config.json"
echo     "atlas": {>> "%CONFIG_DIR%\claude_desktop_config.json"
echo       "command": "python",>> "%CONFIG_DIR%\claude_desktop_config.json"
echo       "args": [>> "%CONFIG_DIR%\claude_desktop_config.json"
echo         "E:/SoftwareProjectManagement/Atlas-AI-Scrum-Master/atlas_mcp_server.py">> "%CONFIG_DIR%\claude_desktop_config.json"
echo       ],>> "%CONFIG_DIR%\claude_desktop_config.json"
echo       "env": {>> "%CONFIG_DIR%\claude_desktop_config.json"
echo         "ATLAS_API_URL": "http://localhost:8000",>> "%CONFIG_DIR%\claude_desktop_config.json"
echo         "ATLAS_TOKEN": "%TOKEN%">> "%CONFIG_DIR%\claude_desktop_config.json"
echo       }>> "%CONFIG_DIR%\claude_desktop_config.json"
echo     }>> "%CONFIG_DIR%\claude_desktop_config.json"
echo   }>> "%CONFIG_DIR%\claude_desktop_config.json"
echo }>> "%CONFIG_DIR%\claude_desktop_config.json"

echo OK - Config created at:
echo %CONFIG_DIR%\claude_desktop_config.json
echo.

REM Step 4: Install dependencies
echo [4/4] Checking Python dependencies...
pip show mcp >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing MCP...
    pip install mcp httpx
)
echo OK - Dependencies installed
echo.

REM Cleanup
del token_response.json token.txt 2>nul

echo ========================================
echo SUCCESS! Setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart Claude Desktop completely
echo 2. Open Claude and try: "Show me all my Atlas projects"
echo.
echo Your token expires in 7 days. Run this script again to refresh.
echo.
pause
