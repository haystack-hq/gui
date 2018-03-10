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
        this.view = null;
        this.stack = null;
        this.currentService = null;
        this.currentServiceName = null;
        this.pageSelector = options.pageSelector;

        //get the stack from the main thread controller
        ipcRenderer.on('stack-load', (event, data) => {
            this.stack = data;
            this.initView();
        });
    }

    selectService(service){
        this.view.currentService = service;
        this.view.currentServiceName = service.name;
    }

    initView(){
        this.currentService = this.stack.services[0];
        this.view = new Vue({
            el: this.pageSelector,
            data: {
                stack: this.stack,
                currentService: this.currentService,
                currentServiceName: this.currentServiceName
            },
            methods: {
                selectService: (service) => {
                    this.selectService(service)
                }
            }
        });

        //select the first tab after loading
        this.view.selectService(this.currentService);

        ipcRenderer.on('stacks-updated', (event, data) => {
            this.stack = data.filter(stack => {
                return stack.id == this.stack.id;
            })[0];
            this.view.stack = this.stack;
        });
    }
}


module.exports = StackView;