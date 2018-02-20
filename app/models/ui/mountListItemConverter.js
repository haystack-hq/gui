const MountMenuListItem = require('./mountMenuListItem');

class MountListItemConverter {
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

	to_menu_items(){
		return this.converter(MountMenuListItem);
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
}
module.exports = MountListItemConverter;