const chai = require('chai');
chai.use(require("chai-events"));

const EventEmitter = require("events");


const MockPsList = require('../mocks/mockPsList');
const ProcessWatcher = require('../../app/models/processWatcherService');
const MountList = require('../../app/models/mountList');

const assert = chai.assert;
appEvents = new EventEmitter();

describe('mountList', function() {
	it('should add item to list', function(){
		var processWatcher = new ProcessWatcher({processMonitor: MockPsList, loop: false});
		var mountList = new MountList({
			processWatcher: processWatcher,
			onChangeEvent: 'mount-list-change'
		});

		appEvents.on('mount-list-change', (object) => {
			chai.expect(object.items.list.length).to.equal(1);
		});
	});

	it('should return false if -label=X is not found', function(){
		var mockProcess = {
			cmd: 'process without string'
		};
		chai.expect(MountList.decodeLabel(mockProcess)).to.equal(false);
	});

	it('should return false if base64 decode fails', function(){
		var mockProcess = {
			cmd: 'unison test -label=c2RzZHZzZHZzbG93OTRnfff'
		};
		console.log(MountList.decodeLabel(mockProcess));
	});
});