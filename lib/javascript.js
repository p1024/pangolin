const esprima = require('esprima');

function unnestEval(code) {
    
    let curr = 0, mcode = [], prev= curr, step=0;
    function evalPosition(code, start) {
        let patterns = [{p: 'eval(', s: 4}, {p: 'eval(', s: 4}, {p: 'window["eval"](', s: 14}, {p: 'window["eval"](', s: 14}];

        for(let i=0; i<patterns.length; i++) {
            let pattern = patterns[i];
            let idx = code.indexOf(pattern.p, start);
            if(idx!==-1) {
                step = pattern.s;
                return idx + step;
            }
        }
        step = 0;
        return -1;
    }
    while((curr = evalPosition(code, curr))!== -1 && curr < code.length) {
        mcode.push(code.slice(prev, curr-step));
        prev = curr;
        let left=0; right=0;
        while(curr < code.length) {
            if(code[curr] === '(') {
                left ++;
            } else if(code[curr] === ')') {
                right ++;
                if(left === right) {
                    curr++;
                    break;
                }
            }
            curr++;
        }

        let tmpCode = code.slice(prev, curr);
        tmpCode = left===right ? unnestEval(eval(tmpCode)):tmpCode;
        mcode.push(tmpCode);
        prev = curr;
    }
    mcode.push(code.slice(prev));
    return mcode.join('');
}

function uneval(code) {
    let tmp = code.match(/eval(.*)$/);
    if(tmp) {
        code = tmp[1];
    }
    return eval(code) || code;
}

function aaencode(code) {
    code = code
        .replace(`(ﾟДﾟ) ['_'] ( (ﾟДﾟ) ['_'] `, `( (ﾟДﾟ) ['_'] `)
        .replace(`) ('_');`, ')');
    return eval(code) || code;
}

function jjencode(code) {
    let gb = code.slice(0, code.indexOf('='));
    let pattern = `${gb}.$(${gb}.$`;
    let pos = code.indexOf(pattern);
    code = code.slice(0, pos) + code.slice(pos+pattern.length - (gb.length+2), -4) + ';';
    return eval(code);
}


/* 针对那种替换变量名的操作 */
function replace(code, replaceMap = {}) {
    return esprima.tokenize(code).map(token => {
        if (token.type === 'Identifier' && token.value in replaceMap) {
            return replaceMap[token.value];
        } else {
            return token.value;
        }
    }).join('');
}

module.exports = { unnestEval, uneval, aaencode, jjencode, replace};