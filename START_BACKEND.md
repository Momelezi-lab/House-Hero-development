# How to Start the Backend Server

## Step 1: Check if Python is Installed

Open PowerShell or Command Prompt and run:
```bash
python --version
```

OR

```bash
py --version
```

If you see a version number (like `Python 3.11.0`), Python is installed. If not, you need to install Python first.

## Step 2: Install Python (if needed)

1. Go to https://www.python.org/downloads/
2. Download Python 3.9 or newer
3. **IMPORTANT**: During installation, check the box "Add Python to PATH"
4. Complete the installation

## Step 3: Install Dependencies

Open PowerShell or Command Prompt in the `backend` folder and run:

```bash
cd backend
pip install -r requirements.txt
```

If `pip` doesn't work, try:
```bash
python -m pip install -r requirements.txt
```

OR

```bash
py -m pip install -r requirements.txt
```

## Step 4: Start the Backend

### Option 1: Using the Script (Easiest)

**For PowerShell:**
Right-click on `start_backend.ps1` and select "Run with PowerShell"

**For Command Prompt:**
Double-click `start_backend.bat`

### Option 2: Manual Start

Open PowerShell or Command Prompt in the `backend` folder:

```bash
cd backend
python app.py
```

OR

```bash
cd backend
py app.py
```

## Step 5: Verify It's Running

You should see output like:
```
 * Running on http://127.0.0.1:5001
```

The backend will be available at: **http://127.0.0.1:5001**

## Troubleshooting

### "Python is not recognized"
- Python is not installed or not in PATH
- Reinstall Python and make sure to check "Add Python to PATH"
- Or add Python manually to your system PATH

### "Module not found" errors
- Run `pip install -r requirements.txt` again
- Make sure you're in the `backend` folder

### Port already in use
- Another process is using port 5001
- Close other applications or change the port in `app.py` (line 1285)

### Database errors
- The database will be created automatically on first run
- If you see database errors, delete `app.db` and restart the server

## Quick Start Commands

```bash
# Navigate to backend folder
cd backend

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
python app.py
```

The server will run until you press `Ctrl+C` to stop it.

