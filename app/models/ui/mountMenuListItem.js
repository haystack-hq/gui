class MountMenuListItem {
    constructor(options, position = null){
        if(!options.name || typeof options.status == 'undefined'){
            throw new ReferenceError('Missing one of required properties.')
        }
        this.label = options.name;
        this.image = this.getImageForStatus(options.status);
        this.position = position ? 'endof=' + position : 'endof=mounts';
    }

    getImageForStatus(status) {
        const imageMap = {
            0: 	'redCircle.png',
            1: 	'greenCircle.png',
            2: 	'yellowCircle.png'
        };

        return path.join(imgDirectory, imageMap[status]);
    }
}

module.exports = MountMenuListItem;