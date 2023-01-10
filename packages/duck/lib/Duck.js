"use strict";
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
function Duck(duckName, poolName, duckContext) {
    var refDuckContext = {
        current: duckContext
    };
    var duckFace = {};
    var typedReducers = {};
    var customReducers = [];
    var duck = function duckRootReducer(state, action) {
        var actionReducers = typedReducers[action.type];
        var reducedState = null == actionReducers || 0 === actionReducers.reducers.length
            ? state
            : 1 === actionReducers.reducers.length
                ? actionReducers.reducers[0](state, action, duckFace)
                : actionReducers.reducers.reduce(function (state, reducer) {
                    var reducedState = reducer(state, action, duckFace);
                    return null == reducedState ? state : reducedState;
                }, state);
        return customReducers.length
            ? customReducers.reduce(function (state, customReducer) {
                if ((null == customReducer[0] && 0 === action.type.indexOf("".concat(poolName || '', "/").concat(duckName || '', "/"))) ||
                    ('function' === typeof customReducer[0] && customReducer[0](action, duckFace))) {
                    var reducedState_1 = customReducer[1](state, action, duckFace);
                    return null == reducedState_1 ? state : reducedState_1;
                }
                else {
                    return state;
                }
            }, reducedState)
            : reducedState;
    };
    Object.defineProperty(duck, 'duckFace', { value: duckFace, writable: false, enumerable: true });
    Object.defineProperty(duck, 'duckName', { value: duckName, writable: false, enumerable: true });
    Object.defineProperty(duck, 'poolName', { value: poolName, writable: false, enumerable: true });
    Object.defineProperty(duck, 'duckContext', {
        value: refDuckContext.current,
        writable: false,
        configurable: true,
        enumerable: true
    });
    Object.defineProperty(duckFace, 'reduce', { value: duck, writable: false, enumerable: true });
    Object.defineProperty(duckFace, 'duckName', { value: duckName, writable: false, enumerable: true });
    Object.defineProperty(duckFace, 'poolName', { value: poolName, writable: false, enumerable: true });
    Object.defineProperty(duckFace, 'duckContext', {
        value: refDuckContext.current,
        writable: false,
        configurable: true,
        enumerable: true
    });
    addActionTypes(duck, duckFace, duckName, poolName);
    addActionConstructors(duck, duckFace);
    addSelectors(duck, duckFace);
    addReducers(duck, typedReducers, customReducers);
    addCloning(duck, typedReducers, customReducers);
    addContextUpdate(duck, duckFace, refDuckContext);
    return duck;
}
exports.default = Duck;
function addActionTypes(duck, duckFace, duckName, poolName) {
    var actionTypes = {};
    function mapActionType(actionType) {
        var fullActionType = "".concat(poolName || '', "/").concat(duckName || '', "/").concat(actionType);
        return '@@' === actionType.substring(0, 2)
            ? fullActionType
            : actionTypes[actionType] ||
                Object.defineProperty(actionTypes, actionType, {
                    value: fullActionType,
                    writable: false,
                    enumerable: true
                })[actionType];
    }
    function listActionTypes() {
        return Object.keys(actionTypes);
    }
    Object.defineProperty(duck, 'actionTypes', { value: actionTypes, writable: false, enumerable: true });
    Object.defineProperty(duck, 'mapActionType', { value: mapActionType, writable: false, enumerable: true });
    Object.defineProperty(duck, 'listActionTypes', { value: listActionTypes, writable: false, enumerable: true });
    Object.defineProperty(duckFace, 'actionTypes', { value: actionTypes, writable: false, enumerable: true });
    Object.defineProperty(duckFace, 'mapActionType', { value: mapActionType, writable: false, enumerable: true });
    Object.defineProperty(duckFace, 'listActionTypes', { value: listActionTypes, writable: false, enumerable: true });
}
function addActionConstructors(duck, duckFace) {
    var buildActionConstructor = function (actionNameOrType, forActionType, payloadBuilder, actionTransformer) {
        var actionType = forActionType || actionNameOrType;
        if ('string' !== typeof actionType || !actionType) {
            throw new Error('@duckness/duck.action: - actionType must be a non empty String');
        }
        var fullActionType = duck.mapActionType(actionType);
        var actionConstructor = function (payload) {
            var isError = payload instanceof Error;
            var action = {
                type: fullActionType,
                payload: !isError && payloadBuilder ? payloadBuilder(payload, duckFace) : payload,
                error: isError
            };
            return actionTransformer ? actionTransformer(action, duckFace) : action;
        };
        Object.defineProperty(actionConstructor, 'actionType', { value: fullActionType, writable: false, enumerable: true });
        Object.defineProperty(actionConstructor, 'duckActionType', { value: actionType, writable: false, enumerable: true });
        Object.defineProperty(actionConstructor, 'payloadBuilder', {
            value: payloadBuilder,
            writable: false,
            enumerable: true
        });
        Object.defineProperty(actionConstructor, 'actionTransformer', {
            value: actionTransformer,
            writable: false,
            enumerable: true
        });
        if (actionNameOrType && 'string' === typeof actionNameOrType) {
            Object.defineProperty(actionConstructor, 'actionName', {
                value: actionNameOrType,
                writable: false,
                enumerable: true
            });
            Object.defineProperty(buildActionConstructor, actionNameOrType, {
                value: actionConstructor,
                writable: false,
                enumerable: true
            });
        }
        return actionConstructor;
    };
    Object.defineProperty(duck, 'action', { value: buildActionConstructor, writable: false, enumerable: true });
    Object.defineProperty(duckFace, 'action', { value: buildActionConstructor, writable: false, enumerable: true });
}
function addSelectors(duck, duckFace) {
    var selectors = {};
    var buildSelector = function (selectorName, selector) {
        if ('function' === typeof selector) {
            var duckedSelector = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return selector.apply(this, __spreadArray(__spreadArray([], args, true), [duckFace], false));
            };
            Object.defineProperty(duckedSelector, 'originalSelector', {
                value: selector,
                writable: false,
                enumerable: true
            });
            if (selectorName) {
                Object.defineProperty(duckedSelector, 'selectorName', {
                    value: selectorName,
                    writable: false,
                    enumerable: true
                });
                Object.defineProperty(selectors, selectorName, {
                    value: duckedSelector,
                    writable: false,
                    enumerable: true
                });
            }
            return duckedSelector;
        }
        else {
            throw new Error('@duckness/duck.selector: - selector must be a Function');
        }
    };
    Object.defineProperty(duck, 'selector', { value: buildSelector, writable: false, enumerable: true });
    Object.defineProperty(duck, 'select', { value: selectors, writable: false, enumerable: true });
    Object.defineProperty(duckFace, 'select', { value: selectors, writable: false, enumerable: true });
}
function addReducers(duck, typedReducers, customReducers) {
    var addReducer = function (actionType, reducer) {
        if ('function' === typeof reducer) {
            if ('string' === typeof actionType) {
                var fullActionType = duck.mapActionType(actionType);
                if (!typedReducers[fullActionType]) {
                    typedReducers[fullActionType] = {
                        actionType: actionType,
                        reducers: []
                    };
                }
                typedReducers[fullActionType].reducers.push(reducer);
            }
            else if ('function' === typeof actionType) {
                customReducers.push([actionType, reducer]);
            }
            else if (null == actionType) {
                customReducers.push([null, reducer]);
            }
            else {
                throw new Error('@duckness/duck.reducer: actionType must be a String, null or Function');
            }
            return reducer;
        }
        else {
            throw new Error('@duckness/duck.reducer: reducer must be a Function');
        }
    };
    Object.defineProperty(duck, 'reducer', { value: addReducer, writable: false, enumerable: true });
}
function addCloning(duck, typedReducers, customReducers) {
    var cloneDuck = function (duckName, poolName, duckContext) {
        var clonedDuck = Duck(duckName, poolName, duckContext);
        duck.listActionTypes().forEach(function (actionType) {
            clonedDuck.mapActionType(actionType);
        });
        Object.keys(duck.action).forEach(function (actionName) {
            var actionConstructor = duck.action[actionName];
            if ('function' === typeof actionConstructor && actionConstructor.actionType) {
                clonedDuck.action(actionName, actionConstructor.duckActionType);
            }
        });
        Object.keys(duck.select).forEach(function (selectorName) {
            if (duck.select[selectorName].originalSelector) {
                clonedDuck.selector(selectorName, duck.select[selectorName].originalSelector);
            }
        });
        Object.keys(typedReducers).forEach(function (reducerActionType) {
            var actionReducers = typedReducers[reducerActionType];
            if (actionReducers) {
                var actionType_1 = actionReducers.actionType, reducers = actionReducers.reducers;
                reducers.forEach(function (reducer) {
                    clonedDuck.reducer(actionType_1, reducer);
                });
            }
        });
        customReducers.forEach(function (customReducer) {
            clonedDuck.reducer(customReducer[0], customReducer[1]);
        });
        return clonedDuck;
    };
    Object.defineProperty(duck, 'clone', { value: cloneDuck, writable: false, enumerable: true });
}
function addContextUpdate(duck, duckFace, refDuckContext) {
    function updateContext(newDuckContext) {
        refDuckContext.current = newDuckContext;
        Object.defineProperty(duck, 'duckContext', {
            value: refDuckContext.current,
            writable: false,
            configurable: true,
            enumerable: true
        });
        Object.defineProperty(duckFace, 'duckContext', {
            value: refDuckContext.current,
            writable: false,
            configurable: true,
            enumerable: true
        });
    }
    Object.defineProperty(duck, 'updateContext', { value: updateContext, writable: false, enumerable: true });
}
//# sourceMappingURL=Duck.js.map