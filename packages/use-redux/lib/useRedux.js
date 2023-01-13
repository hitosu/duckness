"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.combineSelectors = exports.useDispatch = exports.useDispatchAction = void 0;
var React = require("react");
var UNSET_MARKER = {};
function useRedux(store, selector, shouldUpdate, shouldSelect) {
    var _a = React.useState(function () {
        return { selectedState: selector(store.getState()) };
    }), selectedState = _a[0].selectedState, setSelectedState = _a[1];
    var customShouldSelect = 'function' === typeof shouldSelect;
    var customShouldUpdate = 'function' === typeof shouldUpdate;
    var refPrevStoreState = React.useRef(void 0);
    var refPrevSelectedState = React.useRef(UNSET_MARKER);
    React.useEffect(function () {
        refPrevStoreState.current = customShouldSelect ? store.getState() : null;
        if (customShouldUpdate) {
            var prevSelectedStateUpdated_1 = false;
            shouldUpdate(selectedState, UNSET_MARKER === refPrevSelectedState.current ? selectedState : refPrevSelectedState.current, function (prevSelectedState) {
                refPrevSelectedState.current = prevSelectedState;
                prevSelectedStateUpdated_1 = true;
            });
            if (!prevSelectedStateUpdated_1) {
                refPrevSelectedState.current = selectedState;
            }
        }
        else if (true !== shouldUpdate) {
            refPrevSelectedState.current = selectedState;
        }
    }, [store, selector, shouldUpdate, shouldSelect]);
    var refSubscription = React.useRef(null);
    refSubscription.current = React.useCallback(function (nextStoreState) {
        if (!customShouldSelect || shouldSelect(nextStoreState, refPrevStoreState.current)) {
            var nextSelectedState = selector(nextStoreState);
            var prevSelectedStateUpdated_2 = false;
            if (true === shouldUpdate ||
                (customShouldUpdate &&
                    shouldUpdate(nextSelectedState, refPrevSelectedState.current, function (prevSelectedState) {
                        refPrevSelectedState.current = prevSelectedState;
                        prevSelectedStateUpdated_2 = true;
                    })) ||
                (!customShouldUpdate && nextSelectedState !== refPrevSelectedState.current)) {
                setSelectedState({ selectedState: nextSelectedState });
                if (!prevSelectedStateUpdated_2 && true !== shouldUpdate) {
                    refPrevSelectedState.current = nextSelectedState;
                }
            }
        }
        if (customShouldSelect) {
            refPrevStoreState.current = nextStoreState;
        }
    }, [selector, shouldUpdate, shouldSelect]);
    React.useEffect(function () {
        var unsubscribe = store.subscribe(function () {
            refSubscription.current(store.getState());
        });
        return function () {
            unsubscribe();
        };
    }, [store]);
    return selectedState;
}
exports.default = useRedux;
function useDispatchAction(store, actionCreator, payloadTransformer) {
    return React.useCallback(function (payload) {
        return void 0 === payloadTransformer
            ? store.dispatch(actionCreator(payload))
            : 'function' === typeof payloadTransformer
                ? store.dispatch(actionCreator(payloadTransformer(payload)))
                : store.dispatch(actionCreator(payloadTransformer));
    }, [store, actionCreator, payloadTransformer]);
}
exports.useDispatchAction = useDispatchAction;
function useDispatch(store, dispatcher, deps) {
    if (deps === void 0) { deps = []; }
    return React.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return dispatcher.apply(void 0, __spreadArray([store.dispatch], args, false));
    }, __spreadArray([store], deps, true));
}
exports.useDispatch = useDispatch;
function combineSelectors(selectorsMap, _a) {
    var _b = _a === void 0 ? {} : _a, selectedStatesEqual = _b.selectedStatesEqual;
    var selectorKeys = Object.keys(selectorsMap);
    var combinedSelectors = {
        selector: function () {
            var sources = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                sources[_i] = arguments[_i];
            }
            var selectedState = {};
            for (var i = 0; i < selectorKeys.length; i++) {
                var selectorKey = selectorKeys[i];
                selectedState[selectorKey] = selectorsMap[selectorKey].apply(selectorsMap, sources);
            }
            return selectedState;
        },
        shouldUpdate: selectedStatesEqual
            ? function (nextSelectedState, prevSelectedState, storePrevSelectedState) {
                for (var i = 0; i < selectorKeys.length; i++) {
                    var selectorKey = selectorKeys[i];
                    if (!selectedStatesEqual(selectorKey, nextSelectedState[selectorKey], prevSelectedState[selectorKey])) {
                        return true;
                    }
                }
                if (storePrevSelectedState) {
                    storePrevSelectedState(prevSelectedState);
                }
                return false;
            }
            : function (nextSelectedState, prevSelectedState, storePrevSelectedState) {
                for (var i = 0; i < selectorKeys.length; i++) {
                    var selectorKey = selectorKeys[i];
                    if (nextSelectedState[selectorKey] !== prevSelectedState[selectorKey]) {
                        return true;
                    }
                }
                if (storePrevSelectedState) {
                    storePrevSelectedState(prevSelectedState);
                }
                return false;
            },
        areEqual: function (nextSelectedState, prevSelectedState) {
            return !combinedSelectors.shouldUpdate(nextSelectedState, prevSelectedState);
        }
    };
    return combinedSelectors;
}
exports.combineSelectors = combineSelectors;
function connect(store, selector, shouldUpdate, shouldSelect, dispatch) {
    if (dispatch === void 0) { dispatch = store.dispatch; }
    var emptyObject = {};
    var emptySelector = function () { return emptyObject; };
    return function (Component, mapToProps) {
        function ConnectedComponent(props) {
            var refProps = React.useRef(props);
            refProps.current = props;
            var safeSelector = React.useCallback(selector ? function (state) { return selector(state, refProps.current) || emptyObject; } : emptySelector, []);
            var selected = useRedux(store, safeSelector, shouldUpdate, shouldSelect);
            var connectedProps = (mapToProps ? mapToProps(selected, props, dispatch) : selected) || emptyObject;
            return React.createElement(Component, __assign({}, props, connectedProps));
        }
        ConnectedComponent.displayName = "connect(".concat(Component.displayName || Component.name || 'Component', ")");
        return ConnectedComponent;
    };
}
exports.connect = connect;
//# sourceMappingURL=useRedux.js.map