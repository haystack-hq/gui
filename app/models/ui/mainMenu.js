const {Menu, BrowserWindow} = require('electron');
const MountListItemConverter = require('./mountListItemConverter');

class MainMenu {
	constructor(options){
		this.eventEmitter = options.eventEmitter;
		this.subscribeToChange = options.subscribeToChange;
		this.subscribeToStatusChange = options.subscribeToStatusChange;
		this.tray = options.tray;
		this.menu = null;
		this.menuItems = null;

		//add new event listener: listens to status changes of individual mounts
		//finds corresponding menu item and updates it
		this.eventEmitter.on(this.subscribeToChange, (result) => {
			let converter = new MountListItemConverter(result.items);
			this.menuItems = converter.to_menu_items();

			this.addMenuDefaults();

			this.menu = new Menu.buildFromTemplate(this.menuItems);

			this.tray.setContextMenu(this.menu);
		});
	}

	//add the menu items that appear under the divider
	addMenuDefaults(){
		let defaultMenuItems = [
			{type: 'separator'},
			{label: 'Check for Updates...'},
			{label: 'Quit Haystack', role: 'quit'}
		];
		this.menuItems.push(...defaultMenuItems);
	}
}

module.exports = MainMenu;