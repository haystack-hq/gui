const chai = require('chai');

const StatusConverter = require('../../app/helpers/statusConverter');
const EventEmitter = require("events");

describe('statusConverter', function() {
    it('status exists and is converted', function(){

        let state = StatusConverter.getStateFromStatus('running');
        chai.assert.equal(state, 'active');
    });
    it('status does not exist and is not converted', function(){

        let state = StatusConverter.getStateFromStatus('nonexistent');
        chai.assert.equal(state, 'nonexistent');
    });
});