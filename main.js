const {app, ipcMain} = require('electron')

path = require('path')
appDirectory = path.join(__dirname, 'app')
assetsDirectory = path.join(__dirname, 'assets')
imgDirectory = path.join(assetsDirectory, 'images')

const trayMenu = require('./app/tray-menu')

// Make the tray globally available to attach to whatever events we want
let tray = undefined

// Hide from dock
app.dock.hide()

// Create the tray icon and initialize the menu
app.on('ready', () => {
  tray = trayMenu.createTray()
})
