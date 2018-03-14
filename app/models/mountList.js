const Mount = require('./mount');

class MountList {
	constructor(options){
		this.mounts = [];
		this.checkedIds = [];
		this.watched = [];
		this.processWatcher = options.processWatcher;
		this.eventEmitter = options.eventEmitter;
		this.onChangeEvent = options.onChangeEvent;

		this.processWatcher.onChange(processes => {
			//check all watched processes and see if any file transfers have wrapped up
			//if the sync process is gone, then we update the original process to a 'good' status
			this.checkWatchedProcesses(processes);

			// loop all mounts, check PIDs
			this.mounts.forEach(mount => {
				this.checkProcessesExist(processes, mount);
				this.checkProcessesNeedRemoval(processes, mount);
			});

			//filter all of the checked IDs so we are only left with new processes
			let newProcesses = processes.filter(process => {
				return this.checkedIds.indexOf(process.pid) == -1
			});

			//iterate over them
			newProcesses.forEach(process => {
				let decoded = MountList.decodeLabel(process);

				//if we have an initial sync (mount created with agent already running)
				//or if we have a watch command (mount created before the agent is launched)
				if(decoded.sync == 'initial' || process.cmd.indexOf('xargs -n1 -I{}') > -1){
					let mountOptions = {
						identifier: decoded.identifier,
						cmd: process.cmd,
						unisonPid: process.pid,
						status: (decoded.sync == 'initial' ? 2 : 1) //if initial, add as pending
					};

					let mount = new Mount(mountOptions);
					this.addItem(mount);
				}
				//otherwise, if the process is new but it is a watch command
				//then we update the watched processes list
				if(decoded.sync == 'watch' && process.cmd.indexOf('xargs -n1 -I{}') == -1) {
					let existingMount = this.mounts.filter(existingItem => {
						return existingItem.identifier == decoded.identifier;
					})[0];

					let mountIndex = this.mounts.indexOf(existingMount);

					if(mountIndex > -1){
						if(typeof existingMount != 'undefined' && this.mounts[mountIndex].status != 2){
							if(this.watched.indexOf(decoded.identifier) == -1){
								this.watched.push({
									identifier: decoded.identifier,
									pid: process.pid
								});
							}
							this.updateItemByIdentifier(decoded.identifier, 2);
						}
					}
				}
			});
		});

		this.processWatcher.startPolling();

	}

	//adds a new Mount to the list of Mounts
	addItem(mount){
		this.mounts.push(mount);
		this.onChange()
	};

	//removes the Mount from the list of Mounts
	removeItem(mount){
		this.mounts = this.mounts.filter(existingItem => {
			return existingItem.unisonPid !== mount.unisonPid
		});
		this.onChange();
	};

	//if a new process has been created/destroyed with the same identifier as the watch process
	//and it is a sync process, then we update the status of the watch process' Mount object
	updateItemByIdentifier(identifier, status){
		let itemToUpdate = this.mounts.filter(existingItem => {
			return existingItem.identifier == identifier;
		})[0];

		if(typeof itemToUpdate != 'undefined'){
			let mountIndex = this.mounts.indexOf(itemToUpdate);

			if(itemToUpdate.status != null && mountIndex > -1  && itemToUpdate.status != status){
				this.mounts[mountIndex].status = status;
				this.onChange();
			}
		}
	}

	onChange(){
		this.eventEmitter.emit(this.onChangeEvent, {items: this.mounts});
	}

	//check to see if a process already exists in the available mounts
	//if so, it's good -- we don't do anything with it, except mark that it has been evaluated
	checkProcessesExist(processes, mount){
		processes.forEach(process => {
			if (mount.unisonPid == process.pid && this.checkedIds.indexOf(process.pid) == -1) {
				this.checkedIds.push(process.pid);
			}
		});
	}

	//check to see if there are any processes that no longer exist, that we have mounts for
	//if we do, remove them
	checkProcessesNeedRemoval(processes, mount){
		const processIds = processes.map(p => { return p.pid });
		if(processIds.indexOf(mount.unisonPid) == -1){
			this.removeItem(mount);
			if(this.checkedIds.indexOf(mount.unisonPid) == -1){
				this.checkedIds.push(mount.unisonPid);
			}
		}
	}

	//check to see if any of the processes are no longer being watched
	//if they aren't, remove it from the watchlist and update the original mount list item
	checkWatchedProcesses(processes){
		this.watched.forEach(processData => {
			const processIds = processes.map(p => { return p.pid });
			if(processIds.indexOf(processData.pid) == -1){
				this.updateItemByIdentifier(processData.identifier, 1);
				this.watched = this.watched.filter(item => {
					return item.pid != processData.pid;
				})
			}
		});
	}

	//decode the '-label=' portion of a unison command to extract additional data from it
	static decodeLabel(process){
		const regex = /-label=([.!\S]*)/;
		let m = regex.exec(process.cmd);

		if (m !== null) {
			try {
				let decodedString = Buffer.from(m[1], 'base64').toString();
				return JSON.parse(decodedString);
			} catch(e) {
				return false;
			}
		}
		return false;
	}
}

module.exports = MountList;