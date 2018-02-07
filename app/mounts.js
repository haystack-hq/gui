const psList = require('ps-list');

const greenIcon = path.join(imgDirectory, 'circleGreen.png')
const redIcon = path.join(imgDirectory, 'circleRed.png')

module.exports = {

  // Get list of all running processes, filter the list down by whether
  // the command contains "unison" and "fswatch"
  getProcesses: () => {
    return psList().then(processes => {
        return processes.filter(process => {
          return process.cmd.indexOf('unison') > -1 || 
                 process.cmd.indexOf('fswatch') > -1
        })
      }
    )
  },

  // Return the mounts structured in a format ready for use in the menu
  getMountsForMenu: () => {
    const menuItems = [];
    return module.exports.getProcesses().then(processes => {
      processes.forEach(process => {
        menuItems.push({label: 'hello from pid '+process.pid, icon: greenIcon})
      })
      return menuItems
    })
  }
}