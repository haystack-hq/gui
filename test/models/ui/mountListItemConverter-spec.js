var chai = require('chai');

var ListItemConverter = require('../../../app/models/ui/listItemConverter');
const Mount = require('../../../app/models/mount');

var assert = chai.assert;
const should = require('chai').should;

let testMount = new Mount({
	identifier: 'test-mount',
	cmd: 'foo bar baz',
	unisonPid: 34361,
	status: 1
});

describe('listItemConverter', function() {
	it('should throw exception from missing list', function(){
		chai.expect(() =>
			new ListItemConverter()
		).to.throw('Missing list of mounts.');
	});

	it('should throw exception from not providing an Array', function(){
		chai.expect(() =>
				new ListItemConverter({is: 'object'})
		).to.throw('List provided is not an array.');
	});

	it('should return an array with a MountListItem in it', function(){
		let itemList = new ListItemConverter([testMount]).mounts_to_menu_items();

		chai.expect(itemList).to.nested.property('[0].label', 'test-mount');
	});

	it('should throw exception from an invalid converter class', function(){
		chai.expect(() =>
			new ListItemConverter([testMount]).converter('test')
		).to.throw('Conversion class is invalid.');
	});
});