# A Dummy's Guide to Packaging a Web Game with Electron

This guide details the process of converting a web-based game (built with HTML, CSS, and JavaScript) into a standalone Windows executable (`.exe`).

### The Big Picture

Your game runs in a web browser. To make it a desktop app, we use **Electron**. Think of Electron as a mini-Chrome browser that we wrap around your game. It creates a desktop window and loads your `index.html` file inside it, making your game look and feel like a native application.

---

### Step 1: Prerequisites & Project Setup

First, you need the basic toolkit for modern JavaScript development.

1.  **Install Node.js & npm:**
    Go to [nodejs.org](https://nodejs.org/) and download the **LTS** version. The installer includes both `node.js` and `npm`.

2.  **Open Your Terminal:**
    On Windows, search for `cmd` or `PowerShell` in the Start Menu.

3.  **Navigate to Your Project Folder:**
    Use the `cd` (change directory) command to move your terminal into your game's main folder.
    ```bash
    cd C:\path\to\your\game
    ```

---

### Step 2: Initialize the Node.js Project

Create a `package.json` file, which acts as the "blueprint" for your application.

1.  **Run the Init Command:**
    In your terminal (inside your project folder), run:
    ```bash
    npm init -y
    ```
2.  **Result:** This instantly creates a `package.json` file.

---

### Step 3: Install Dependencies

We need two main tools: `electron` to run the app and `electron-builder` to package it.

1.  **Run the Install Command:**
    This command installs both tools as "development dependencies."
    ```bash
    npm install --save-dev electron electron-builder
    ```
2.  **Result:** A `node_modules` folder and a `package-lock.json` file will appear, containing the code for these tools.

---

### Step 4: Create the Main Electron Script

This script is the "ignition switch" for your app. It creates the window and loads your game.

1.  **Create a file** named `main.js` in your project's root folder.
2.  **Add the following code** to `main.js`:

    ```javascript
    // main.js
    const { app, BrowserWindow } = require('electron');
    const path = require('path');

    function createWindow() {
      // Create the browser window.
      const mainWindow = new BrowserWindow({
        width: 1800,
        height: 980,
        webPreferences: {
          // It is good practice to disable nodeIntegration for security
          nodeIntegration: false,
          contextIsolation: true,
        }
      });

      // Load the index.html of the app.
      mainWindow.loadFile('index.html');

      // Optional: Remove the default menu bar
      mainWindow.setMenuBarVisibility(false);
    }

    app.whenReady().then(createWindow);

    app.on('window-all-closed', () => {
      // On macOS, apps often stay open. On other platforms, we quit.
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      // For macOS: re-create a window when the dock icon is clicked.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
    ```

---

### Step 5: Prepare the Application Icon

A good icon is crucial for a professional look.

1.  **Create the Source Image:** Design a square `.png` image (e.g., 256x256 pixels). **Important:** The artwork should have about 10-15% transparent padding around it to prevent it from being cropped on the Windows taskbar.
2.  **Convert to `.ico`:** Use a free online tool like [icoconverter.com](https://icoconverter.com/) to convert your padded `.png` to a `.ico` file. When converting, select **all available sizes** (16, 32, 48, 64, 128, 256 pixels).
3.  **Place the Icon:**
    *   Create a new folder named `build` in your project's root directory.
    *   Place your converted icon inside this folder and name it `icon.ico`.

---

### Step 6: Configure `package.json` for Building

Now we update our "blueprint" with all the final instructions.

1.  **Replace the contents of `package.json`** with the following. This adds the build command and configures Electron Builder.

    ```json
    {
      "name": "idle_looter",
      "version": "1.0.0",
      "description": "Idle RPG Looter Game",
      "main": "main.js",
      "scripts": {
        "start": "electron .",
        "pack": "electron-builder"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "electron": "^31.0.1",
        "electron-builder": "^24.9.1"
      },
      "build": {
        "appId": "com.mygame.idlerpglooter",
        "productName": "Idle RPG Looter",
        "files": [
          "**/*",
          "!node_modules/**/*"
        ],
        "win": {
          "target": "portable",
          "icon": "build/icon.ico"
        }
      }
    }
    ```

---

### Step 7: Test and Build

With everything configured, we can now run and package the application.

1.  **Test Locally (Optional but Recommended):**
    Run this command to see your game in a desktop window.
    ```bash
    npm start
    ```

2.  **Build the Executable:**
    Run this command to package your game.
    ```bash
    npm run pack
    ```
    **Troubleshooting:** If you get a "Symbolic Link" or "privilege" error on Windows, close your terminal and re-open it by right-clicking its icon and selecting **"Run as administrator"**. Then navigate back to your folder and run the command again.

3.  **Find Your Game:**
    After the build is complete, a new folder named `dist` will appear. Inside it, you will find your standalone game, e.g., `Idle RPG Looter 1.0.0.exe`.

---

### Step 8: Updating Your Game

Your game's save data is stored safely in a separate user folder (`%AppData%` on Windows). It is **not** stored with the `.exe`.

To update your game:
1.  Make changes to your code.
2.  Run `npm run pack` again.
3.  Replace the old `.exe` file in the `dist` folder with the new one.
4.  Your save progress will be loaded automatically by the new version.