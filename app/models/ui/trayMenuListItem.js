class TrayMenuListItem {
    constructor(options){
        if(!options.identifier || options.status == null){
            throw new ReferenceError('Missing one of required properties.')
        }
        this.label = options.identifier;
        this.id = options.identifier;
        this.path = TrayMenuListItem.getPathFromCommand(options.cmd);
        this.status = TrayMenuListItem.getStatusString(options.status);
    }

    static getStatusString(status) {
        const statusMap = {
            0: 	'mount-error',   //mount is broken
            1: 	'mount-active', //no activity, mounted
            2: 	'mount-pending' //activity is happening
        };

        return statusMap[status];
    }

    //gets the path from after "unison " but from before " socket"
    static getPathFromCommand(command){
        return command.split('unison ').pop().split(' socket:').shift();
    }
}

module.exports = TrayMenuListItem;