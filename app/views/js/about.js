const {ipcRenderer} = require('electron');
const {app} = require('electron').remote;
const CommandRunner = require('../../helpers/commandRunner');
const StackController = require('../../controllers/stack');
const path = require('path');
let exec = require('child_process').exec;

class AboutView {
    constructor(options) {
        if(typeof options == 'undefined' ||
            options.pageSelector == null){
            throw new ReferenceError('Missing one of required properties.');
        }
        this.view = null;
        this.pageSelector = options.pageSelector;

        this.getDockerVersion();

        this.initView();
    }

    initView(){
        this.view = new Vue({
            el: this.pageSelector,
            data: {
                dockerVersion: null
            }
        });

    }

    getDockerVersion(){
        let command = "docker version --format '{{json .}}'";
        exec(command, (error, stdout, stderr) => {
            this.view.dockerVersion = JSON.parse(stdout);
        });
    }
}


module.exports = AboutView;