const chai = require('chai');

const MockRequests = require('../mocks/mockPsList');
const AgentInterface = require('../../app/helpers/agentInterface');

describe('agentInterface', function() {
    it('should throw exception from missing properties', function(){
        chai.expect(() =>
                new AgentInterface()
        ).to.throw('Missing one of required properties.');
    });

    it('should fire the onChange event', function(){
        let agentInterface = new AgentInterface({
            processMonitor: MockPsList
        });

    });
});