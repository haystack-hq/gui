var chai = require('chai');

var Mount = require('../../app/models/mount');

var assert = chai.assert;
const should = require('chai').should;


describe('mount', function() {
	it('should throw exception from missing properties', function(){
		chai.expect(() =>
			new Mount({name: 'test'})
		).to.throw('Missing one of required properties.');
	})
});