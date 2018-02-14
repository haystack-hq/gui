const {app, Tray, Menu} = require('electron');
const EventEmitter = require('events');

path = require('path');
appEvents = new EventEmitter();
assetsDirectory = path.join(__dirname, 'assets');
imgDirectory = path.join(assetsDirectory, 'images');

const MountList = require('./app/models/mountList');
const MainMenu = require('./app/models/mainMenu');
const MountMenuListItem = require('./app/models/ui/mountMenuListItem');
const ProcessWatcher = require('./app/models/processWatcherService');
const ListConverter = require('./app/models/ui/mountListItemConverter');

// Hide from dock
//app.dock.hide()

// Create the tray icon and initialize the menu
app.on('ready', () => {
	var tray = new Tray(path.join(imgDirectory, 'logoTemplate.png'));
	var processWatcher = new ProcessWatcher({
		processMonitor: require('ps-list')
	});

	var mountList = new MountList({
		processWatcher: processWatcher,
		onChangeEvent: 'mount-list-change'
	});

	const menu = new MainMenu({
		tray: tray,
		subscribeToChange: 'mount-list-change'
	});
});