/* eslint-disable @typescript-eslint/no-this-alias */

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef(v) {
    return v === undefined || v === null
}

/**
 * Check if value is primitive.
 */
function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        // $flow-disable-line
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString

function toRawType(value) {
    return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val) {
    const n = parseFloat(String(val))
    return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap(str, expectsLowerCase) {
    const map = Object.create(null)
    const list = str.split(',')
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true
    }
    return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val]
}

/**
 * Check if a tag is a built-in tag.
 */
const isBuiltInTag = makeMap('slot,component', true)

/**
 * Check if an attribute is a reserved attribute.
 */
const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

/**
 * Remove an item from an array.
 */
function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

/**
 * Check whether an object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
    const cache = Object.create(null)
    return function cachedFn(str) {
        const hit = cache[str]
        return hit || (cache[str] = fn(str))
    }
}

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
const camelize = cached(str => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})

/**
 * Capitalize a string.
 */
const capitalize = cached(str => {
    return str.charAt(0).toUpperCase() + str.slice(1)
})

/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g
const hyphenate = cached(str => {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
})

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

const bind = function nativeBind(fn, ctx) {
    return fn.bind(ctx)
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray(list, start) {
    start = start || 0
    let i = list.length - start
    const ret = new Array(i)
    while (i--) {
        ret[i] = list[i + start]
    }
    return ret
}

/**
 * Mix properties into target object.
 */
function extend(to, _from) {
    for (const key in _from) {
        to[key] = _from[key]
    }
    return to
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop(a, b, c) {
    return void 0
}

/**
 * Always return false.
 */
const no = (a, b, c) => false

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
const identity = _ => _

const ASSET_TYPES = ['component']

const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'errorCaptured',
]

/*  */

var config = {
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),

    /**
     * Show production mode tip message on boot?
     */

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,

    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS,
}

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved(str) {
    const c = (str + '').charCodeAt(0)
    return c === 0x24 || c === 0x5f
}

/**
 * Define a property.
 */
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true,
    })
}

/**
 * Parse simple path.
 */
const bailRE = /[^\w.$]/
function parsePath(path) {
    if (bailRE.test(path)) {
        return
    }
    const segments = path.split('.')
    return function (obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return
            obj = obj[segments[i]]
        }
        return obj
    }
}

/*  */

// can we use __proto__?
const hasProto = '__proto__' in {}

// Firefox has a "watch" function on Object.prototype...
const nativeWatch = {}.watch

/* istanbul ignore next */
function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

const hasSymbol =
    typeof Symbol !== 'undefined' &&
    isNative(Symbol) &&
    typeof Reflect !== 'undefined' &&
    isNative(Reflect.ownKeys)

let _Set
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set
} else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = class Set {
        constructor() {
            this.set = Object.create(null)
        }
        has(key) {
            return this.set[key] === true
        }
        add(key) {
            this.set[key] = true
        }
        clear() {
            this.set = Object.create(null)
        }
    }
}

/*  */

let warn = noop
let tip = noop
let generateComponentTrace = noop // work around flow check
let formatComponentName = noop

const classifyRE = /(?:^|[-_])(\w)/g
const classify = str =>
    str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '')

warn = (msg, vm) => {
    const trace = vm ? generateComponentTrace(vm) : ''

    if (config.warnHandler) {
        config.warnHandler.call(null, msg, vm, trace)
    } else {
        console.error(`[Vue warn]: ${msg}${trace}`)
    }
}

tip = (msg, vm) => {
    console.warn(`[Vue tip]: ${msg}` + (vm ? generateComponentTrace(vm) : ''))
}

formatComponentName = (vm, includeFile) => {
    if (vm.$root === vm) {
        return '<Root>'
    }
    const options =
        typeof vm === 'function' && vm.cid != null
            ? vm.options
            : vm._isVue
            ? vm.$options || vm.constructor.options
            : vm || {}
    let name = options.name || options._componentTag
    const file = options.__file
    if (!name && file) {
        const match = file.match(/([^/\\]+)\.vue$/)
        name = match && match[1]
    }

    return (
        (name ? `<${classify(name)}>` : `<Anonymous>`) +
        (file && includeFile !== false ? ` at ${file}` : '')
    )
}

const repeat = (str, n) => {
    let res = ''
    while (n) {
        if (n % 2 === 1) res += str
        if (n > 1) str += str
        n >>= 1
    }
    return res
}

generateComponentTrace = vm => {
    if (vm._isVue && vm.$parent) {
        const tree = []
        let currentRecursiveSequence = 0
        while (vm) {
            if (tree.length > 0) {
                const last = tree[tree.length - 1]
                if (last.constructor === vm.constructor) {
                    currentRecursiveSequence++
                    vm = vm.$parent
                    continue
                } else if (currentRecursiveSequence > 0) {
                    tree[tree.length - 1] = [last, currentRecursiveSequence]
                    currentRecursiveSequence = 0
                }
            }
            tree.push(vm)
            vm = vm.$parent
        }
        return (
            '\n\nfound in\n\n' +
            tree
                .map(
                    (vm, i) =>
                        `${i === 0 ? '---> ' : repeat(' ', 5 + i * 2)}${
                            Array.isArray(vm)
                                ? `${formatComponentName(vm[0])}... (${
                                      vm[1]
                                  } recursive calls)`
                                : formatComponentName(vm)
                        }`
                )
                .join('\n')
        )
    } else {
        return `\n\n(found in ${formatComponentName(vm)})`
    }
}

