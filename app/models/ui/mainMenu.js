const {Menu, BrowserWindow} = require('electron');
const MountListItemConverter = require('./mountListItemConverter');

class MainMenu {
	constructor(options){
		this.eventEmitter = options.eventEmitter;
		this.subscribeToChange = options.subscribeToChange;
		this.tray = options.tray;
		this.icons = null;

		this.eventEmitter.on(this.subscribeToChange, (result) => {
			let converter = new MountListItemConverter(result.items);
			let menuItems = converter.to_menu_items();
			let titleCount = result.items.length;

			const contextMenu = Menu.buildFromTemplate(menuItems);
			this.tray.setContextMenu(contextMenu);
			this.tray.setTitle(titleCount.toString());
		});

		//add new event listener: listens to status changes of individual mounts
		//finds corresponding menu item and updates it

		//add event to look for syncing events to update the global icon
	}
}

module.exports = MainMenu;