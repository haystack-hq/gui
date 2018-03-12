const {BrowserWindow} = require('electron').remote;
const path = require('path');

class AboutController {
    constructor(options){
        this.window = null;
        this.tray = options.tray;
        this.templateDirectory = options.templateDirectory;

        this.init();
    }

    init() {
        this.window = new BrowserWindow({
            width: 600,
            height: 300,
            useContentHeight: true,
            show: false,
            fullscreenable: false,
            resizable: false,
            webPreferences: {
                backgroundThrottling: true
            }
        });
        this.window.loadURL(`file://${path.join(this.templateDirectory, 'about.html')}`);
        this.window.on('close', () => {
            this.window = null;
        });
    }

    show() {
        this.window.once('ready-to-show', () => {
            this.window.show();
        });
        this.window.focus();
    }
}

module.exports = AboutController;