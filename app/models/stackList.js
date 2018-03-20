const JsonWatch = require('jsonwatch');
const jsonFile = require('jsonfile');
const {app} = require('electron');
const path = require('path');

class StackList {
	constructor(options){
		this.eventEmitter = options.eventEmitter;
		this.onChangeEvent = options.onChangeEvent;
		this.stackListFile = options.stackListFile;
		this.agentInterface = options.agentInterface;

		this.update();

		this.eventEmitter.on('stack-stream-update', data => {
			this.update();
		});
	}

	update() {
		this.agentInterface.getStacks((response, data) => {
			let parsed = JSON.parse(data);
			if(parsed){
				this.eventEmitter.emit(this.onChangeEvent, {items: parsed});
			}
		});
	}
}

module.exports = StackList;