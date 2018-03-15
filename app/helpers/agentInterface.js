const WebSocket = require('ws');

class AgentInterface {
    constructor(options){
        if(typeof options == 'undefined' ||
            options.url == null ||
            options.requestHandler == null ||
            options.eventEmitter == null){
            throw new ReferenceError('Missing one of required properties.');
        }
        this.url = options.url;
        this.port = options.port;
        this.protocol = options.protocol;
        this.requestHandler = options.requestHandler;
        this.eventEmitter = options.eventEmitter;

        this.fullUrl = this.port ? this.protocol + this.url + ":" + this.port : this.protocol + this.url;

        this.listen();

        this.openSocket();
    }

    makeRequest(endpoint, method, callback) {
        let requestParams = {
            uri: this.fullUrl + endpoint,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        this.requestHandler(requestParams, (error, response, body) => {
            if(error){
                console.log('hello~');
                //throw new Error(error);
            } else {
                callback(response, body);
            }
        });
    }

    getStacks(callback){
        return this.makeRequest('/stacks', 'GET', (response, body) => {
            callback(response, body);
        });
    }

    removeStack(identifier, callback){
        return this.makeRequest(`/${identifier}`, 'DELETE', (response, body) => {
            callback(response, body);
        });
    }

    listen() {
        this.eventEmitter.on('remove-stack', (event, stack) => {
            this.onRemoveStack(stack);
        });
    }

    onRemoveStack(stack) {
        this.removeStack(stack.identifier, (response, body) => {
            this.eventEmitter.emit('after-remove-stack', this, response);
        });
    }

    openSocket(){
        let hasError = false;

        const ws = new WebSocket(`ws://${this.url}:${this.port}/stacks/stream`);

        ws.on('message', (data) => {
            console.log('get message', data);
            this.eventEmitter.emit('stack-stream-update', data);
        });

        ws.on('error', function() {
            console.log('Agent is not running');
            hasError = true;
        });

        ws.on('close', () => {
            if(hasError === false){
                console.log('on close');
                this.openSocket();
            }
        });
    }
}

module.exports = AgentInterface;