/*  */

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
class Dep {
    constructor() {
        this.id = uid++
        this.subs = []
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    removeSub(sub) {
        remove(this.subs, sub)
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    notify() {
        // stabilize the subscriber list first
        const subs = this.subs.slice()
        if (!config.async) {
            // subs aren't sorted in scheduler if not running async
            // we need to sort them now to make sure they fire in correct
            // order
            subs.sort((a, b) => a.id - b.id)
        }
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

function pushTarget(_target) {
    if (Dep.target) targetStack.push(Dep.target)
    Dep.target = _target
}

function popTarget() {
    Dep.target = targetStack.pop()
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse',
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
    // cache original method
    const original = arrayProto[method]
    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args)
        const ob = this.__ob__
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }
        if (inserted) ob.observeArray(inserted)
        // notify change
        ob.dep.notify()
        return result
    })
})

/*  */

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
let shouldObserve = true

function toggleObserving(value) {
    shouldObserve = value
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
class Observer {
    // number of vms that has this object as root $data

    constructor(value) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            if (hasProto) {
                protoAugment(value, arrayMethods)
            } else {
                copyAugment(value, arrayMethods, arrayKeys)
            }
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }

    /**
     * Walk through each property and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive$$1(obj, keys[i])
        }
    }

    /**
     * Observe a list of Array items.
     */
    observeArray(items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }
}

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src
    /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment(target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        def(target, key, src[key])
    }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(value, asRootData) {
    if (!isObject(value)) {
        return
    }
    let ob
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else if (
        shouldObserve &&
        (Array.isArray(value) || isPlainObject(value)) &&
        Object.isExtensible(value) &&
        !value._isVue
    ) {
        ob = new Observer(value)
    }
    if (asRootData && ob) {
        ob.vmCount++
    }
    return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1(obj, key, val, customSetter, shallow) {
    const dep = new Dep()

    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        return
    }

    // cater for pre-defined getter/setters
    const getter = property && property.get
    const setter = property && property.set
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key]
    }

    let childOb = !shallow && observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val
            /* eslint-disable no-self-compare */
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            /* eslint-enable no-self-compare */
            if (customSetter) {
                customSetter()
            }
            // #7981: for accessor properties without setter
            if (getter && !setter) return
            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            childOb = !shallow && observe(newVal)
            dep.notify()
        },
    })
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set(target, key, val) {
    if (isUndef(target) || isPrimitive(target)) {
        warn(
            `Cannot set reactive property on undefined, null, or primitive value: ${target}`
        )
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }
    const ob = target.__ob__
    if (target._isVue || (ob && ob.vmCount)) {
        warn(
            'Avoid adding reactive properties to a Vue instance or its root $data ' +
                'at runtime - declare it upfront in the data option.'
        )
        return val
    }
    if (!ob) {
        target[key] = val
        return val
    }
    defineReactive$$1(ob.value, key, val)
    ob.dep.notify()
    return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del(target, key) {
    if (isUndef(target) || isPrimitive(target)) {
        warn(
            `Cannot delete reactive property on undefined, null, or primitive value: ${target}`
        )
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, 1)
        return
    }
    const ob = target.__ob__
    if (target._isVue || (ob && ob.vmCount)) {
        warn(
            'Avoid deleting properties on a Vue instance or its root $data ' +
                '- just set it to null.'
        )
        return
    }
    if (!hasOwn(target, key)) {
        return
    }
    delete target[key]
    if (!ob) {
        return
    }
    ob.dep.notify()
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i]
        e && e.__ob__ && e.__ob__.dep.depend()
        if (Array.isArray(e)) {
            dependArray(e)
        }
    }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
const strats = config.optionMergeStrategies

/**
 * Options with restrictions
 */
strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
        warn(
            `option "${key}" can only be used during instance ` +
                'creation with the `new` keyword.'
        )
    }
    return defaultStrat(parent, child)
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to, from) {
    if (!from) return to
    let key, toVal, fromVal
    const keys = Object.keys(from)
    for (let i = 0; i < keys.length; i++) {
        key = keys[i]
        toVal = to[key]
        fromVal = from[key]
        if (!hasOwn(to, key)) {
            set(to, key, fromVal)
        } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
            mergeData(toVal, fromVal)
        }
    }
    return to
}

/**
 * Data
 */
function mergeDataOrFn(parentVal, childVal, vm) {
    if (!vm) {
        // in a Vue.extend merge, both should be functions
        if (!childVal) {
            return parentVal
        }
        if (!parentVal) {
            return childVal
        }
        // when parentVal & childVal are both present,
        // we need to return a function that returns the
        // merged result of both functions... no need to
        // check if parentVal is a function here because
        // it has to be a function to pass previous merges.
        return function mergedDataFn() {
            return mergeData(
                typeof childVal === 'function'
                    ? childVal.call(this, this)
                    : childVal,
                typeof parentVal === 'function'
                    ? parentVal.call(this, this)
                    : parentVal
            )
        }
    } else {
        return function mergedInstanceDataFn() {
            // instance merge
            const instanceData =
                typeof childVal === 'function'
                    ? childVal.call(vm, vm)
                    : childVal
            const defaultData =
                typeof parentVal === 'function'
                    ? parentVal.call(vm, vm)
                    : parentVal
            if (instanceData) {
                return mergeData(instanceData, defaultData)
            } else {
                return defaultData
            }
        }
    }
}

