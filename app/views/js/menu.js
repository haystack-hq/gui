const {ipcRenderer} = require('electron');
const {app} = require('electron').remote;
const CommandRunner = require('../../helpers/commandRunner');
const StackController = require('../../controllers/stack');
const path = require('path');


class MenuView {
    constructor(options) {
        if(typeof options == 'undefined' ||
            options.mountListSelector == null){
            throw new ReferenceError('Missing one of required properties.');
        }
        let self = this;
        this.localStacks = [];
        this.mountListSelector = options.mountListSelector;

        this.view = new Vue({
            el: this.mountListSelector,
            data: {
                localStacks: self.localStacks
            },
            methods: {
                unmount: (identifier) => {self.unmount(identifier)},
                openStack: (stack) => {self.openStack(stack)}
            }
        });

        //listen for changes from the main process
        ipcRenderer.on('local-stack-list-change' , function(event, data){
            self.localStacks = data;
            self.view.localStacks = self.localStacks;
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

    openStack(stack){
        ipcRenderer.send('stack-open', stack);
        //let stackController = new StackController({
        //    stack: stack,
        //    templateDirectory: path.join(__dirname, '../templates')
        //});
        //stackController.show();
    }

    static exit(){
        app.quit();
    }
}


module.exports = MenuView;