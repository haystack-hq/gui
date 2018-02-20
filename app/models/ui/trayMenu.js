const {app, Menu, BrowserWindow} = require('electron');
const MountListItemConverter = require('./mountListItemConverter');

const path = require('path');

class TrayMenu {
	constructor(options){
		this.eventEmitter = options.eventEmitter;
		this.subscribeToChange = options.subscribeToChange;
		this.subscribeToStatusChange = options.subscribeToStatusChange;
		this.tray = options.tray;
		this.basePath = options.basePath;
		this.menu = null;
		this.menuHtml = options.menuHtml;
		this.menuItems = null;
		this.icon = null;

		this.templateDirectory = path.join(this.basePath, 'app/views/templates');
		this.imgDirectory = path.join(this.basePath, 'assets/images');

		this.createMenu();

		//add new event listener: listens to status changes of individual mounts
		//finds corresponding menu item and updates it
		this.eventEmitter.on(this.subscribeToChange, (result) => {
			let converter = new MountListItemConverter(result.items);
			this.menuItems = converter.to_menu_items();

			this.updateIcon();

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
		this.menu.loadURL(`file://${path.join(this.templateDirectory, 'index.html')}`);

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
		let y = 0;

		// Position window 4 pixels vertically below the tray icon
		if(process.platform == 'win32'){
			y = Math.round(trayBounds.y - trayBounds.height - 315);
		} else {
			y = Math.round(trayBounds.y + trayBounds.height + 4);
		}

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

	animateIcon() {
		let self = this;
		let direction = 1;
		let i = 1;

		const count = () => {
			i += direction;
			direction *= (((i % 3) == 0) ? -1 : 1);
			self.tray.setImage(path.join(self.imgDirectory, `anim${i}Template.png`));
		};

		this.icon = setInterval(count, 100);
	}

	resetIcon() {
		let self = this;
		clearInterval(this.icon);
		self.tray.setImage(path.join(self.imgDirectory, `logoTemplate.png`));
	}

	updateIcon() {
		let self = this;
		let pendingItems = this.menuItems.filter(item => {
			return item.cssClass == 'mount-pending';
		});

		if(pendingItems.length > 0){
			self.animateIcon();
		} else {
			self.resetIcon();
		}
	}
}

module.exports = TrayMenu;