const {js} = require('../');
const fs = require('fs');
const util = require('util');
const path = require('path');
const readFile = util.promisify(fs.readFile);

const BASE = path.join(__dirname, '/data/');

const getCrypted = function (name) {
    let dir = path.join(BASE, name, `crypted.js`);
    return readFile(dir, {encoding: 'utf8'});
}

const getSource = function (name) {
    let dir = path.join(BASE, name, `source.js`);
    return readFile(dir, { encoding: 'utf8' });
}

describe('javascript', function () {
    /* aaencode */
    describe('#aaencode()', function() {
        it('should equal to origin code', async function () {
            let cryptedCode = await getCrypted('aaencode');
            let sourceCode = await getSource('aaencode');

            if (sourceCode !== js.aaencode(cryptedCode)) {
                throw Error('not equal');
            }
        });
    });
    /* jjencode */
    describe('#jjencode()', function () {
        it('should equal to origin code', async function () {
            let cryptedCode = await getCrypted('jjencode');
            let sourceCode = await getSource('jjencode');

            if (sourceCode !== js.jjencode(cryptedCode)) {
                throw Error('not equal');
            }
        });
    });
    /* no-eval, just replace */
    describe('#replace()', function () {
        it('should equal to origin code', async function () {
            let replaceMap = {
                a: '',
                b: "'document'",
                c: "'getElementById'",
                d: "'a'",
                e: "'innerHTML'",
                f: "'hello world'"
            };

            let cryptedCode = await getCrypted('replace');
            let sourceCode = await getSource('replace');

            if (sourceCode !== js.replace(cryptedCode, replaceMap)) {
                throw Error('not equal');
            }
        });
    });
    /* 针对那种eval([加密函数体]([替换参数列表]))形式的代码 */
    describe('#uneval()', function () {
        it('should equal to origin code', async function () {
            let cryptedCode = await getCrypted('uneval');
            let sourceCode = await getSource('uneval');
            if(sourceCode !== js.uneval(cryptedCode)) {
                throw Error('not equal');
            }
        });
    });

    describe('#unnestEval()', function () {
        it('should equal to origin code', async function () {
            let cryptedCode = await getCrypted('unnestEval');
            let sourceCode = await getSource('unnestEval');
            if (sourceCode !== js.unnestEval(cryptedCode)) {
                throw Error('not equal');
            }
        });
    });
});