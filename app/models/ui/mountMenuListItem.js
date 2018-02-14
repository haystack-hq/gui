const {app} = require('electron');
const path = require('path');
const basePath = (typeof app == 'undefined') ? __dirname : app.getAppPath();
const assetsDirectory = path.join(basePath, 'assets');
const imgDirectory = path.join(assetsDirectory, 'images');


class MountMenuListItem {
    constructor(options){
        if(!options.identifier || options.status == null){
            throw new ReferenceError('Missing one of required properties.')
        }
        this.label = options.identifier;
        this.icon = MountMenuListItem.getIconForStatus(options.status);
        this.position = options.position != null ? 'endof=' + options.position : 'endof=mounts';
    }

    static getIconForStatus(status) {
        const iconMap = {
            0: 	'circleRed.png',
            1: 	'circleGreen.png',
            2: 	'circleYellow.png'
        };

        return path.join(imgDirectory, iconMap[status]);
    }
}

module.exports = MountMenuListItem;