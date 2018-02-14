const Mount = require('./mount');
const MountListItemConverter = require('./ui/mountListItemConverter');

class MountList {
	constructor(options){
		let self = this;
		this.mounts = [];
		this.checkedIds = [];
		this.processWatcher = options.processWatcher;
		this.eventEmitter = options.eventEmitter;
		this.onChangeEvent = options.onChangeEvent;

		this.processWatcher.onChange(function(processes){
			// loop all mounts, check PIDs
			self.mounts.forEach(mount => {
				self.checkProcessesExist(processes, mount);
				self.checkProcessesNeedRemoval(processes, mount);
			});

			//filter all of the checked IDs so we are only left with new processes
			var newProcesses = processes.filter(process => {
				return self.checkedIds.indexOf(process.pid) == -1
			});

			//iterate over them
			newProcesses.forEach(process => {
				var decoded = MountList.decodeLabel(process);

				//add check to make sure we aren't adding updates as new mounts
				var mountOptions = {
					identifier: decoded.identifier,
					cmd: process.cmd,
					unisonPid: process.pid
				};

				var mount = new Mount(mountOptions);
				self.addItem(mount);
			});

			//look for changes to items
			//fire change event --
		});

		this.processWatcher.startPolling();

	}

	addItem(mount){
		this.mounts.push(mount);
		this.onChange()
	};

	removeItem(mount){
		this.mounts = this.mounts.filter(function(existingItem) {
			return existingItem.unisonPid !== mount.unisonPid
		});
		this.onChange();
	};

	onChange(){
		this.eventEmitter.emit(this.onChangeEvent, {items: this.mounts});
	}

	checkProcessesExist(processes, mount){
		processes.forEach(process => {
			if (mount.unisonPid == process.pid) {
				this.checkedIds.push(process.pid);
			}
		});
	}

	checkProcessesNeedRemoval(processes, mount){
		const processIds = processes.map(p => { return p.pid });
		if(processIds.indexOf(mount.unisonPid) == -1){
			this.removeItem(mount);
			this.checkedIds.push(process.pid);
		}
	}

	static decodeLabel(process){
		const regex = /-label=([.!\S]*)/;
		var m = regex.exec(process.cmd);

		if (m !== null) {
			try {
				var decodedString = Buffer.from(m[1], 'base64').toString();
				return JSON.parse(decodedString);
			} catch(e) {
				return false;
			}
		}
		return false;
	}
}

module.exports = MountList;