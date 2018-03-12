const StatusConverter = require('../../helpers/statusConverter');

class StackMenuListItem {
    constructor(options){
        if(!options.identifier || !options.status){
            throw new ReferenceError('Missing one of required properties.')
        }
        this.id = options._id;
        this.identifier = options.identifier;
        this.provider = options.provider;
        this.status = options.status;
        this.mountStatus = options.mount_status;
        this.health = options.health;
        this.services = options.services;
        this.state = StatusConverter.getStateFromStatus(options.status);
    }
}

module.exports = StackMenuListItem;