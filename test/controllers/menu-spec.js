const mockApp = require("../mocks/app");
const app = mockApp();

const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
chai.should();
chai.use(chaiAsPromised);

before(function () {
    chaiAsPromised.transferPromiseness = app.transferPromiseness;
    return app.start();
});

after(function () {
    if (app && app.isRunning()) {
        return app.stop();
    }
});

describe("menuController", function () {
    it('menu window spawns', function () {
        return app.client.waitUntilWindowLoaded().getWindowCount().should.eventually.equal(1);
    });
    it('open a stack window', function () {
        return app.client.element('.item.hover.hand:first-child').click();
    });
    it("set the page title to the name of the stack", function () {
        return app.client.windowByIndex(2).element('#stack-view').getText('.item.details .inner h2').should.eventually.equal("A STACK YO");
    });
});