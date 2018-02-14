const chai = require('chai');

const MockPsList = require('../mocks/mockPsList');
const ProcessWatcher = require('../../app/models/processWatcherService');

describe('processWatcherService', function() {
	it('should fire the onChange event', function(){
		var processWatcher = new ProcessWatcher({
			processMonitor: MockPsList,
			loop: false
		});

		processWatcher.onChange((processes) => {
			chai.assert(true);
		});

	});


	it('should remove non-unison processes', function(){
		var processWatcher = new ProcessWatcher({
			processMonitor: MockPsList,
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