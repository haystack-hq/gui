const MountMenuListItem = require('./mountMenuListItem');

class MountListItemConverter {
	constructor(mountList) {
		if(mountList == null){
			throw new ReferenceError('Missing list of mounts.')
		}
		if(!(mountList instanceof Array)){
			throw new TypeError('List provided is not an array.')
		}
		this.list = mountList;
	}

	to_menu_items(){
		return this.converter(MountMenuListItem);
	}

	converter(conversionClass){
		if (typeof conversionClass !== 'function'){
			throw new TypeError('Conversion class is invalid.')
		}
		let converted = [];

		this.list.forEach(mount => {
			let menuListItem = new conversionClass(mount);
			converted.push(menuListItem);
		});

		return converted;
	}
}
module.exports = MountListItemConverter;