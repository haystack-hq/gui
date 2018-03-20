const chai = require('chai');
chai.use(require("chai-events"));
const request = require('request');

const AgentInterface = require('../../app/helpers/agentInterface');
const EventEmitter = require("events");

describe('agentInterface', function() {
    let emitter = null;
    beforeEach(function() {
        emitter = new EventEmitter();
    });

    it('should throw exception from missing properties', function(){
        chai.expect(() =>
                new AgentInterface()
        ).to.throw('Missing one of required properties.');
    });

    it('should throw an error from a bad uri', function(){
        let agentInterface = new AgentInterface({
            url: 'localhost',
            port: '3059',
            requestHandler: request,
            eventEmitter: emitter,
            protocol: 'http:/'
        });

        chai.expect(() =>
            agentInterface.makeRequest('/', 'GET', (response, body) => {})
        ).to.throw('Error: Invalid URI "http:/localhost:3059/"');
    });

    it('should make request successfully', function(done){
        let agentInterface = new AgentInterface({
            url: 'localhost',
            port: '3059',
            requestHandler: request,
            eventEmitter: emitter,
            protocol: 'http://'
        });

        agentInterface.makeRequest('/stacks', 'GET', (response, body) => {
            agentInterface.hasError = true;
            agentInterface.socket.close();
            chai.assert.equal(response.statusCode, 200);
            done();
        });
    });

    it('should attempt to remove a stack by ID', function(){
        let agentInterface = new AgentInterface({
            url: 'localhost',
            port: '3059',
            requestHandler: request,
            eventEmitter: emitter,
            protocol: 'http://'
        });

        let stack = {identifier: 'bar'};

        let shouldEmit = emitter.should.emit('after-remove-stack');

        setTimeout(function() {
            emitter.emit('remove-stack', this, stack);
            agentInterface.hasError = false;
            agentInterface.socket.close();
            agentInterface.socket.url = 'bad://url';
        }, 500);

        return shouldEmit;
    }).timeout(5000);

    it('should attempt to retrieve a list of stacks', function(done){
        let agentInterface = new AgentInterface({
            url: 'localhost',
            port: '3059',
            requestHandler: request,
            eventEmitter: emitter,
            protocol: 'http://'
        });

        agentInterface.getStacks((response, body) => {
            agentInterface.hasError = true;
            agentInterface.socket.close();
            chai.assert.equal(response.statusCode, 200);
            done();
        });
    }).timeout(5000);
});