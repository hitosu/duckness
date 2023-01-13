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
    function updateStore(updater) {
        var nextStoreState = updater(refStore.current);
        listeners.forEach(function (listener) {
            if (listener.shouldSelect && !listener.shouldSelect(nextStoreState, refStore.current)) {
                return;
            }
            var nextValue = listener.selector ? listener.selector(nextStoreState) : nextStoreState;
            if (null == listener.shouldUpdate || listener.shouldUpdate(nextValue, listener.prevValue)) {
                listener(nextValue);
                if (null != listener.shouldUpdate) {
                    listener.prevValue = nextValue;
                }
            }
        });
        refStore.current = nextStoreState;
        return refStore.current;
    }
    function useStore(_a) {
        var _b = _a === void 0 ? {} : _a, updateOnMount = _b.updateOnMount, updateOnUnmount = _b.updateOnUnmount, selector = _b.selector, shouldSelect = _b.shouldSelect, _c = _b.shouldUpdate, shouldUpdate = _c === void 0 ? whenChanged : _c, debounce = _b.debounce;
        var _d = (0, react_1.useState)(function () {
            return selector(updateOnMount ? updateStore(updateOnMount) : refStore.current);
        }), value = _d[0], setValue = _d[1];
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
            listeners.add(listener);
            return function () {
                if (updateOnUnmount)
                    updateStore(updateOnUnmount);
                listeners.delete(listener);
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
            debounce: props.debounce
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