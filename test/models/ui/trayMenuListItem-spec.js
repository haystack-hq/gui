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

	it('should return a MountMenuListItem object with a file path', function(){
		var testItem = new MountMenuListItem({
			identifier: 'andrew-warmoth',
			status: 1,
			cmd: 'xargs -n1 -I{} unison /Users/andrew/dev/clients/warmoth.com socket://54.187.33.50:5000 -ignore Name .git -batch -prefer newer -dontchmod -perms=0 -label=eyJzeW5jIjoid2F0Y2giLCJpZGVudGlmaWVyIjoiYW5kcmV3LXdhcm1vdGgifQ=='
		});
		chai.expect(testItem).to.deep.include({
			label: 'andrew-warmoth',
			path: '/Users/andrew/dev/clients/warmoth.com'
		});
	});
});