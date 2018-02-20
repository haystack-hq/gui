const {ipcRenderer} = require('electron');

class IndexView {
    constructor(options) {
        if(typeof options == undefined ||
            options.mountListSelector == null){
            throw new ReferenceError('Missing one of required properties.');
        }
        let self = this;
        this.data = [];
        this.mountListSelector = options.mountListSelector;

        this.view = new Vue({
            el: this.mountListSelector,
            data: {
                mounts: self.data
            }
        });

        //listen for changes from the main process
        ipcRenderer.on('mount-list-change' , function(event, data){
            self.data = data;
            self.view.mounts = self.data;
        });

        //once the DOM is ready, we fire off the main event to monitor mounts
        document.addEventListener('DOMContentLoaded', function () {
            ipcRenderer.send('dom-ready');
        });
    }
}


module.exports = IndexView;