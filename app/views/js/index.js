const {ipcRenderer} = require('electron');

class IndexView {
    constructor() {
        let self = this;
        this.checkedIds = [];
        this.data = [];
        this.mountList = document.querySelector('#mount-list');

        this.view = new Vue({
            el: '#mount-list',
            data: {
                mounts: self.data
            }
        });

        //listen for changes from the main process
        ipcRenderer.on('mount-list-change' , function(event , data){
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