const assert = require('assert');
const { jsonp } = require('../');

let data = {foo1: 'bar1', foo2: 'bar2'};
let jsonpData = `hello({foo1:"bar1",foo2:"bar2"})`;

describe('jsonp', function () {
    describe('#parse()', function () {
        it('should parse and the result equals to  origin target', function () {
            assert.deepEqual(jsonp.parse(jsonpData), data);
        });
    });
});

describe('jsonp', function () {
    describe('#stringify()', function () {
        it('should convert the given data and fucntion name to the js code', function () {
            assert.deepEqual(jsonp.stringify(data, 'hello'), jsonpData);
        })
    })
})