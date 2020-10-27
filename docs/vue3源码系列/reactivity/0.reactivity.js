function isObject(target) { return typeof target === 'object' && target !== null }

let targetMap = new WeakMap();
let activeEffect;
let shouldTrack = true;

function wrappedPush(...args) {
    shouldTrack = false
    const result = Array.prototype.push.apply(this, args)
    shouldTrack = true
    return result
}

function reactive(target) {
    if (!isObject(target)) {
        console.error('target must be an object')
        return;
    }
    const proxyValue =
        new Proxy(target, {
            get: (target, key) => {
                // 问题2 start
                if (Array.isArray(target) && key === 'push') {
                    return wrappedPush;
                }
                // 问题2 end
                track(target, key) // 收集依赖
                const result = Reflect.get(target, key);

                // 问题1 start
                if (isObject(result)) {
                    return reactive(result)
                }
                // 问题1 end

                return result;
            },
            set: (target, key, value) => {
                const result = Reflect.set(target, key, value);
                trigger(target, key) // 	触发更新
                return result;
            }
        })
    return proxyValue;
}

function track(target, key) {
    if (!activeEffect || !shouldTrack) {
        return;
    }

    let keyToDepMap = targetMap.get(target);
    if (!keyToDepMap) {
        keyToDepMap = new Map();
        targetMap.set(target, keyToDepMap);
    }

    let effects = keyToDepMap.get(key);
    if (!effects) {
        effects = new Set();
        keyToDepMap.set(key, effects);
    }

    // 问题4: start
    // 建立双向映射。
    activeEffect.deps.add(effects)
    // 问题4: end

    effects.add(activeEffect);
}

function trigger(target, key) {
    let keyToDepMap = targetMap.get(target);
    if (!keyToDepMap) {
        return;
    }

    let effects = keyToDepMap.get(key);
    if (!effects) {
        return;
    }

    // effects.forEach(effect => {
    //     effect();
    // });

    [...effects].forEach(effect => {
        effect();
    });
}

// 问题3: start
// function effect(curEffect) {
//     activeEffect = curEffect;
//     activeEffect();
// }
function effect(fn) {
    function reactiveEffect() {
        activeEffect = reactiveEffect;

        // 运行之前，先清除依赖。
        const { deps } = activeEffect;
        if (deps) {
            deps.forEach((dep) => {
                dep.delete(activeEffect)
            })
        }

        return fn();
    }

    // 源码用数组优化空间，这里简单用set。
    reactiveEffect.deps = new Set();

    reactiveEffect();
    return reactiveEffect;
}
// 问题3: end


// 下面是演示代码--------------------------------------------


// 基本实现：
// let value = reactive({ count: 0 });

// effect(() => {
//     console.log('effect', value.count);
// })

// setTimeout(() => {
//     console.log('1s...')
//     value.count++
// }, 1000)



// 问题1：深层次的对象没有变成响应式的。
// const value = reactive({ foo: { bar: 1 } });
// effect(() => {
//     console.log('count:', value.foo.bar);
// })

// value.foo.bar = 2




// 问题2：数组push操作会爆栈。
// const arr = reactive([]);
// effect(() => {
//     arr.push(1)
// })
// console.log(arr);


// 问题3：依赖的过度收集
// let a = reactive({ foo: true, bar: 1 })
// let dummy;
// effect(() => {
//     dummy = a.foo ? a.bar : 999
//     console.log('run!')
// })
// a.foo = false
// a.bar = 2

// 问题4: 在effec的基础上实现computed
const value = reactive({ foo: 1, bar: 2 });
const getter = computed(() => {
    console.log('run!')
    return value.foo
});
console.log(getter.value)
value.foo = 2
value.foo = 3
console.log(getter.value)





