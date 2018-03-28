const {app, Menu, ipcMain} = require('electron');
const MenuController = require('../../controllers/menu');
const StackController = require('../../controllers/stack');

const path = require('path');

class TrayMenu {
	constructor(options){
		this.eventEmitter = options.eventEmitter;
		this.mountChangeEvent = options.mountChangeEvent;
		this.stackChangeEvent = options.stackChangeEvent;
		this.socketOpenEvent = options.socketOpenEvent;
		this.tray = options.tray;
		this.basePath = options.basePath;
		this.menu = null;
		this.stackItems = [];
		this.icon = null;

		this.templateDirectory = path.join(this.basePath, 'app/views/templates');
		this.imgDirectory = path.join(this.basePath, 'assets/images');

		this.createMenu();

		this.onStackOpen();

		this.onSocketChange();

		this.onStackChange();
	}

	createMenu() {
		this.menu = new MenuController({
			templateDirectory: this.templateDirectory,
			tray: this.tray
		});

		//hide the window when we click out of it, like an actual menu
		//this.menu.on('blur', this.menu.hide);
		//this.menu.window.openDevTools({mode: 'detach'});
	}

	animateIcon() {
		let i = 1;

		const count = () => {
			if(i >= 15) { i = 1 }
			this.tray.setImage(path.join(this.imgDirectory, `slide/anim${i}Template.png`));
			i += 1;
		};

		this.icon = setInterval(count, 50);
	}

	resetIcon() {
		clearInterval(this.icon);
		this.tray.setImage(path.join(this.imgDirectory, `logoTemplate.png`));
	}

	updateIcon() {
		let pendingItems = this.stackItems.filter(item => {
			return item.status == 'provisioning';
		});

		if(pendingItems.length > 0){
			this.animateIcon();
		} else {
			this.resetIcon();
		}
	}

	onStackChange() {
		this.eventEmitter.on(this.stackChangeEvent, (result) => {
			this.stackItems = result.items;

			this.updateIcon();

			this.menu.window.webContents.send(this.stackChangeEvent, this.stackItems);
		});
	}

	onSocketChange() {
		this.eventEmitter.on(this.socketOpenEvent, (result) => {
			this.menu.window.webContents.send(this.socketOpenEvent, result);
		});
	}

	onStackOpen() {
		//use the event emitter that is tied to the renderer processes
		ipcMain.on('stack-open', (event, data) => {
			let stackController = new StackController({
				stack: data,
				templateDirectory: this.templateDirectory
			});
			stackController.show();
			stackController.window.webContents.send('stack-load', data);
			this.eventEmitter.on(this.stackChangeEvent, (event, data) => {
				if(stackController.window){
					stackController.window.webContents.send('stacks-updated', this.stackItems);
				}
			});
			this.eventEmitter.on(this.socketOpenEvent, (result) => {
				if(stackController.window){
					stackController.window.webContents.send(this.socketOpenEvent, result);
				}
			});
		});
	}
}

module.exports = TrayMenu;