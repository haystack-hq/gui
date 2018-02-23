const JsonWatch = require('jsonwatch');
const jsonFile = require('jsonfile');
const {app} = require('electron');
const path = require('path');

class StackListLocal {
	constructor(options){
		let self = this;
		this.eventEmitter = options.eventEmitter;
		this.onChangeEvent = options.onChangeEvent;
		this.stackListFile = options.stackListFile;

		jsonFile.readFile(this.stackListFile, (err, obj) => {
			this.eventEmitter.emit(this.onChangeEvent, {items: obj.local});
		});

		const listMonitor = new JsonWatch(this.stackListFile);

		listMonitor.on('cng', (path, before, after) => {
			this.eventEmitter.emit(this.onChangeEvent, {items: after});
		});
	}
}

module.exports = StackListLocal;