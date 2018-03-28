class AgentInterface {
    constructor(options){
        if(typeof options == 'undefined' ||
            options.url == null ||
            options.port == null ||
            options.requestHandler == null ||
            options.webSocketHandler == null ||
            options.socketOpenEvent == null ||
            options.eventEmitter == null){
            throw new ReferenceError('Missing one of required properties.');
        }
        this.url = options.url;
        this.port = options.port;
        this.protocol = options.protocol;
        this.webSocketHandler = options.webSocketHandler;
        this.requestHandler = options.requestHandler;
        this.eventEmitter = options.eventEmitter;
        this.socketOpenEvent = options.socketOpenEvent;
        this.socket = null;
        this.connectedToDaemon = false;
        this.hasError = false;

        this.fullUrl = this.protocol + this.url + ":" + this.port;

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
        return this.makeRequest(`/stacks/${identifier}`, 'DELETE', (response, body) => {
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

    disconnectedDaemon() {
        this.connectedToDaemon = false;

        setTimeout(() => {
            this.attemptDaemonConnection();
        }, 1000)
    }

    attemptDaemonConnection() {
        if(!this.connectedToDaemon){
            this.openSocket();
        }
    }

    openSocket(){
        this.hasError = false;

        this.socket = new this.webSocketHandler(`ws://${this.url}:${this.port}/stacks/stream`);

        this.socket.on('open', (data) => {
            this.connectedToDaemon = true;
            this.eventEmitter.emit('stack-stream-update', data);
            this.eventEmitter.emit(this.socketOpenEvent, {isOpen: this.connectedToDaemon});
        });

        this.socket.on('message', (data) => {
            this.eventEmitter.emit('stack-stream-update', data);
        });

        this.socket.on('error', () => {
            this.disconnectedDaemon();
            this.hasError = true;
        });

        this.socket.on('close', () => {
            if(this.hasError === false){
                this.disconnectedDaemon();
            }
        });

        this.eventEmitter.emit(this.socketOpenEvent, {isOpen: this.connectedToDaemon});
    }
}

module.exports = AgentInterface;