strats.data = function (parentVal, childVal, vm) {
    if (!vm) {
        if (childVal && typeof childVal !== 'function') {
            warn(
                'The "data" option should be a function ' +
                    'that returns a per-instance value in component ' +
                    'definitions.',
                vm
            )

            return parentVal
        }
        return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
}

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook(parentVal, childVal) {
    return childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : Array.isArray(childVal)
            ? childVal
            : [childVal]
        : parentVal
}

LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(parentVal, childVal, vm, key) {
    const res = Object.create(parentVal || null)
    if (childVal) {
        assertObjectType(key, childVal, vm)
        return extend(res, childVal)
    } else {
        return res
    }
}

ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets
})

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal, vm, key) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) parentVal = undefined
    if (childVal === nativeWatch) childVal = undefined
    /* istanbul ignore if */
    if (!childVal) return Object.create(parentVal || null)
    assertObjectType(key, childVal, vm)
    if (!parentVal) return childVal
    const ret = {}
    extend(ret, parentVal)
    for (const key in childVal) {
        let parent = ret[key]
        const child = childVal[key]
        if (parent && !Array.isArray(parent)) {
            parent = [parent]
        }
        ret[key] = parent
            ? parent.concat(child)
            : Array.isArray(child)
            ? child
            : [child]
    }
    return ret
}

/**
 * Other object hashes.
 */
strats.props =
    strats.methods =
    strats.inject =
    strats.computed =
        function (parentVal, childVal, vm, key) {
            if (childVal) {
                assertObjectType(key, childVal, vm)
            }
            if (!parentVal) return childVal
            const ret = Object.create(null)
            extend(ret, parentVal)
            if (childVal) extend(ret, childVal)
            return ret
        }
strats.provide = mergeDataOrFn

/**
 * Default strategy.
 */
const defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps(options, vm) {
    const props = options.props
    if (!props) return
    const res = {}
    let i, val, name
    if (Array.isArray(props)) {
        i = props.length
        while (i--) {
            val = props[i]
            if (typeof val === 'string') {
                name = camelize(val)
                res[name] = { type: null }
            } else {
                warn('props must be strings when using array syntax.')
            }
        }
    } else if (isPlainObject(props)) {
        for (const key in props) {
            val = props[key]
            name = camelize(key)
            res[name] = isPlainObject(val) ? val : { type: val }
        }
    } else {
        warn(
            `Invalid value for option "props": expected an Array or an Object, ` +
                `but got ${toRawType(props)}.`,
            vm
        )
    }
    options.props = res
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject(options, vm) {
    const inject = options.inject
    if (!inject) return
    const normalized = (options.inject = {})
    if (Array.isArray(inject)) {
        for (let i = 0; i < inject.length; i++) {
            normalized[inject[i]] = { from: inject[i] }
        }
    } else if (isPlainObject(inject)) {
        for (const key in inject) {
            const val = inject[key]
            normalized[key] = isPlainObject(val)
                ? extend({ from: key }, val)
                : { from: val }
        }
    } else {
        warn(
            `Invalid value for option "inject": expected an Array or an Object, ` +
                `but got ${toRawType(inject)}.`,
            vm
        )
    }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives(options) {
    const dirs = options.directives
    if (dirs) {
        for (const key in dirs) {
            const def = dirs[key]
            if (typeof def === 'function') {
                dirs[key] = { bind: def, update: def }
            }
        }
    }
}

function assertObjectType(name, value, vm) {
    if (!isPlainObject(value)) {
        warn(
            `Invalid value for option "${name}": expected an Object, ` +
                `but got ${toRawType(value)}.`,
            vm
        )
    }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions(parent, child, vm) {
    if (typeof child === 'function') {
        child = child.options
    }

    normalizeProps(child, vm)
    normalizeInject(child, vm)
    normalizeDirectives(child)
    const extendsFrom = child.extends
    if (extendsFrom) {
        parent = mergeOptions(parent, extendsFrom, vm)
    }
    if (child.mixins) {
        for (let i = 0, l = child.mixins.length; i < l; i++) {
            parent = mergeOptions(parent, child.mixins[i], vm)
        }
    }
    const options = {}
    let key
    for (key in parent) {
        mergeField(key)
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key)
        }
    }
    function mergeField(key) {
        const strat = strats[key] || defaultStrat
        options[key] = strat(parent[key], child[key], vm, key)
    }
    return options
}

/*  */

function validateProp(key, propOptions, propsData, vm) {
    const prop = propOptions[key]
    const absent = !hasOwn(propsData, key)
    let value = propsData[key]
    // boolean casting
    const booleanIndex = getTypeIndex(Boolean, prop.type)
    if (booleanIndex > -1) {
        if (absent && !hasOwn(prop, 'default')) {
            value = false
        } else if (value === '' || value === hyphenate(key)) {
            // only cast empty string / same name to boolean if
            // boolean has higher priority
            const stringIndex = getTypeIndex(String, prop.type)
            if (stringIndex < 0 || booleanIndex < stringIndex) {
                value = true
            }
        }
    }
    // check default value
    if (value === undefined) {
        value = getPropDefaultValue(vm, prop, key)
        // since the default value is a fresh copy,
        // make sure to observe it.
        const prevShouldObserve = shouldObserve
        toggleObserving(true)
        observe(value)
        toggleObserving(prevShouldObserve)
    }
    if (!(isObject(value) && '@binding' in value)) {
        assertProp(prop, key, value, vm, absent)
    }
    return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue(vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
        return undefined
    }
    const def = prop.default
    // warn against non-factory defaults for Object & Array
    if (isObject(def)) {
        warn(
            'Invalid default value for prop "' +
                key +
                '": ' +
                'Props with type Object/Array must use a factory function ' +
                'to return the default value.',
            vm
        )
    }
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (
        vm &&
        vm.$options.propsData &&
        vm.$options.propsData[key] === undefined &&
        vm._props[key] !== undefined
    ) {
        return vm._props[key]
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function'
        ? def.call(vm)
        : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp(prop, name, value, vm, absent) {
    if (prop.required && absent) {
        warn('Missing required prop: "' + name + '"', vm)
        return
    }
    if (value == null && !prop.required) {
        return
    }
    let type = prop.type
    let valid = !type || type === true
    const expectedTypes = []
    if (type) {
        if (!Array.isArray(type)) {
            type = [type]
        }
        for (let i = 0; i < type.length && !valid; i++) {
            const assertedType = assertType(value, type[i])
            expectedTypes.push(assertedType.expectedType || '')
            valid = assertedType.valid
        }
    }

    if (!valid) {
        warn(getInvalidTypeMessage(name, value, expectedTypes), vm)
        return
    }
    const validator = prop.validator
    if (validator) {
        if (!validator(value)) {
            warn(
                'Invalid prop: custom validator check failed for prop "' +
                    name +
                    '".',
                vm
            )
        }
    }
}

const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/

function assertType(value, type) {
    let valid
    const expectedType = getType(type)
    if (simpleCheckRE.test(expectedType)) {
        const t = typeof value
        valid = t === expectedType.toLowerCase()
        // for primitive wrapper objects
        if (!valid && t === 'object') {
            valid = value instanceof type
        }
    } else if (expectedType === 'Object') {
        valid = isPlainObject(value)
    } else if (expectedType === 'Array') {
        valid = Array.isArray(value)
    } else {
        valid = value instanceof type
    }
    return {
        valid,
        expectedType,
    }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType(fn) {
    const match = fn && fn.toString().match(/^\s*function (\w+)/)
    return match ? match[1] : ''
}

function isSameType(a, b) {
    return getType(a) === getType(b)
}

function getTypeIndex(type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
        return isSameType(expectedTypes, type) ? 0 : -1
    }
    for (let i = 0, len = expectedTypes.length; i < len; i++) {
        if (isSameType(expectedTypes[i], type)) {
            return i
        }
    }
    return -1
}

function getInvalidTypeMessage(name, value, expectedTypes) {
    let message =
        `Invalid prop: type check failed for prop "${name}".` +
        ` Expected ${expectedTypes.map(capitalize).join(', ')}`
    const expectedType = expectedTypes[0]
    const receivedType = toRawType(value)
    const expectedValue = styleValue(value, expectedType)
    const receivedValue = styleValue(value, receivedType)
    // check if we need to specify expected value
    if (
        expectedTypes.length === 1 &&
        isExplicable(expectedType) &&
        !isBoolean(expectedType, receivedType)
    ) {
        message += ` with value ${expectedValue}`
    }
    message += `, got ${receivedType} `
    // check if we need to specify received value
    if (isExplicable(receivedType)) {
        message += `with value ${receivedValue}.`
    }
    return message
}

function styleValue(value, type) {
    if (type === 'String') {
        return `"${value}"`
    } else if (type === 'Number') {
        return `${Number(value)}`
    } else {
        return `${value}`
    }
}

function isExplicable(value) {
    const explicitTypes = ['string', 'number', 'boolean']
    return explicitTypes.some(elem => value.toLowerCase() === elem)
}

function isBoolean(...args) {
    return args.some(elem => elem.toLowerCase() === 'boolean')
}

/*  */

function handleError(err, vm, info) {
    if (vm) {
        let cur = vm
        while ((cur = cur.$parent)) {
            const hooks = cur.$options.errorCaptured
            if (hooks) {
                for (let i = 0; i < hooks.length; i++) {
                    try {
                        const capture =
                            hooks[i].call(cur, err, vm, info) === false
                        if (capture) return
                    } catch (e) {
                        globalHandleError(e, cur, 'errorCaptured hook')
                    }
                }
            }
        }
    }
    globalHandleError(err, vm, info)
}

function globalHandleError(err, vm, info) {
    if (config.errorHandler) {
        try {
            return config.errorHandler.call(null, err, vm, info)
        } catch (e) {
            logError(e, null, 'config.errorHandler')
        }
    }
    logError(err, vm, info)
}

function logError(err, vm, info) {
    warn(`Error in ${info}: "${err.toString()}"`, vm)
    /* istanbul ignore else */
    if (typeof console !== 'undefined') {
        console.error(err)
    } else {
        throw err
    }
}

/*  */

const callbacks = []
let pending = false

function flushCallbacks() {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
        copies[i]()
    }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
let microTimerFunc
let macroTimerFunc
let useMacroTask = false

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    macroTimerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else if (
    typeof MessageChannel !== 'undefined' &&
    (isNative(MessageChannel) ||
        // PhantomJS
        MessageChannel.toString() === '[object MessageChannelConstructor]')
) {
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = flushCallbacks
    macroTimerFunc = () => {
        port.postMessage(1)
    }
} else {
    /* istanbul ignore next */
    macroTimerFunc = () => {
        setTimeout(flushCallbacks, 0)
    }
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve()
    microTimerFunc = () => {
        p.then(flushCallbacks)
    }
} else {
    // fallback to macro
    microTimerFunc = macroTimerFunc
}

function nextTick(cb, ctx) {
    let _resolve
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx)
            } catch (e) {
                handleError(e, ctx, 'nextTick')
            }
        } else if (_resolve) {
            _resolve(ctx)
        }
    })
    if (!pending) {
        pending = true
        if (useMacroTask) {
            macroTimerFunc()
        } else {
            microTimerFunc()
        }
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve
        })
    }
}

/*  */

/*  */

const seenObjects = new _Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse(val) {
    _traverse(val, seenObjects)
    seenObjects.clear()
}

function _traverse(val, seen) {
    let i, keys
    const isA = Array.isArray(val)
    if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
        return
    }
    if (val.__ob__) {
        const depId = val.__ob__.dep.id
        if (seen.has(depId)) {
            return
        }
        seen.add(depId)
    }
    if (isA) {
        i = val.length
        while (i--) _traverse(val[i], seen)
    } else {
        keys = Object.keys(val)
        i = keys.length
        while (i--) _traverse(val[keys[i]], seen)
    }
}

/*  */
let isUpdatingChildComponent = false

