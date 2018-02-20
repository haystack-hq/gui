var chai = require('chai');

var TrayMenuListItem = require('../../../app/models/ui/trayMenuListItem');

const path = require('path');
const assetsDirectory = path.join(__dirname, 'assets');

const assert = chai.assert;
const should = require('chai').should;


describe('trayMenuListItem', function() {
	it('should throw exception from missing properties', function(){
		chai.expect(() =>
			new TrayMenuListItem({identifier: 'test'})
		).to.throw('Missing one of required properties.');
	});

	it('should return a TrayMenuListItem object with a file path', function(){
		var testItem = new TrayMenuListItem({
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