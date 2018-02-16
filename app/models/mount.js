class Mount {
	constructor(options){
		if(typeof options == 'undefined' ||
			options.cmd == null ||
			options.identifier == null ||
			options.unisonPid == null )
		{
			throw new ReferenceError('Missing one of required properties.')
		}
		this.identifier = options.identifier;
		this.cmd = options.cmd;
		this.unisonPid = options.unisonPid;
		this.status = 1;
	}
}

module.exports = Mount;