function initLifecycle(vm) {
    const options = vm.$options

    // locate first non-abstract parent
    let parent = options.parent

    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm

    vm._watcher = null
    vm._inactive = null
    vm._directInactive = false
    vm._isDestroyed = false
    vm._isBeingDestroyed = false
}

function lifecycleMixin(Vue) {
    Vue.prototype.$forceUpdate = function () {
        const vm = this
        if (vm._watcher) {
            vm._watcher.update()
        }
    }

    Vue.prototype.$destroy = function () {
        const vm = this
        if (vm._isBeingDestroyed) {
            return
        }
        callHook(vm, 'beforeDestroy')
        vm._isBeingDestroyed = true
        // remove self from parent
        const parent = vm.$parent
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
            remove(parent.$children, vm)
        }
        // teardown watchers
        if (vm._watcher) {
            vm._watcher.teardown()
        }
        let i = vm._watchers.length
        while (i--) {
            vm._watchers[i].teardown()
        }
        // remove reference from data ob
        // frozen object may not have observer.
        if (vm._data.__ob__) {
            vm._data.__ob__.vmCount--
        }
        // call the last hook...
        vm._isDestroyed = true
        // fire destroyed hook
        callHook(vm, 'destroyed')
        // turn off all instance listeners.
        vm.$off()
    }
}

function isInInactiveTree(vm) {
    while (vm && (vm = vm.$parent)) {
        if (vm._inactive) return true
    }
    return false
}

function activateChildComponent(vm, direct) {
    if (direct) {
        vm._directInactive = false
        if (isInInactiveTree(vm)) {
            return
        }
    } else if (vm._directInactive) {
        return
    }
    if (vm._inactive || vm._inactive === null) {
        vm._inactive = false
        for (let i = 0; i < vm.$children.length; i++) {
            activateChildComponent(vm.$children[i])
        }
        callHook(vm, 'activated')
    }
}

function callHook(vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget()
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0, j = handlers.length; i < j; i++) {
            try {
                handlers[i].call(vm)
            } catch (e) {
                handleError(e, vm, `${hook} hook`)
            }
        }
    }
    if (vm._hasHookEvent) {
        vm.$emit('hook:' + hook)
    }
    popTarget()
}

/*  */

const MAX_UPDATE_COUNT = 100

const queue = []
const activatedChildren = []
let has = {}
let circular = {}
let waiting = false
let flushing = false
let index = 0

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
    index = queue.length = activatedChildren.length = 0
    has = {}
    circular = {}
    waiting = flushing = false
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
    flushing = true
    let watcher, id

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort((a, b) => a.id - b.id)

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index]
        if (watcher.before) {
            watcher.before()
        }
        id = watcher.id
        has[id] = null
        watcher.run()
        // in dev build--, check and stop circular updates.
        if (has[id] != null) {
            circular[id] = (circular[id] || 0) + 1
            if (circular[id] > MAX_UPDATE_COUNT) {
                warn(
                    'You may have an infinite update loop ' +
                        (watcher.user
                            ? `in watcher with expression "${watcher.expression}"`
                            : `in a component render function.`),
                    watcher.vm
                )
                break
            }
        }
    }

    // keep copies of post queues before resetting state
    const activatedQueue = activatedChildren.slice()
    const updatedQueue = queue.slice()

    resetSchedulerState()

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue)
    callUpdatedHooks(updatedQueue)
}

function callUpdatedHooks(queue) {
    let i = queue.length
    while (i--) {
        const watcher = queue[i]
        const vm = watcher.vm
        if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
            callHook(vm, 'updated')
        }
    }
}

function callActivatedHooks(queue) {
    for (let i = 0; i < queue.length; i++) {
        queue[i]._inactive = true
        activateChildComponent(queue[i], true /* true */)
    }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher(watcher) {
    const id = watcher.id
    if (has[id] == null) {
        has[id] = true
        if (!flushing) {
            queue.push(watcher)
        } else {
            // if already flushing, splice the watcher based on its id
            // if already past its id, it will be run next immediately.
            let i = queue.length - 1
            while (i > index && queue[i].id > watcher.id) {
                i--
            }
            queue.splice(i + 1, 0, watcher)
        }
        // queue the flush
        if (!waiting) {
            waiting = true

            if (!config.async) {
                flushSchedulerQueue()
                return
            }
            nextTick(flushSchedulerQueue)
        }
    }
}

/*  */

let uid$1 = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
class Watcher {
    constructor(vm, expOrFn, cb, options, isRenderWatcher) {
        this.vm = vm
        if (isRenderWatcher) {
            vm._watcher = this
        }
        vm._watchers.push(this)
        // options
        if (options) {
            this.deep = !!options.deep
            this.user = !!options.user
            this.lazy = !!options.lazy
            this.sync = !!options.sync
            this.before = options.before
        } else {
            this.deep = this.user = this.lazy = this.sync = false
        }
        this.cb = cb
        this.id = ++uid$1 // uid for batching
        this.active = true
        this.dirty = this.lazy // for lazy watchers
        this.deps = []
        this.newDeps = []
        this.depIds = new _Set()
        this.newDepIds = new _Set()
        this.expression = expOrFn.toString()
        // parse expression for getter
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn
        } else {
            this.getter = parsePath(expOrFn)
            if (!this.getter) {
                this.getter = noop
                warn(
                    `Failed watching path: "${expOrFn}" ` +
                        'Watcher only accepts simple dot-delimited paths. ' +
                        'For full control, use a function instead.',
                    vm
                )
            }
        }
        this.value = this.lazy ? undefined : this.get()
    }

    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    get() {
        pushTarget(this)
        let value
        const vm = this.vm
        try {
            value = this.getter.call(vm, vm)
        } catch (e) {
            if (this.user) {
                handleError(e, vm, `getter for watcher "${this.expression}"`)
            } else {
                throw e
            }
        } finally {
            // "touch" every property so they are all tracked as
            // dependencies for deep watching
            if (this.deep) {
                traverse(value)
            }
            popTarget()
            this.cleanupDeps()
        }
        return value
    }

    /**
     * Add a dependency to this directive.
     */
    addDep(dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    /**
     * Clean up for dependency collection.
     */
    cleanupDeps() {
        let i = this.deps.length
        while (i--) {
            const dep = this.deps[i]
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this)
            }
        }
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }

    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    update() {
        /* istanbul ignore else */
        if (this.lazy) {
            this.dirty = true
        } else if (this.sync) {
            this.run()
        } else {
            queueWatcher(this)
        }
    }

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    run() {
        if (this.active) {
            const value = this.get()
            if (
                value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated.
                isObject(value) ||
                this.deep
            ) {
                // set new value
                const oldValue = this.value
                this.value = value
                if (this.user) {
                    try {
                        this.cb.call(this.vm, value, oldValue)
                    } catch (e) {
                        handleError(
                            e,
                            this.vm,
                            `callback for watcher "${this.expression}"`
                        )
                    }
                } else {
                    this.cb.call(this.vm, value, oldValue)
                }
            }
        }
    }

    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    evaluate() {
        this.value = this.get()
        this.dirty = false
    }

    /**
     * Depend on all deps collected by this watcher.
     */
    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].depend()
        }
    }

    /**
     * Remove self from all dependencies' subscriber list.
     */
    teardown() {
        if (this.active) {
            // remove self from vm's watcher list
            // this is a somewhat expensive operation so we skip it
            // if the vm is being destroyed.
            if (!this.vm._isBeingDestroyed) {
                remove(this.vm._watchers, this)
            }
            let i = this.deps.length
            while (i--) {
                this.deps[i].removeSub(this)
            }
            this.active = false
        }
    }
}

