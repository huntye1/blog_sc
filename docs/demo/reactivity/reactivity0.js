function isObject(target) { Object.prototype.toString.call(target) === '[object Object]' }

function reactivity(target) {
    if (isObject(target)) {
        console.error('target must be an object')
        return;
    }
    const proxyValue =
        new Proxy(target, {
            get: (target, property) => {
                console.log('get', property)
                return Reflect.get(target, property);
            },
            set: (target, property, value) => {
                console.log('set', property, value)
                return Reflect.set(target, property, value);
            }
        })
    return proxyValue;
}


// 测试
const value = reactivity({count:1});

console.log('count:',value.count);

value.count++;

console.log('count:',value.count);

function isObject(target) { Object.prototype.toString.call(target) === '[object Object]' }