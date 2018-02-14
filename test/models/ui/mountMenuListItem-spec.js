var chai = require('chai');

var MountMenuListItem = require('../../../app/models/ui/mountMenuListItem');

const path = require('path');
const assetsDirectory = path.join(__dirname, 'assets');

const assert = chai.assert;
const should = require('chai').should;


describe('mountMenuListItem', function() {
	it('should throw exception from missing properties', function(){
		chai.expect(() =>
			new MountMenuListItem({identifier: 'test'})
		).to.throw('Missing one of required properties.');
	});

	it('should return a MountMenuListItem object with position endof=mounts', function(){
		var testItem = new MountMenuListItem({
			identifier: 'andrew-warmoth',
			status: 1
		});
		chai.expect(testItem).to.deep.include({
			label: 'andrew-warmoth',
			position: 'endof=mounts'
		});
	});

	it('should return a MountMenuListItem object with position endof=testing', function(){
		var testItem = new MountMenuListItem({
			identifier: 'andrew-warmoth',
			status: 1,
			position: 'testing'
		});
		chai.expect(testItem).to.deep.include({
			label: 'andrew-warmoth',
			position: 'endof=testing'
		});
	});

});