'use strict';
function mock() {
	//todo: if there's time, take a look in to making Factories
	return Promise.resolve([
		{ pid: 254,
			name: 'unison',
			cmd: 'unison test/process/fired/by/unison -label=eyJzeW5jIjoid2F0Y2giLCJpZGVudGlmaWVyIjoiYW5kcmV3LXdhcm1vdGgifQ==',
			cpu: '0.0' },
		{ pid: 264,
			name: 'thermald',
			cmd: '/usr/libexec/thermald',
			cpu: '0.0' },
		{ pid: 268,
			name: 'secinitd',
			cmd: '/usr/libexec/secinitd',
			cpu: '0.0' },
		{ pid: 269,
			name: 'akd',
			cmd: '/System/Library/PrivateFrameworks/AuthKit.framework/Versions/A/Support/akd',
			cpu: '0.0' },
		{ pid: 270,
			name: 'CVMServer',
			cmd: '/System/Library/Frameworks/OpenGL.framework/Versions/A/Libraries/CVMServer',
			cpu: '0.0' },
		{ pid: 271,
			name: 'colorsync.displayservices',
			cmd: '/usr/libexec/colorsync.displayservices',
			cpu: '0.0' }
	]);
}

module.exports = mock;
