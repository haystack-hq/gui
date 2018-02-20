const {Menu, BrowserWindow} = require('electron');
const MountListItemConverter = require('./mountListItemConverter');

class TrayMenu {
	constructor(options){
		this.eventEmitter = options.eventEmitter;
		this.subscribeToChange = options.subscribeToChange;
		this.subscribeToStatusChange = options.subscribeToStatusChange;
		this.tray = options.tray;
		this.menu = null;
		this.menuHtml = options.menuHtml;
		this.menuItems = null;

		this.createMenu();

		//add new event listener: listens to status changes of individual mounts
		//finds corresponding menu item and updates it
		this.eventEmitter.on(this.subscribeToChange, (result) => {
			let converter = new MountListItemConverter(result.items);
			this.menuItems = converter.to_menu_items();
			this.menu.webContents.send(this.subscribeToChange, this.menuItems);
		});
	}

	createMenu() {
		this.menu = new BrowserWindow({
			width: 300,
			height: 350,
			show: false,
			frame: false,
			fullscreenable: false,
			resizable: false,
			transparent: true,
			webPreferences: {
				// Prevents renderer process code from not running when window is
				// hidden
				backgroundThrottling: false
			}
		});
		this.menu.loadURL(this.menuHtml);

		this.tray.on('right-click', () => {  this.toggleMenu() });
		this.tray.on('double-click', () => { this.toggleMenu() });
		this.tray.on('click', () => { this.toggleMenu() });

		//hide the window when we click out of it, like an actual menu
		//this.menu.on('blur', this.menu.hide);
		this.menu.openDevTools({mode: 'detach'});
	}

	getMenuPosition() {
		const windowBounds = this.menu.getBounds();
		const trayBounds = this.tray.getBounds();

		// Center window horizontally below the tray icon
		const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

		// Position window 4 pixels vertically below the tray icon
		const y = Math.round(trayBounds.y + trayBounds.height + 4);

		return {x: x, y: y}
	}

	showMenu() {
		const position = this.getMenuPosition();
		this.menu.setPosition(position.x, position.y, false);
		this.menu.show();
		this.menu.focus();
	}

	toggleMenu() {
		if(this.menu.isVisible()){
			this.menu.hide();
		} else {
			this.showMenu();
		}
	}
}

module.exports = TrayMenu;