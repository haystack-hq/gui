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
            url: 'bad_uri',
            port: '80',
            requestHandler: request,
            eventEmitter: emitter
        });

        chai.expect(() =>
            agentInterface.makeRequest('/', 'GET', (response, body) => {})
        ).to.throw('Error: Invalid URI "bad_uri:80/"');
    });

    it('should make request successfully', function(done){
        let agentInterface = new AgentInterface({
            url: 'http://google.com',
            port: '80',
            requestHandler: request,
            eventEmitter: emitter
        });

        agentInterface.makeRequest('/', 'GET', (response, body) => {
            chai.assert.equal(response.statusCode, 200);
            done();
        });
    });

    it('should attempt to remove a stack by ID', function(){
        let agentInterface = new AgentInterface({
            url: 'http://google.com',
            port: '80',
            requestHandler: request,
            eventEmitter: emitter
        });

        let stack = {identifier: 'bar'};

        let shouldEmit = emitter.should.emit('after-remove-stack');

        setTimeout(function() {
            emitter.emit('remove-stack', this, stack);
        }, 500);

        return shouldEmit;
    }).timeout(5000);

    it('should attempt to retrieve a list of stacks', function(done){
        let agentInterface = new AgentInterface({
            url: 'http://google.com',
            port: '80',
            requestHandler: request,
            eventEmitter: emitter
        });

        agentInterface.getStacks((response, body) => {
            chai.assert.equal(response.statusCode, 200);
            done();
        });
    }).timeout(5000);

    it('should build a URL without a port', function(){
        let agentInterface = new AgentInterface({
            url: 'http://google.com',
            requestHandler: request,
            eventEmitter: emitter
        });

        chai.assert.equal(agentInterface.fullUrl, 'http://google.com')
    }).timeout(5000);
});