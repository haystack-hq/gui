const processes = null;

class ProcessWatcherService {
	constructor(options){
		var self = this;
		//todo: add check for required params (changeCallback and processMonitor)
		this.changeCallback = null;
		this.interval = 500;
		this.processMonitor = options.processMonitor;
        this.polling = true;
    }

    poll(){
        if(this.polling){
            self.processMonitor().then(processes => {
                    var filtered = ProcessWatcherService.filterProcesses(processes);
                    self.changeCallback(filtered);
                    setTimeout(self.poll, self.interval);
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