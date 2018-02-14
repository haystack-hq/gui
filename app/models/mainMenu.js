const {Menu} = require('electron');

class MainMenu {
	constructor(options){
		this.subscribeToChange = options.subscribeToChange;
		this.tray = options.tray;

		appEvents.on(this.subscribeToChange, (result) => {
			//todo: tie in to converter

			const contextMenu = Menu.buildFromTemplate(result.items);
			this.tray.setContextMenu(contextMenu);
			this.tray.setTitle("test");
		});
	}
}

module.exports = MainMenu;