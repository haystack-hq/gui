const chai = require('chai');

const MockPsList = require('../mocks/mockPsList');
const ProcessWatcher = require('../../app/models/processWatcherService');

describe('processWatcherService', function() {
	it('should throw exception from missing properties', function(){
		chai.expect(() =>
				new ProcessWatcher()
		).to.throw('Missing one of required properties.');
	});

	it('should fire the onChange event', function(){
		var processWatcher = new ProcessWatcher({
			processMonitor: MockPsList
		});

		processWatcher.onChange((processes) => {
			processWatcher.stopPolling();
			chai.assert(true);
		});

	});

	it('should remove non-unison processes', function(){
		var processWatcher = new ProcessWatcher({
			processMonitor: MockPsList
		});

		processWatcher.onChange((processes) => {
			var processCount = 0;
			processes.forEach(process => {
				if(process.cmd.indexOf('unison') > -1){
					processCount++;
				}
			});

			processWatcher.stopPolling();

			//number of processes containing unison
			//should match the total number of processes
			chai.expect(processCount).to.equal(processes.length);
		});

	});
});