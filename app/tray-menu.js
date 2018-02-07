const {Menu, ipcMain, Tray} = require('electron')
const path = require('path')
const mounts = require('./mounts')

// Menu items that will be added after the list of mounts
const defaultMenuItems = [
  {type: 'separator'},
  {label: 'Check for Updates...'},
  {label: 'Quit Haystack', role: 'quit'}
]

module.exports = {

  // Create the main tray when the program starts
  createTray: () => {

    // Set the tray icon
    const tray = new Tray(path.join(imgDirectory, 'logoTemplate.png'))

    // Get list of mounts and their states
    mounts.getMountsForMenu().then(menuItems => {
      // Add the default menu items to the list
      menuItems.push(...defaultMenuItems)

      // Compile the menu and add it to the tray
      const contextMenu = Menu.buildFromTemplate(menuItems)
      tray.setContextMenu(contextMenu)
    })

    return tray
  }
}