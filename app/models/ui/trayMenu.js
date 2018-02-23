const {app, Menu, ipcMain} = require('electron');
const ListItemConverter = require('./listItemConverter');
const MenuController = require('../../controllers/menu');
const StackController = require('../../controllers/stack');
const StatusConverter = require('../../helpers/statusConverter');

const path = require('path');

class TrayMenu {
	constructor(options){
		this.eventEmitter = options.eventEmitter;
		this.mountChangeEvent = options.mountChangeEvent;
		this.localStackChangeEvent = options.localStackChangeEvent;
		this.tray = options.tray;
		this.basePath = options.basePath;
		this.menu = null;
		this.stackItems = [];
		this.mountItems = [];
		this.icon = null;

		this.templateDirectory = path.join(this.basePath, 'app/views/templates');
		this.imgDirectory = path.join(this.basePath, 'assets/images');

		this.createMenu();

		//add new event listener: listens to status changes of individual mounts
		//finds corresponding menu item and updates it
		this.eventEmitter.on(this.mountChangeEvent, (result) => {
			let converter = new ListItemConverter(result.items);
			this.mountItems = converter.mounts_to_menu_items();

			this.updateIcon();

			this.eventEmitter.emit(this.localStackChangeEvent, this.stackItems);
		});

		this.eventEmitter.on(this.localStackChangeEvent, (result) => {
			if(result.items){
				let converter = new ListItemConverter(result.items);
				this.stackItems = converter.stacks_to_menu_items();
			}

			this.updateStacks();

			this.menu.window.webContents.send(this.localStackChangeEvent, this.stackItems);
		});

		ipcMain.on('stack-open', (event, data) => {
			let stackController = new StackController({
				stack: data,
				templateDirectory: this.templateDirectory
			});
			stackController.show();
			stackController.window.webContents.send('stack-load', data)
		});
	}

	createMenu() {
		this.menu = new MenuController({
			templateDirectory: this.templateDirectory,
			tray: this.tray
		});

		//hide the window when we click out of it, like an actual menu
		//this.menu.on('blur', this.menu.hide);
		this.menu.window.openDevTools({mode: 'detach'});
	}

	openStack(stack) {
	}

	animateIcon() {
		let self = this;
		let i = 1;

		const count = () => {
			if(i >= 15) { i = 1 }
			self.tray.setImage(path.join(self.imgDirectory, `slide/anim${i}Template.png`));
			i += 1;
		};

		this.icon = setInterval(count, 50);
	}

	resetIcon() {
		clearInterval(this.icon);
		this.tray.setImage(path.join(this.imgDirectory, `logoTemplate.png`));
	}

	updateIcon() {
		let pendingItems = this.mountItems.filter(item => {
			return item.status == 'mount-pending';
		});

		if(pendingItems.length > 0){
			this.animateIcon();
		} else {
			this.resetIcon();
		}
	}

	updateStacks() {
		let mountedStacks = [];
		this.stackItems.forEach((stack, index) => {
			this.mountItems.forEach(mount => {
				if(stack.id == mount.id){
					if(mountedStacks.indexOf(stack.id) == -1){
						mountedStacks.push(stack.id);
					}
					this.stackItems[index].status = mount.status;
				}
			});
			if(mountedStacks.indexOf(stack.id) == -1){
				this.stackItems[index].status = StatusConverter.getStatusString(3);
			}
		});
	}
}

module.exports = TrayMenu;