const {app, BrowserWindow, Menu} = require('electron');
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
            resizable: true,
            height: 900,
            width: 1200,
            minHeight: 700,
            minWidth: 1000,
            webPreferences: {
                backgroundThrottling: true
            }
        });
        this.window.loadURL(`file://${path.join(this.templateDirectory, 'stack.html')}`);
        this.window.openDevTools({mode: 'detach'});

        this.window.on('close', () => {
            this.window = null;
            if(app.dock){
                app.dock.hide();
            }
        });

        //this will prevent users from reloading the window with keyboard shortcuts
        //let template = [
        //    { label: app.getName(), submenu: [
        //        { label: 'Quit', role: "quit" }
        //    ] }
        //];
        //
        //const menu = Menu.buildFromTemplate(template);
        //Menu.setApplicationMenu(menu);
    }

    show() {
        this.window.once('ready-to-show', () => {
            this.window.webContents.send('stack-load', this.stack);
            this.window.show();
            if(app.dock){
                app.dock.show();
            }
        });
        this.window.focus();
    }
}

module.exports = StackController;