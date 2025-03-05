"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whenChanged = exports.always = exports.selectAll = void 0;
var react_1 = require("react");
function selectAll(value) {
    return value;
}
exports.selectAll = selectAll;
function always() {
    return true;
}
exports.always = always;
function whenChanged(a, b) {
    return a !== b;
}
exports.whenChanged = whenChanged;
function createStore(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.initState, initState = _c === void 0 ? {} : _c, _d = _b.actions, actions = _d === void 0 ? {} : _d;
    var refStore = {
        current: initState
    };
    var listeners = new Set();
    var asyncListeners = new Set();
    var isRunningAsyncListeners = false;
    var asyncListenersProcessingTime = 0;
    function runAsyncListeners() {
        if (!isRunningAsyncListeners) {
            isRunningAsyncListeners = true;
            requestAnimationFrame(function () {
                var listener = null;
                while ((listener = asyncListeners.values().next().value)) {
                    var start = performance.now();
                    try {
                        var nextValue = listener.selector ? listener.selector(refStore.current) : refStore.current;
                        if (null == listener.shouldUpdate || listener.shouldUpdate(nextValue, listener.prevValue)) {
                            listener(nextValue);
                        }
                        if (null != listener.shouldUpdate) {
                            listener.prevValue = nextValue;
                        }
                    }
                    catch (error) {
                        console.error(error);
                    }
                    asyncListeners.delete(listener);
                    var end = performance.now();
                    asyncListenersProcessingTime += end - start;
                    if (asyncListenersProcessingTime > 14) {
                        asyncListenersProcessingTime = 0;
                        isRunningAsyncListeners = false;
                        runAsyncListeners();
                        break;
                    }
                }
                asyncListenersProcessingTime = 0;
                isRunningAsyncListeners = false;
            });
        }
    }
    function updateStore(updater) {
        var nextStoreState = updater(refStore.current);
        listeners.forEach(function (listener) {
            try {
                if (listener.shouldSelect && !listener.shouldSelect(nextStoreState, refStore.current)) {
                    return;
                }
                if (listener.async) {
                    asyncListeners.add(listener);
                    runAsyncListeners();
                }
                else {
                    var nextValue = listener.selector ? listener.selector(nextStoreState) : nextStoreState;
                    if (null == listener.shouldUpdate || listener.shouldUpdate(nextValue, listener.prevValue)) {
                        listener(nextValue);
                    }
                    if (null != listener.shouldUpdate) {
                        listener.prevValue = nextValue;
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        });
        refStore.current = nextStoreState;
        return refStore.current;
    }
    function useStore(_a) {
        var _b = _a === void 0 ? {} : _a, updateOnMount = _b.updateOnMount, updateOnUnmount = _b.updateOnUnmount, selector = _b.selector, shouldSelect = _b.shouldSelect, _c = _b.shouldUpdate, shouldUpdate = _c === void 0 ? whenChanged : _c, _d = _b.async, async = _d === void 0 ? false : _d, debounce = _b.debounce;
        var _e = (0, react_1.useState)(function () {
            return selector(updateOnMount ? updateStore(updateOnMount) : refStore.current);
        }), value = _e[0], setValue = _e[1];
        var debounceDuration = (0, react_1.useRef)();
        debounceDuration.current = debounce;
        var debounceTimer = (0, react_1.useRef)();
        (0, react_1.useEffect)(function () {
            var listener = function (nextValue) {
                if (debounceTimer.current) {
                    clearTimeout(debounceTimer.current);
                }
                if (null == debounceDuration.current) {
                    setValue(nextValue);
                }
                else {
                    debounceTimer.current = setTimeout(function () {
                        debounceTimer.current = null;
                        setValue(nextValue);
                    }, debounceDuration.current);
                }
            };
            listener.selector = selector;
            listener.shouldSelect = shouldSelect;
            listener.shouldUpdate = shouldUpdate;
            listener.async = async;
            listeners.add(listener);
            return function () {
                if (debounceTimer.current) {
                    clearTimeout(debounceTimer.current);
                    debounceTimer.current = null;
                }
                if (updateOnUnmount)
                    updateStore(updateOnUnmount);
                listeners.delete(listener);
                asyncListeners.delete(listener);
            };
        }, []);
        return value;
    }
    function Consumer(props) {
        var value = useStore({
            updateOnMount: props.updateOnMount,
            updateOnUnmount: props.updateOnUnmount,
            selector: props.selector,
            shouldSelect: props.shouldSelect,
            shouldUpdate: props.shouldUpdate,
            debounce: props.debounce,
            async: props.async
        });
        return props.children(value);
    }
    var boundActions = {};
    Object.keys(actions).forEach(function (actionName) {
        boundActions[actionName] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            updateStore(function (store) {
                return actions[actionName].apply(store, args) || store;
            });
        };
    });
    function destroy() {
        listeners.clear();
    }
    function subscribe(listener) {
        listeners.add(listener);
        return function () {
            listeners.delete(listener);
        };
    }
    function getState(selector) {
        return selector ? selector(refStore.current) : refStore.current;
    }
    return Object.freeze({
        useStore: useStore,
        Consumer: Consumer,
        actions: boundActions,
        updateStore: updateStore,
        getState: getState,
        subscribe: subscribe,
        destroy: destroy
    });
}
exports.default = createStore;
//# sourceMappingURL=store.js.map