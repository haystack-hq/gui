const MountMenuListItem = require('./mountMenuListItem');
const StackMenuListItem = require('./stackMenuListItem');

class ListItemConverter {
	constructor(mountList) {
		if(mountList == null){
			throw new ReferenceError('Missing list of mounts.')
		}
		if(!(mountList instanceof Array)){
			throw new TypeError('List provided is not an array.')
		}
		this.converted = [];
		this.list = mountList;
	}

	mounts_to_menu_items(){
		return this.converter(MountMenuListItem);
	}

	stacks_to_menu_items(){
		return this.converter(StackMenuListItem);
	}

	converter(conversionClass){
		this.converted = [];
		if (typeof conversionClass !== 'function'){
			throw new TypeError('Conversion class is invalid.')
		}

		//remove heartbeat duplicates
		this.list = this.list.filter((thing, index, self) =>
			self.findIndex(t =>
				t.identifier === thing.identifier && t.status === thing.status
			) === index
		);

		this.list.forEach(mount => {
			let menuListItem = new conversionClass(mount);
			this.converted.push(menuListItem);
		});

		return this.converted;
	}


	static getStatusString(status) {
		const statusMap = {
			0: 'mount-error',   //mount is broken
			1: 'mount-active', //no activity, mounted
			2: 'mount-pending', //activity is happening
			3: 'mount-none'
		};

		return statusMap[status];
	}
}

module.exports = ListItemConverter;