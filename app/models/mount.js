class Mount {
	constructor(options){
		if(typeof options == 'undefined' || !options.name || !options.unisonPid || !options.fswatchPid){
			throw new ReferenceError('Missing one of required properties.')
		}
		this.name = options.name;
		this.unisonPid = options.unisonPid;
		this.fswatchPid = options.fswatchPid;
		this.status = 1
	}
}

module.exports = Mount;