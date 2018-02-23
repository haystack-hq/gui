const {ipcRenderer} = require('electron');
const {app} = require('electron').remote;
const CommandRunner = require('../../helpers/commandRunner');
const StackController = require('../../controllers/stack');
const path = require('path');


class StackView {
    constructor(options) {
        if(typeof options == 'undefined' ||
            options.pageSelector == null){
            throw new ReferenceError('Missing one of required properties.');
        }
        let self = this;
        this.stack = null;
        this.pageSelector = options.pageSelector;

        this.view = new Vue({
            el: this.pageSelector,
            data: {
                stack: this.stack
            }
        });

        //get the stack from the main thread controller
        ipcRenderer.on('stack-load', function(event, data){
            self.stack = data;
            self.view.stack = self.stack;
        });
    }
}


module.exports = StackView;