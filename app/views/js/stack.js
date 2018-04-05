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
            this.initSocketMonitor();
            this.initView();
            window.addEventListener("resize", StackView.scrollLogsToBottom);
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
        StackView.scrollLogsToBottom();
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
        //set the first available service as selected
        document.title = this.stack.identifier;

        this.view = new Vue({
            el: this.pageSelector,
            data: {
                stack: this.stack,
                currentService: this.currentService,
                serviceTabs: this.serviceTabs,
                selectedTab: this.serviceTabs[0],
                socketConnected: true
            },
            methods: {
                selectService: (service) => this.selectService(service),
                deselectServices: () => { this.view.currentService = null },
                removeStack: (stack) => this.removeStack(stack),
                setSelectedTab: (tab) => {
                    this.view.selectedTab = tab;
                    this.currentService.selectedTab = tab;
                }
            }
        });

        ipcRenderer.on('stacks-updated', (event, data) => {
            this.stack = data.filter(stack => {
                return stack.identifier == this.stack.identifier;
            })[0];
            this.view.stack = this.stack;
        });
    }
    initSocketMonitor() {
        ipcRenderer.on('socket-open', (event, data) => {
            this.view.socketConnected = data.isOpen;
        });
    }
    static scrollLogsToBottom() {
        let logWindow = document.getElementsByClassName('logs')[0];
        if(logWindow){
            logWindow.scrollTop = logWindow.scrollHeight;
        }
    }
}


module.exports = StackView;