const {ipcRenderer} = require('electron');
const remote = require('electron').remote;
const AgentInterface = require('../../helpers/agentInterface');

class StackView {
    constructor(options) {
        if(typeof options == 'undefined' ||
            options.pageSelector == null){
            throw new ReferenceError('Missing one of required properties.');
        }
        this.view = null;
        this.stack = null;
        this.currentService = null;
        this.activeServiceTabs = {};
        this.pageSelector = options.pageSelector;
        this.window = remote.getCurrentWindow();
        this.serviceTabs = [
            {
                label: 'Terminal',
                id: 'terminal'
            },
            {
                label: 'Logs',
                id: 'logs'
            }
        ];

        //get the stack from the main thread controller
        ipcRenderer.on('stack-load', (event, data) => {
            this.stack = data;
            this.initView();
        });
    }

    /**
     * Select a service, mark the tab active
     * Set the service tab to terminal by default, otherwise get the set one
     * @param service
     */
    selectService(service){
        this.currentService = service;
        this.view.currentService = this.currentService;
        this.view.selectedTab = this.currentService.selectedTab ? this.currentService.selectedTab : this.serviceTabs[0];
    }

    /**
     * Close the main stack window and send the remove-stack event to the main process
     * if the user confirms in the dialog
     * @param stack
     */
    removeStack(stack){
        let shouldDelete = confirm("Are you sure you want to delete this stack?");
        if (shouldDelete == true) {
            ipcRenderer.send('remove-stack', stack);
            this.window.close();
        }
    }

    initView(){
        let self = this;
        //set the first available service as selected
        this.currentService = this.stack.services[0];
        this.activeServiceTabs[this.currentService.name] = 'terminal';

        document.title = this.stack.identifier;

        this.view = new Vue({
            el: this.pageSelector,
            data: {
                stack: this.stack,
                currentService: this.currentService,
                serviceTabs: this.serviceTabs,
                activeServiceTabs: this.activeServiceTabs,
                selectedTab: this.serviceTabs[0]
            },
            methods: {
                selectService: (service) => this.selectService(service),
                removeStack: (stack) => this.removeStack(stack),
                selectServiceTab: (service, tab) => this.selectServiceTab(service, tab),
                isTabActive: function(str) {
                    return this.activeServiceTabs[this.currentService.name] == str;
                },
                setSelectedTab: (tab) => {
                    this.view.selectedTab = tab;
                    this.currentService.selectedTab = tab;
                    console.log('selected tab', this.view.selectedTab);
                }
            }
        });

        this.currentService.selectedTab = this.view.selectedTab;
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