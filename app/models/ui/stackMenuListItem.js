const StatusConverter = require('../../helpers/statusConverter');

class StackMenuListItem {
    constructor(options){
        if(!options.identifier){
            throw new ReferenceError('Missing one of required properties.')
        }
        this.label = options.identifier;
        this.id = options.identifier;
        this.status = StatusConverter.getStatusString(3); //no mount by default
    }
}

module.exports = StackMenuListItem;