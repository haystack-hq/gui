const {BrowserWindow} = require('electron');
const path = require('path');

class MenuController {
    constructor(options){
        this.window = null;
        this.tray = options.tray;
        this.templateDirectory = options.templateDirectory;

        this.init();
    }

    init() {
        this.window = new BrowserWindow({
            width: 300,
            height: 400,
            show: false,
            frame: false,
            fullscreenable: false,
            resizable: false,
            transparent: true,
            webPreferences: {
                backgroundThrottling: true
            }
        });
        this.window.loadURL(`file://${path.join(this.templateDirectory, 'menu.html')}`);

        this.tray.on('right-click', () => {  this.toggle() });
        this.tray.on('double-click', () => { this.toggle() });
        this.tray.on('click', () => { this.toggle() });
    }

    show() {
        const position = this.getPosition();
        this.window.setPosition(position.x, position.y, false);
        this.window.show();
        this.window.focus();
    }

    toggle() {
        if(this.window.isVisible()){
            this.window.hide();
        } else {
            this.show();
        }
    }

    getPosition() {
        const windowBounds = this.window.getBounds();
        const trayBounds = this.tray.getBounds();

        // Center window horizontally below the tray icon
        const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
        let y = 0;

        if(process.platform == 'win32'){
            // Windows: position window directly above the tray icon
            y = Math.round(trayBounds.y - trayBounds.height - 315);
        } else {
            // OSX: position window 4 pixels vertically below the tray icon
            y = Math.round(trayBounds.y + trayBounds.height + 4);
        }

        return {x: x, y: y}
    }

}

module.exports = MenuController;