/*  */

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop,
}

function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

function initState(vm) {
    vm._watchers = []
    const opts = vm.$options
    if (opts.props) initProps(vm, opts.props)
    if (opts.methods) initMethods(vm, opts.methods)
    if (opts.data) {
        initData(vm)
    } else {
        observe((vm._data = {}), true /* asRootData */)
    }
    if (opts.computed) initComputed(vm, opts.computed)
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch)
    }
}

function initProps(vm, propsOptions) {
    const propsData = vm.$options.propsData || {}
    const props = (vm._props = {})
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    const keys = (vm.$options._propKeys = [])
    const isRoot = !vm.$parent
    // root instance props should be converted
    if (!isRoot) {
        toggleObserving(false)
    }
    for (const key in propsOptions) {
        keys.push(key)
        const value = validateProp(key, propsOptions, propsData, vm)
        /* istanbul ignore else */
        const hyphenatedKey = hyphenate(key)
        if (
            isReservedAttribute(hyphenatedKey) ||
            config.isReservedAttr(hyphenatedKey)
        ) {
            warn(
                `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
                vm
            )
        }
        defineReactive$$1(props, key, value, () => {
            if (!isRoot && !isUpdatingChildComponent) {
                warn(
                    `Avoid mutating a prop directly since the value will be ` +
                        `overwritten whenever the parent component re-renders. ` +
                        `Instead, use a data or computed property based on the prop's ` +
                        `value. Prop being mutated: "${key}"`,
                    vm
                )
            }
        })
        // static props are already proxied on the component's prototype
        // during Vue.extend(). We only need to proxy props defined at
        // instantiation here.
        if (!(key in vm)) {
            proxy(vm, `_props`, key)
        }
    }
    toggleObserving(true)
}

function initData(vm) {
    let data = vm.$options.data
    data = vm._data =
        typeof data === 'function' ? getData(data, vm) : data || {}
    if (!isPlainObject(data)) {
        data = {}
        warn(
            'data functions should return an object:\n' +
                'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
            vm
        )
    }
    // proxy data on instance
    const keys = Object.keys(data)
    const props = vm.$options.props
    const methods = vm.$options.methods
    let i = keys.length
    while (i--) {
        const key = keys[i]
        if (methods && hasOwn(methods, key)) {
            warn(
                `Method "${key}" has already been defined as a data property.`,
                vm
            )
        }
        if (props && hasOwn(props, key)) {
            warn(
                `The data property "${key}" is already declared as a prop. ` +
                    `Use prop default value instead.`,
                vm
            )
        } else if (!isReserved(key)) {
            proxy(vm, `_data`, key)
        }
    }
    // observe data
    observe(data, true /* asRootData */)
}

function getData(data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget()
    try {
        return data.call(vm, vm)
    } catch (e) {
        handleError(e, vm, `data()`)
        return {}
    } finally {
        popTarget()
    }
}

const computedWatcherOptions = { lazy: true }

function initComputed(vm, computed) {
    // $flow-disable-line
    const watchers = (vm._computedWatchers = Object.create(null))

    for (const key in computed) {
        const userDef = computed[key]
        const getter = typeof userDef === 'function' ? userDef : userDef.get
        if (getter == null) {
            warn(`Getter is missing for computed property "${key}".`, vm)
        }

        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
            vm,
            getter || noop,
            noop,
            computedWatcherOptions
        )
        // component-defined computed properties are already defined on the
        // component prototype. We only need to define computed properties defined
        // at instantiation here.
        if (!(key in vm)) {
            defineComputed(vm, key, userDef)
        } else {
            if (key in vm.$data) {
                warn(
                    `The computed property "${key}" is already defined in data.`,
                    vm
                )
            } else if (vm.$options.props && key in vm.$options.props) {
                warn(
                    `The computed property "${key}" is already defined as a prop.`,
                    vm
                )
            }
        }
    }
}

