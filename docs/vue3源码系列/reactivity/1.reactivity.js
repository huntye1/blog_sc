function isObject(target) { return typeof target === 'object' && target !== null }

let targetMap = new WeakMap();
let activeEffect;
let shouldTrack = true;
let effectStack = [];


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
                if (Array.isArray(target) && key === 'push') {
                    return wrappedPush;
                }
                track(target, key) // 收集依赖
                const result = Reflect.get(target, key);

                if (isObject(result)) {
                    return reactive(result)
                }

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

    activeEffect.deps.add(effects)

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

    [...effects].forEach(effect => {
        if (effect !== activeEffect) {
            if (effect.options.scheduler) {
                effect.options.scheduler();
            } else {
                effect()
            }
        }
    });
}

function effect(fn, options = {}) {
    function reactiveEffect() {
        activeEffect = reactiveEffect;
        // 运行前先入栈
        effectStack.push(activeEffect);

        // 运行之前，先清除依赖。
        const { deps } = activeEffect;
        if (deps) {
            deps.forEach((dep) => {
                dep.delete(activeEffect)
            })
        }

        const result = fn();
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
        return result
    }

    // 源码用数组优化空间，这里简单用set。
    reactiveEffect.deps = new Set();
    reactiveEffect.options = options;

    if (!options.lazy) {
        // 不自动运行一次收集依赖。
        reactiveEffect();
    }
    return reactiveEffect;
}

function computed(fn) {
    let obj = {};
    let cache;
    let hasNew = true;
    const effectFn = effect(fn, {
        lazy: true,
        scheduler: () => {
            // 对应依赖发生变化，更新标志。
            hasNew = true;
            trigger(obj, 'value')
        }
    })
    Object.defineProperty(obj, 'value', {
        get: () => {
            if (hasNew) {
                hasNew = false
                // 依赖发生变化，更新cache
                cache = effectFn();
            }
            track(obj, 'value')
            return cache;
        }
    })
    return obj;
}


// 下面是演示代码--------------------------------------------



// 问题4: 在effec的基础上实现computed
// const value = reactive({ foo: 1 });
// const getter = computed(() => {
//     console.log('run!')
//     return value.foo
// });
// console.log(getter.value)
// value.foo = 2
// value.foo = 3
// console.log(getter.value)



// 问题5：嵌套effect与computed

// const nums = reactive({ num1: 1, num2: 2, num3: 3 })


// const count = computed(() => nums.num1 + nums.num2 + nums.num3)
// effect(() => {
//     console.log('count:', count.value)
// })

// nums.num1 = -1;
// nums.num2 = -2;


// 终极嵌套例子
const nums = reactive({ num1: 1, num2: 2, num3: 3 })

let dummy1
dummy1 = computed(() => 1 + nums.num1) // 2

let dummy2
dummy2 = computed(() => dummy1.value + nums.num2)// 4


const fn = effect(() => {
    console.log('fn', dummy2.value + nums.num3) // 7
})

effect(() => {
    fn();
    console.log('num2', nums.num2) //2
})

nums.num1 = 3