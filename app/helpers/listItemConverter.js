const MountMenuListItem = require('../models/ui/mountMenuListItem');
const StackMenuListItem = require('../models/ui/stackMenuListItem');

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
		this.list = this.list.filter((obj, index, self) =>
			self.findIndex(t =>
				t.identifier === obj.identifier && t.status === obj.status
			) === index
		);

		this.list.forEach(mount => {
			let menuListItem = new conversionClass(mount);
			this.converted.push(menuListItem);
		});

		return this.converted;
	}
}

module.exports = ListItemConverter;