function defineComputed(target, key, userDef) {
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = createComputedGetter(key)
        sharedPropertyDefinition.set = noop
    } else {
        sharedPropertyDefinition.get = userDef.get
            ? userDef.cache !== false
                ? createComputedGetter(key)
                : userDef.get
            : noop
        sharedPropertyDefinition.set = userDef.set ? userDef.set : noop
    }
    if (sharedPropertyDefinition.set === noop) {
        sharedPropertyDefinition.set = function () {
            warn(
                `Computed property "${key}" was assigned to but it has no setter.`,
                this
            )
        }
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key]
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate()
            }
            if (Dep.target) {
                watcher.depend()
            }
            return watcher.value
        }
    }
}

function initMethods(vm, methods) {
    const props = vm.$options.props
    for (const key in methods) {
        if (methods[key] == null) {
            warn(
                `Method "${key}" has an undefined value in the component definition. ` +
                    `Did you reference the function correctly?`,
                vm
            )
        }
        if (props && hasOwn(props, key)) {
            warn(`Method "${key}" has already been defined as a prop.`, vm)
        }
        if (key in vm && isReserved(key)) {
            warn(
                `Method "${key}" conflicts with an existing Vue instance method. ` +
                    `Avoid defining component methods that start with _ or $.`
            )
        }
        vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
    }
}

function initWatch(vm, watch) {
    for (const key in watch) {
        const handler = watch[key]
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}

function createWatcher(vm, expOrFn, handler, options) {
    if (isPlainObject(handler)) {
        options = handler
        handler = handler.handler
    }
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    return vm.$watch(expOrFn, handler, options)
}

function stateMixin(Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build-- up
    // the object here.
    const dataDef = {}
    dataDef.get = function () {
        return this._data
    }
    const propsDef = {}
    propsDef.get = function () {
        return this._props
    }
    dataDef.set = function () {
        warn(
            'Avoid replacing instance root $data. ' +
                'Use nested data properties instead.',
            this
        )
    }
    propsDef.set = function () {
        warn(`$props is readonly.`, this)
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef)
    Object.defineProperty(Vue.prototype, '$props', propsDef)

    Vue.prototype.$set = set
    Vue.prototype.$delete = del

    Vue.prototype.$watch = function (expOrFn, cb, options) {
        const vm = this
        if (isPlainObject(cb)) {
            return createWatcher(vm, expOrFn, cb, options)
        }
        options = options || {}
        options.user = true
        const watcher = new Watcher(vm, expOrFn, cb, options)
        if (options.immediate) {
            cb.call(vm, watcher.value)
        }
        return function unwatchFn() {
            watcher.teardown()
        }
    }
}

/*  */

function initEvents(vm) {
    vm._events = Object.create(null)
    vm._hasHookEvent = false
    // init parent attached events
    const listeners = vm.$options._parentListeners
}

function eventsMixin(Vue) {
    const hookRE = /^hook:/
    Vue.prototype.$on = function (event, fn) {
        const vm = this
        if (Array.isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
                vm.$on(event[i], fn)
            }
        } else {
            const events = vm._events[event] || (vm._events[event] = [])
            events.push(fn)
            // optimize hook:event cost by using a boolean flag marked at registration
            // instead of a hash lookup
            if (hookRE.test(event)) {
                vm._hasHookEvent = true
            }
        }
        return vm
    }

    Vue.prototype.$once = function (event, fn) {
        const vm = this
        function on() {
            vm.$off(event, on)
            fn.apply(vm, arguments)
        }
        on.fn = fn
        vm.$on(event, on)
        return vm
    }

    Vue.prototype.$off = function (event, fn) {
        const vm = this
        // all
        if (!arguments.length) {
            vm._events = Object.create(null)
            return vm
        }
        // array of events
        if (Array.isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
                vm.$off(event[i], fn)
            }
            return vm
        }
        // specific event
        const cbs = vm._events[event]
        if (!cbs) {
            return vm
        }
        if (!fn) {
            vm._events[event] = null
            return vm
        }
        if (fn) {
            // specific handler
            let cb
            let i = cbs.length
            while (i--) {
                cb = cbs[i]
                if (cb === fn || cb.fn === fn) {
                    cbs.splice(i, 1)
                    break
                }
            }
        }
        return vm
    }

    Vue.prototype.$emit = function (event) {
        const vm = this
        const lowerCaseEvent = event.toLowerCase()
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
            tip(
                `Event "${lowerCaseEvent}" is emitted in component ` +
                    `${formatComponentName(
                        vm
                    )} but the handler is registered for "${event}". ` +
                    `Note that HTML attributes are case-insensitive and you cannot use ` +
                    `v-on to listen to camelCase events when using in-DOM templates. ` +
                    `You should probably use "${hyphenate(
                        event
                    )}" instead of "${event}".`
            )
        }
        let cbs = vm._events[event]
        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs
            const args = toArray(arguments, 1)
            for (let i = 0, l = cbs.length; i < l; i++) {
                try {
                    cbs[i].apply(vm, args)
                } catch (e) {
                    handleError(e, vm, `event handler for "${event}"`)
                }
            }
        }
        return vm
    }
}

/*  */

function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this

        // a flag to avoid this being observed
        vm._isVue = true
        // merge options
        vm.$options = mergeOptions(
            resolveConstructorOptions(vm.constructor),
            options || {},
            vm
        )
        // expose real self
        vm._self = vm
        initLifecycle(vm)
        initEvents(vm)
        // initRender(vm)
        callHook(vm, 'beforeCreate')
        // initInjections(vm) // resolve injections before data/props
        initState(vm)
        // initProvide(vm) // resolve provide after data/props
        callHook(vm, 'created')
    }
}

