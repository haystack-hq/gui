const {app, Tray, Menu} = require('electron');
const EventEmitter = require('events');

const path = require('path');
const assetsDirectory = path.join(__dirname, 'assets');
const imgDirectory = path.join(assetsDirectory, 'images');

const appEvents = new EventEmitter();

const MountList = require('./app/models/mountList');
const MainMenu = require('./app/models/ui/mainMenu');
const ProcessWatcher = require('./app/models/processWatcherService');

// Hide from dock
//app.dock.hide()

// Create the tray icon and initialize the menu
app.on('ready', () => {
	let tray = new Tray(path.join(imgDirectory, 'logoTemplate.png'));
	let processWatcher = new ProcessWatcher({
		processMonitor: require('ps-list')
	});

	let mountList = new MountList({
		processWatcher: processWatcher,
		onChangeEvent: 'mount-list-change',
		eventEmitter: appEvents
	});

	let menu = new MainMenu({
		tray: tray,
		eventEmitter: appEvents,
		subscribeToChange: 'mount-list-change',
	});
});