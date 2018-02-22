const {ipcRenderer} = require('electron');
const CommandRunner = require('../../helpers/commandRunner');

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
            },
            methods: {
                unmount: (identifier) => {self.unmount(identifier)}
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

    unmount(identifier){
        let cmd = new CommandRunner(`con unmount -i ${identifier}`);
        cmd.get_output(function(err, out, stderr){
            console.log('done');
        });
    }
}


module.exports = IndexView;