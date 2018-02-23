const {app, BrowserWindow} = require('electron');
const path = require('path');

class StackController {
    constructor(options){
        this.window = null;
        this.stack = options.stack;
        this.templateDirectory = options.templateDirectory;

        this.init();
    }

    init() {
        this.window = new BrowserWindow({
            show: false,
            fullscreenable: false,
            resizable: false
        });
        this.window.loadURL(`file://${path.join(this.templateDirectory, 'stack.html')}`);
        this.window.openDevTools({mode: 'detach'});
    }

    show() {
        this.window.once('ready-to-show', () => {
            this.window.webContents.send('stack-load', this.stack);
            this.window.show();
            app.dock.show();
        });
        this.window.focus();
    }
}

module.exports = StackController;