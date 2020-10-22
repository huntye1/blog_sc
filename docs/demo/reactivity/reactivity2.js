function isObject(target) { return  typeof target === 'object' && target !== null }

function reactivity(target) {
    if (!isObject(target)) {
        console.error('target must be an object')
        return;
    }
    const proxyValue =
        new Proxy(target, {
            get: (target, key) => {
                // get 的时候去收集依赖
                track(target, key)
                let value = Reflect.get(target, key);
                if(isObject(value)){
                    // 总是惰性代理，性能提升
                    value = reactivity(value);
                }
                return value
            },
            set: (target, key, value) => {
                // set的时候去通知触发副作用
                Reflect.set(target, key, value);
                trigger(target, key)
            }
        })
    return proxyValue;
}

let activeEffect;

// 基本数据结构
let targetMap = new Map();   // target -> key -> dep
// type Dep = Set<ReactiveEffect>
// type KeyToDepMap = Map<any, Dep>
// const targetMap = new WeakMap<any, KeyToDepMap>()

function track(target, key){
    if(!activeEffect){
        return;
    }

    let keyToDepMap =  targetMap.get(target); 
    if(!keyToDepMap){
        keyToDepMap = new Map();
        targetMap.set(target, keyToDepMap);
    }

    let effects = keyToDepMap.get(key);
    if(!effects){
        effects = new Set();
        keyToDepMap.set(key, effects);
    }

    effects.add(activeEffect);
}

function trigger(target, key){
    let keyToDepMap = targetMap.get(target);
    if(!keyToDepMap){
        return;
    }
    let effects  = keyToDepMap.get(key);
    effects.forEach(effect => {
        effect();
    });
}

function effect(curEffect){
    activeEffect = curEffect;
    activeEffect();
}


// 测试
const v = {count:1,foo:{bar:2}}
const value = reactivity(v);
effect(() => {
    console.log('count:', value.count);
})
value.count = 2;

effect(() => {
    console.log('value', value.foo);
})

value.foo.bar = 2 // 不能触发

effect(() => {
    console.log('value', value.foo.bar);
})

value.foo.bar = 3 // 可以 触发







