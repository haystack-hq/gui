const processes = null;

class ProcessWatcherService {
	constructor(options){
        if(typeof options == 'undefined' || options.processMonitor == null )
        {
            throw new ReferenceError('Missing one of required properties.')
        }
        this.changeCallback = null;
		this.interval = 500;
		this.processMonitor = options.processMonitor;
        this.polling = true;
    }

    poll(){
        var self = this;
        if(this.polling){
            this.processMonitor().then(processes => {
                    var filtered = ProcessWatcherService.filterProcesses(processes);
                    self.changeCallback(filtered);
                    setTimeout(function() { self.poll() }, self.interval);
                }
            )
        }
    }

	// fire this callback every time setInterval polls for new process data
	onChange(callback) {
		this.changeCallback = callback;
	}

    startPolling() {
        this.polling = true;
        this.poll();
    }

    stopPolling() {
        this.polling = false;
    }

	// filter out all non-unison/fswatch processes
	static filterProcesses(processes) {
		return processes.filter(process => {
			return process.cmd.indexOf('unison') > -1
		});
	}
}

module.exports = ProcessWatcherService;