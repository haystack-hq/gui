const {app, Tray, Menu, ipcMain} = require('electron');
const EventEmitter = require('events');
const request = require('request');
const WebSocket = require('ws');

const path = require('path');
const assetsDirectory = path.join(__dirname, 'assets');
const imgDirectory = path.join(assetsDirectory, 'images');

const appEvents = new EventEmitter();

const AgentInterface = require('./app/helpers/agentInterface');
const MountList = require('./app/models/mountList');
const StackList = require('./app/models/stackList');
const TrayMenu = require('./app/models/ui/trayMenu');
const ProcessWatcher = require('./app/models/processWatcherService');

// Hide from dock
if(app.dock){
	app.dock.hide();
}

// Create the tray icon and initialize the menu
app.on('ready', () => {
	app.setName('Haystack Toolbar');

	let tray = new Tray(path.join(imgDirectory, 'logoTemplate.png'));

	let menu = new TrayMenu({
		tray: tray,
		eventEmitter: ipcMain,
		mountChangeEvent: 'mount-list-change',
		stackChangeEvent: 'stack-list-change',
		socketOpenEvent: 'socket-open',
		basePath: __dirname
	});

	ipcMain.on('dom-ready', () => {
		let agentInterface = new AgentInterface({
			url: 'localhost',
			port: '3059',
			requestHandler: request,
			webSocketHandler: WebSocket,
			eventEmitter: ipcMain,
			socketOpenEvent: 'socket-open',
			protocol: 'http://'
		});

		let stackList = new StackList({
			onChangeEvent: 'stack-list-change',
			eventEmitter: ipcMain,
			stackListFile: path.join(__dirname, 'stackdata.json'),
			agentInterface: agentInterface
		});

		app.on('before-quit', () => {
			agentInterface.hasError = true; //stops the connection from retrying
			agentInterface.socket.close();
		});
	});
});