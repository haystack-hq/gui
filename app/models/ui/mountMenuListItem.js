class MountMenuListItem {
    constructor(options){
        if(!options.identifier || options.status == null){
            throw new ReferenceError('Missing one of required properties.')
        }
        this.label = options.identifier;
        this.id = options.identifier;
        this.path = MountMenuListItem.getPathFromCommand(options.cmd);
        this.status = options.status;
    }

    //gets the path from after "unison " but from before " socket"
    static getPathFromCommand(command){
        return command.split('unison ').pop().split(' socket:').shift();
    }
}

module.exports = MountMenuListItem;