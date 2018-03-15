const {ipcRenderer, shell} = require('electron');
const {app} = require('electron').remote;
const AboutController = require('../../controllers/about');
const StatusConverter = require('../../helpers/statusConverter');
const path = require('path');

class MenuView {
    constructor(options) {
        if(typeof options == 'undefined' ||
            options.stackListSelector == null){
            throw new ReferenceError('Missing one of required properties.');
        }
        this.stacks = [];
        this.tabs = null;
        this.currentTab = null;
        this.stackList = null;
        this.stackListSelector = options.stackListSelector;
        this.tabSelector = options.tabSelector;

        this.initStackList();

        //once the DOM is ready, we fire off the main event to monitor mounts
        document.addEventListener('DOMContentLoaded', () => {
            ipcRenderer.send('dom-ready');
        });
    }

    static openStack(stack){
        ipcRenderer.send('stack-open', stack);
    }

    static openDocs(){
        return shell.openExternal('https://docs.haystackhq.com');
    }

    static about(){
        let aboutController = new AboutController({
            icon: path.join(__dirname, '../../../assets/images/haystack-logo-black.svg'),
            templateDirectory: path.join(__dirname, '../../../app/views/templates')
        });
        aboutController.show();
    }

    static exit(){
        let shouldExit = confirm("Are you sure you want to exit? Your stacks will continue to run.");
        if (shouldExit == true) {
            app.quit();
        }
    }

    initStackList(){
        this.stackList = new Vue({
            el: this.stackListSelector,
            data: {
                stacks: this.stacks
            },
            methods: {
                openStack: (stack) => {MenuView.openStack(stack)}
            },
            computed: {
                sortedStacks() {
                    return this.stacks.sort((a, b) => a.identifier > b.identifier )
                }
            }
        });

        //listen for changes from the main process
        ipcRenderer.on('stack-list-change', (event, data) => {
            this.stacks = data;

            this.addState();

            this.stackList.stacks = this.stacks;
            if(!this.tabs){
                this.initTabs();
            } else if(this.tabs.currentTab) {
                this.tabs.selectTab(this.tabs.currentTab);
            }
            ipcRenderer.send('stacks-updated', this.stacks);
        });
    }

    addState(){
        this.stacks.forEach(stack => {
            if(stack.status){
                stack.state = StatusConverter.getStateFromStatus(stack.status);
            }
        })
    }

    initTabs(){
        this.tabs = new Vue({
            el: this.tabSelector,
            data: {
                tabs: [
                    {
                        title: "My Stacks"
                    }
                ],
                currentTab: this.currentTab
            },
            methods: {
                selectTab: (tab) => {
                    this.selectTab(tab)
                }
            }
        });

        //select the first tab after loading
        this.tabs.selectTab(this.tabs.tabs[0]);
    }

    // TODO: THIS SHOULD FILTER BY SOMETHING ELSE
    selectTab(tab){
        this.tabs.currentTab = tab;
        this.stackList.stacks = this.stacks.filter(stack => {
            if(tab.filterStacks){
                return stack.identifier.indexOf(tab.filterStacks) > -1;
            }
            return 1;
        });
    }
}


module.exports = MenuView;