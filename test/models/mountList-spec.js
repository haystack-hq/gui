const chai = require('chai');
chai.use(require("chai-events"));

const EventEmitter = require("events");

const MockPsList = require('../mocks/mockPsList');
const MockPsListSync = require('../mocks/mockPsListSync');
const ProcessWatcher = require('../../app/models/processWatcherService');
const MountList = require('../../app/models/mountList');
const Mount = require('../../app/models/mount');

const assert = chai.assert;
const should = chai.should();
const appEvents = new EventEmitter();

describe('mountList', function() {
	it('should add item to list', function(){
		let processWatcher = new ProcessWatcher({processMonitor: MockPsList});
		let mountList = new MountList({
			processWatcher: processWatcher,
			onChangeEvent: 'mount-list-change',
			eventEmitter: appEvents
		});

		appEvents.should.emit('mount-list-change');

		appEvents.on('mount-list-change', (object) => {
			processWatcher.stopPolling();
			chai.expect(object.items.length).to.equal(1);
		});
	});

	it('should remove item from list', function(){
		let testMount = new Mount({
			identifier: 'test1',
			cmd: 'test process should be removed',
			unisonPid: 9999999,
			status: 1
		});

		let testMount2 = new Mount({
			identifier: 'test2',
			cmd: 'unison test should not be removed',
			unisonPid: 254,
			status: 1
		});

		let testMount3 = new Mount({
			identifier: 'test3',
			cmd: 'test process should be removed',
			unisonPid: 99993999,
			status: 1
		});

		let processWatcher = new ProcessWatcher({processMonitor: MockPsList});

		let mountList = new MountList({
			processWatcher: processWatcher,
			onChangeEvent: 'mount-list-change2',
			eventEmitter: appEvents
		});


		//appEvents.should.emit('mount-list-change2');

		mountList.addItem(testMount);
		mountList.addItem(testMount2);
		mountList.addItem(testMount3);

		processWatcher.stopPolling();

		//since we are adding 3 items, two which are added/removed,
		//we only want Chai to evaluate the second event trigger
		//as that is when the list will finish being sorted

		var i = 0;
		appEvents.on('mount-list-change2', (object) => {
			i++;
			if(i == 1){
				chai.expect(object.items.length).to.equal(2);
			}
		});
	});

	it('should change statuses when syncing', function(){
		let processWatcher = new ProcessWatcher({processMonitor: MockPsList});

		let mountList = new MountList({
			processWatcher: processWatcher,
			onChangeEvent: 'mount-list-change3',
			eventEmitter: appEvents
		});

		setTimeout(() => {
			processWatcher.stopPolling();
			processWatcher.processMonitor = MockPsListSync;
			processWatcher.startPolling();
		}, 100);

		setTimeout(() => {
			processWatcher.stopPolling();
			processWatcher.processMonitor = MockPsList;
			processWatcher.startPolling();
		}, 200);

		setTimeout(() => {
			processWatcher.stopPolling();
		}, 300);

		let i = 0;
		appEvents.on('mount-list-change3', (object) => {
			if(i == 0){
				i++;
				chai.expect(object.items[0].status).to.equal(1);
			}
			if(i == 2){
				i++;
				chai.expect(object.items[0].status).to.equal(2);
			}
		});

	});

	it('should return false if -label=X is not found', function(){
		let mockProcess = {
			cmd: 'process without label string'
		};
		chai.expect(MountList.decodeLabel(mockProcess)).to.equal(false);
	});

	it('should return false if base64 decode fails', function(){
		let mockProcess = {
			cmd: 'unison test -label=TESTeyJmb28iOiAiYmFyIn0='
		};
		chai.expect(MountList.decodeLabel(mockProcess)).to.equal(false);
	});
});