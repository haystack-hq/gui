const {ipcMain} = require('electron');
const exec = require('child_process').exec;

class AgentInterface {
    constructor(options){
        if(typeof options == 'undefined' ||
            options.url == null ||
            options.requestHandler == null){
            throw new ReferenceError('Missing one of required properties.');
        }
        this.url = options.url;
        this.port = options.port;
        this.requestHandler = options.requestHandler;

        this.fullUrl = this.port ? this.url + ":" + this.port : this.url;

        this.listen();
    }

    makeRequest(endpoint, method, callback) {
        let requestParams = {
            uri: this.fullUrl + endpoint,
            method: method
        };
        this.requestHandler(requestParams, (error, response, body) => {
            if(error){
                console.log(error);
            }
            callback(response, body);
        });
    }

    getStacks(callback){
        return this.makeRequest('/', 'GET', (response, body) => {
            callback(response, body);
        });
    }

    removeStack(identifier, callback){
        return this.makeRequest(`/${identifier}`, 'DELETE', (response, body) => {
            callback(response, body);
        });
    }

    listen() {
        ipcMain.on('remove-stack', (event, stack) => {
            this.onRemoveStack(stack);
        });
    }

    onRemoveStack(stack) {
        this.removeStack(stack.identifier, (response, body) => {
            console.log(response.request.href);
        });
    }
}

module.exports = AgentInterface;
