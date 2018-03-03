const esprima = require('esprima');

/**
 * 获取类型的目标对象
 * @param {any} target 需要获取类型的对象
 */
function getType(target) {
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}


/**
 * 解析，获取JSONP当中的数据
 * @param {string} jsonp JSONP数据
 * @returns {any} jsonp当中的数据
 */
function parse(jsonp) {
    return Function('return ' + jsonp.slice(jsonp.indexOf('(')+1, -1))();
}


/**
 * 将对象转化为字符串
 * @param {object} target 需要转化为字符串描述的对象或数组
 * @returns {string}  对象的字符串描述
 */
function Obj2Str(target) {
    let type = getType(target);
    if (type === 'array') {
        return '[' + target.map(item => {
            return Obj2Str(item);
        }).join(', ') + ']'
    } else if (type === 'object') {
        return '{' + Object.keys(target).map((key) => {
            return key + ':' + Obj2Str(target[key]);
        }).join(',') + '}';
    } else if (type === 'string') {
        return '"' + target + '"';
    } else if (type === 'number') {
        return target;
    } else if (type === 'null' || type === 'undefined') {
        return type;
    }
}


/**
 * 生成目标数据对应的jsonp
 * @param {object} data 需要加入到jsonp当中的数据
 * @param {string} fnName jsonp中的函数名
 * @return {string} jsonp
 */
function stringify(data, fnName='_') {
    return `${fnName}(${Obj2Str(data)})`;
}

module.exports = {parse, stringify};