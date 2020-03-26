var assert = require("assert"); //nodejs에서 제공하는 aseert 모듈
var jsdom = require('mocha-jsdom');

global.document = jsdom( {url: "http://localhost"});


describe('Array 테스트', function() {
    describe('indexOf() 메서드', function () {
        it('값이 없을 때에는 -1 을 리턴함', function (done) {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
            done();
        });
    });
});


describe('mocha tests', function () {
    it('has document', function (done) {
        var div = document.createElement('div');
        assert.equal(true, div != null);
        // expect(div.nodeName).eql('DIV')
        done();
    })
});


describe('나의 테스트', function() {
    this.timeout(3000); // A very long environment setup.
    it('그냥 있냐', function (done) {
        var window = document.defaultView;
        var { getEl, getData } = require('../index');
        assert.equal(true, getData([1,2,3,4,5]).any(function(it){ return it == 5; }));
        assert.equal(false, getData([1,2,3,4,5]).any(function(it){ return it == 6; }));
        done();
    });
});