function resolveConstructorOptions(Ctor) {
    let options = Ctor.options
    if (Ctor.super) {
        const superOptions = resolveConstructorOptions(Ctor.super)
        const cachedSuperOptions = Ctor.superOptions
        if (superOptions !== cachedSuperOptions) {
            // super option changed,
            // need to resolve new options.
            Ctor.superOptions = superOptions
            // check if there are any late-modified/attached options (#4976)
            const modifiedOptions = resolveModifiedOptions(Ctor)
            // update base extend options
            if (modifiedOptions) {
                extend(Ctor.extendOptions, modifiedOptions)
            }
            options = Ctor.options = mergeOptions(
                superOptions,
                Ctor.extendOptions
            )
            if (options.name) {
                options.components[options.name] = Ctor
            }
        }
    }
    return options
}

function resolveModifiedOptions(Ctor) {
    let modified
    const latest = Ctor.options
    const extended = Ctor.extendOptions
    const sealed = Ctor.sealedOptions
    for (const key in latest) {
        if (latest[key] !== sealed[key]) {
            if (!modified) modified = {}
            modified[key] = dedupe(latest[key], extended[key], sealed[key])
        }
    }
    return modified
}

function dedupe(latest, extended, sealed) {
    // compare latest and sealed to ensure lifecycle hooks won't be duplicated
    // between merges
    if (Array.isArray(latest)) {
        const res = []
        sealed = Array.isArray(sealed) ? sealed : [sealed]
        extended = Array.isArray(extended) ? extended : [extended]
        for (let i = 0; i < latest.length; i++) {
            // push original options and not sealed options to exclude duplicated options
            if (
                extended.indexOf(latest[i]) >= 0 ||
                sealed.indexOf(latest[i]) < 0
            ) {
                res.push(latest[i])
            }
        }
        return res
    } else {
        return latest
    }
}

function Vue(options) {
    if (!(this instanceof Vue)) {
        warn('Vue is a constructor and should be called with the `new` keyword')
    }
    this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)

/*  */

function initUse(Vue) {
    Vue.use = function (plugin) {
        const installedPlugins =
            this._installedPlugins || (this._installedPlugins = [])
        if (installedPlugins.indexOf(plugin) > -1) {
            return this
        }

        // additional parameters
        const args = toArray(arguments, 1)
        args.unshift(this)
        if (typeof plugin.install === 'function') {
            plugin.install.apply(plugin, args)
        } else if (typeof plugin === 'function') {
            plugin.apply(null, args)
        }
        installedPlugins.push(plugin)
        return this
    }
}

/*  */

function initMixin$1(Vue) {
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
        return this
    }
}

/*  */

function initExtend(Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0
    let cid = 1

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
        extendOptions = extendOptions || {}
        const Super = this
        const SuperId = Super.cid
        const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
        if (cachedCtors[SuperId]) {
            return cachedCtors[SuperId]
        }

        const name = extendOptions.name || Super.options.name

        const Sub = function VueComponent(options) {
            this._init(options)
        }
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.cid = cid++
        Sub.options = mergeOptions(Super.options, extendOptions)
        Sub['super'] = Super

        // For props and computed properties, we define the proxy getters on
        // the Vue instances at extension time, on the extended prototype. This
        // avoids Object.defineProperty calls for each instance created.
        if (Sub.options.props) {
            initProps$1(Sub)
        }
        if (Sub.options.computed) {
            initComputed$1(Sub)
        }

        // allow further extension/mixin/plugin usage
        Sub.extend = Super.extend
        Sub.mixin = Super.mixin
        Sub.use = Super.use

        // create asset registers, so extended classes
        // can have their private assets too.
        ASSET_TYPES.forEach(function (type) {
            Sub[type] = Super[type]
        })
        // enable recursive self-lookup
        if (name) {
            Sub.options.components[name] = Sub
        }

        // keep a reference to the super options at extension time.
        // later at instantiation we can check if Super's options have
        // been updated.
        Sub.superOptions = Super.options
        Sub.extendOptions = extendOptions
        Sub.sealedOptions = extend({}, Sub.options)

        // cache constructor
        cachedCtors[SuperId] = Sub
        return Sub
    }
}

function initProps$1(Comp) {
    const props = Comp.options.props
    for (const key in props) {
        proxy(Comp.prototype, `_props`, key)
    }
}

function initComputed$1(Comp) {
    const computed = Comp.options.computed
    for (const key in computed) {
        defineComputed(Comp.prototype, key, computed[key])
    }
}

/*  */

function initAssetRegisters(Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(type => {
        Vue[type] = function (id, definition) {
            if (!definition) {
                return this.options[type + 's'][id]
            } else {
                if (type === 'component' && isPlainObject(definition)) {
                    definition.name = definition.name || id
                    definition = this.options._base.extend(definition)
                }
                if (type === 'directive' && typeof definition === 'function') {
                    definition = { bind: definition, update: definition }
                }
                this.options[type + 's'][id] = definition
                return definition
            }
        }
    })
}

/*  */

function initGlobalAPI(Vue) {
    // config
    const configDef = {}
    configDef.get = () => config
    configDef.set = () => {
        warn(
            'Do not replace the Vue.config object, set individual fields instead.'
        )
    }
    Object.defineProperty(Vue, 'config', configDef)

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
        warn,
        extend,
        mergeOptions,
        defineReactive: defineReactive$$1,
    }

    Vue.set = set
    Vue.delete = del

    Vue.options = Object.create(null)
    ASSET_TYPES.forEach(type => {
        Vue.options[type + 's'] = Object.create(null)
    })

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue

    initUse(Vue)
    initMixin$1(Vue)
    initExtend(Vue)
    initAssetRegisters(Vue)
}

initGlobalAPI(Vue)

export default Vue
