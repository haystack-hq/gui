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
			console.log(data);
			this.update();
		});
	}

	update() {
		try {
			this.agentInterface.getStacks((response, data) => {
				let parsed = JSON.parse(data);
				if(parsed){
					this.eventEmitter.emit(this.onChangeEvent, {items: parsed});
				}
			});
		} catch(ex){
			console.log('eh');
		}

	}
}

module.exports = StackList;