const {app, Tray, Menu, ipcMain} = require('electron');
const EventEmitter = require('events');

const path = require('path');
const assetsDirectory = path.join(__dirname, 'assets');
const imgDirectory = path.join(assetsDirectory, 'images');

const appEvents = new EventEmitter();

const MountList = require('./app/models/mountList');
const StackList = require('./app/models/stackList');
const TrayMenu = require('./app/models/ui/trayMenu');
const ProcessWatcher = require('./app/models/processWatcherService');

// Hide from dock
app.dock.hide();

// Create the tray icon and initialize the menu
app.on('ready', () => {
	let tray = new Tray(path.join(imgDirectory, 'logoTemplate.png'));

	let menu = new TrayMenu({
		tray: tray,
		eventEmitter: ipcMain,
		mountChangeEvent: 'mount-list-change',
		stackChangeEvent: 'stack-list-change',
		basePath: __dirname
	});

	ipcMain.on('dom-ready', () => {
		let stackList = new StackList({
			onChangeEvent: 'stack-list-change',
			eventEmitter: ipcMain,
			stackListFile: path.join(__dirname, 'stackdata.json')
		});

		let processWatcher = new ProcessWatcher({
			processMonitor: require('ps-list')
		});

		let mountList = new MountList({
			processWatcher: processWatcher,
			onChangeEvent: 'mount-list-change',
			eventEmitter: ipcMain
		});
	});
	app.setName('Haystack Toolbar');
});