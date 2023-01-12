"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var initDucksStream = Object.freeze({
    afterBuild: function (_a) {
        var refStore = _a.refStore, refDucks = _a.refDucks, refProps = _a.refProps;
        refDucks.current.forEach(function (duck) {
            refStore.current.dispatch({ type: duck.mapActionType('@@INIT'), payload: refProps.current });
        });
    }
});
function mapDuck(map, duck) {
    if (map === void 0) { map = {}; }
    var poolName = duck.poolName, duckName = duck.duckName;
    if (null != poolName && null != duckName) {
        if (null == map[poolName]) {
            map[poolName] = {};
        }
        map[poolName][duckName] = duck;
    }
    return map;
}
function Pool(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.poolName, poolName = _c === void 0 ? 'pool' : _c, _d = _b.props, initProps = _d === void 0 ? {} : _d, _e = _b.ducks, initDucks = _e === void 0 ? [] : _e, _f = _b.middlewares, initMiddlewares = _f === void 0 ? [] : _f, _g = _b.streams, initStreams = _g === void 0 ? [] : _g, _h = _b.buildStore, buildStore = _h === void 0 ? function () {
        return {};
    } : _h, buildRootReducer = _b.buildRootReducer, _j = _b.connectReduxDevtoolsExtension, connectReduxDevtoolsExtension = _j === void 0 ? true : _j;
    var refProps = { current: initProps || {} };
    var refDucks = {
        current: initDucks || [],
        map: (initDucks || []).reduce(function (map, duck) { return mapDuck(map, duck); }, {})
    };
    var refStreams = { current: (initStreams || []).concat([initDucksStream]) };
    var refMiddlewares = { current: initMiddlewares || [] };
    var refErrorReporter = {
        current: ('undefined' !== typeof console && console.error) || (function () { return void 0; })
    };
    var addDuck = function (duck) {
        refDucks.current.push(duck);
        refDucks.map = mapDuck(refDucks.map, duck);
    };
    var addMiddleware = function (middleware) {
        refMiddlewares.current.push(middleware);
    };
    var addStream = function (stream) {
        refStreams.current.unshift(stream);
    };
    var setErrorReporter = function (reporter) {
        refErrorReporter.current = reporter;
    };
    var reportError = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if ('function' === typeof refErrorReporter.current) {
            refErrorReporter.current.apply(refErrorReporter, args);
        }
    };
    var refStore = { current: null };
    var getDuckByName = function (duckPath) {
        if ('string' === typeof duckPath || Array.isArray(duckPath)) {
            var _a = 'string' === typeof duckPath ? [poolName, duckPath] : [duckPath[0], duckPath[1]], duckPoolName = _a[0], duckName = _a[1];
            return refDucks.map[duckPoolName] ? refDucks.map[duckPoolName][duckName] : null;
        }
        else {
            return null;
        }
    };
    var getDispatchActionFromDispatchArgs = function (args) {
        if (1 === args.length) {
            return args[0];
        }
        else if (args.length > 1) {
            var _a = [args[0], args[1], args[2]], duckPath = _a[0], actionName = _a[1], payload = _a[2];
            var duck = getDuckByName(duckPath);
            if (null == duck) {
                var error = new Error("Received action '".concat(actionName, "' dispatch but duck '").concat(duckPath, "' is not found"));
                error.actionName = actionName;
                error.duckPath = duckPath;
                reportError(error, '@duckness/pool', 'dispatch');
                return null;
            }
            else {
                var actionCreator = duck.action[actionName];
                if (null == actionCreator) {
                    var error = new Error("Received action dispatch but action '".concat(actionName, "' for duck '").concat(duckPath, "' is not found"));
                    error.actionName = actionName;
                    error.duckPath = duckPath;
                    reportError(error, '@duckness/pool', 'dispatch');
                    return null;
                }
                else {
                    return actionCreator(payload);
                }
            }
        }
        else {
            return null;
        }
    };
    var dispatch = function () {
        var action = getDispatchActionFromDispatchArgs(arguments);
        if (null == action) {
            var error = new Error('Received action dispatch without action');
            error.poolName = poolName;
            reportError(error, '@duckness/pool', 'dispatch');
        }
        else {
            if (refStore.current) {
                return refStore.current.dispatch(action);
            }
            else {
                var error = new Error('Received action dispatch but pool is not built yet');
                error.dispatchedAction = action;
                error.poolName = poolName;
                reportError(error, '@duckness/pool', 'dispatch', action);
            }
        }
        return void 0;
    };
    var refReducers = { root: null, pre: null, post: null };
    var reduce = function (stateOrAction, andAction) {
        if (void 0 === andAction && !refStore.current) {
            var error = new Error('Reducing state but pool is not built yet');
            error.dispatchedAction = stateOrAction;
            error.poolName = poolName;
            reportError(error, '@duckness/pool', 'reduce', stateOrAction);
            return stateOrAction;
        }
        var state = void 0 === andAction ? refStore.current.getState() : stateOrAction;
        var action = void 0 === andAction ? stateOrAction : andAction;
        if (refReducers.root) {
            return refReducers.root(state, action);
        }
        else {
            var error = new Error('Reducing state but pool is not built yet');
            error.dispatchedAction = action;
            error.poolName = poolName;
            reportError(error, '@duckness/pool', 'reduce', action);
            return state;
        }
    };
    var select = function (selector) {
        if (refStore.current) {
            return 'function' === typeof selector ? selector(refStore.current.getState()) : refStore.current.getState();
        }
        else {
            return void 0;
        }
    };
    var fetch = function (selector, resolver) {
        return new Promise(function (resolve, reject) {
            if (refStore.current) {
                var prevSelectedValue_1 = void 0;
                var resolved_1 = false;
                var unsubscribe_1 = void 0;
                var resolveValue_1 = function (value) {
                    if (unsubscribe_1) {
                        unsubscribe_1();
                    }
                    resolved_1 = true;
                    resolve(value);
                };
                var tryResolve_1 = function (currentState) {
                    var selectedValue = 'function' === typeof selector ? selector(currentState) : currentState;
                    if ('function' === typeof resolver) {
                        resolver(selectedValue, resolveValue_1, prevSelectedValue_1);
                        prevSelectedValue_1 = selectedValue;
                    }
                    else if (void 0 !== selectedValue) {
                        resolveValue_1(selectedValue);
                    }
                };
                tryResolve_1(refStore.current.getState());
                if (!resolved_1) {
                    unsubscribe_1 = refStore.current.subscribe(function () {
                        tryResolve_1(refStore.current.getState());
                    });
                }
            }
            else {
                var error = new Error('Fetching state but pool is not built yet');
                error.poolName = poolName;
                reportError(error, '@duckness/pool', 'fetch');
                reject(error);
            }
        });
    };
    var trigger = function (selector, callback, resolver) {
        if (refStore.current) {
            var prevSelectedValue_2 = void 0;
            var tryResolve_2 = function (currentState) {
                var selectedValue = 'function' === typeof selector ? selector(currentState) : currentState;
                if ('function' === typeof resolver) {
                    resolver(selectedValue, callback, prevSelectedValue_2);
                    prevSelectedValue_2 = selectedValue;
                }
                else if (prevSelectedValue_2 !== selectedValue) {
                    callback(selectedValue);
                }
            };
            tryResolve_2(refStore.current.getState());
            return refStore.current.subscribe(function () {
                tryResolve_2(refStore.current.getState());
            });
        }
        else {
            var error = new Error('Fetching state but pool is not built yet');
            error.poolName = poolName;
            reportError(error, '@duckness/pool', 'trigger');
            return void 0;
        }
    };
    var setPreReducer = function (reducer) {
        refReducers.pre = function (state, action) {
            try {
                return reducer(state, action);
            }
            catch (error) {
                try {
                    error.dispatchedAction = action;
                    error.poolName = poolName;
                }
                catch (_a) {
                }
                reportError(error, '@duckness/pool', 'pre reducer');
                return state;
            }
        };
    };
    var setPostReducer = function (reducer) {
        refReducers.post = function (state, action) {
            try {
                return reducer(state, action);
            }
            catch (error) {
                try {
                    error.dispatchedAction = action;
                    error.poolName = poolName;
                }
                catch (_a) {
                }
                reportError(error, '@duckness/pool', 'post reducer');
                return state;
            }
        };
    };
    var build = function (props) {
        if (props === void 0) { props = refProps.current; }
        refProps.current = props || {};
        refReducers.root = buildRootReducer
            ? buildRootReducer(refDucks.current, { refProps: refProps, refReducers: refReducers, refDucks: refDucks, refErrorReporter: refErrorReporter })
            : function defaultRootReducer(state, action) {
                var preState = refReducers.pre ? refReducers.pre(state, action) : state;
                var ducksReducedState = refDucks.current.reduce(function (state, duck) {
                    try {
                        return duck(state, action);
                    }
                    catch (error) {
                        try {
                            error.poolName = poolName;
                            error.duckPoolName = duck.poolName;
                            error.duckName = duck.duckName;
                            error.dispatchedAction = action;
                        }
                        catch (_a) {
                        }
                        reportError(error, '@duckness/pool', 'reducer', duck.poolName, duck.duckName);
                        return state;
                    }
                }, preState);
                return refReducers.post ? refReducers.post(ducksReducedState, action) : ducksReducedState;
            };
        refStreams.current.forEach(function (stream) {
            if (stream.beforeBuild)
                stream.beforeBuild({ refDucks: refDucks, refProps: refProps, refReducers: refReducers, refErrorReporter: refErrorReporter });
        });
        var composeEnhancers = connectReduxDevtoolsExtension &&
            typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
            : function (x) { return x; };
        var middlewares = refStreams.current
            .reduce(function (streamMiddlewares, stream) {
            return stream.middlewares
                ? streamMiddlewares.concat(stream.middlewares({ refDucks: refDucks, refProps: refProps, refReducers: refReducers, refErrorReporter: refErrorReporter }) || [])
                : streamMiddlewares;
        }, [])
            .concat(refMiddlewares.current || []);
        var enhancer = composeEnhancers(redux_1.applyMiddleware.apply(void 0, middlewares));
        refStore.current = (0, redux_1.createStore)(refReducers.root, buildStore ? buildStore(refProps.current, { refProps: refProps, refDucks: refDucks, refReducers: refReducers, refErrorReporter: refErrorReporter }) || {} : {}, enhancer);
        refStreams.current.forEach(function (stream) {
            if (stream.afterBuild)
                stream.afterBuild({ refStore: refStore, refDucks: refDucks, refProps: refProps, refReducers: refReducers, refErrorReporter: refErrorReporter });
        });
        return refStore.current;
    };
    var pool = {};
    Object.defineProperty(pool, 'addDuck', { value: addDuck, writable: false, enumerable: true });
    Object.defineProperty(pool, 'addMiddleware', { value: addMiddleware, writable: false, enumerable: true });
    Object.defineProperty(pool, 'addStream', { value: addStream, writable: false, enumerable: true });
    Object.defineProperty(pool, 'preReducer', { value: setPreReducer, writable: false, enumerable: true });
    Object.defineProperty(pool, 'postReducer', { value: setPostReducer, writable: false, enumerable: true });
    Object.defineProperty(pool, 'build', { value: build, writable: false, enumerable: true });
    Object.defineProperty(pool, 'reportError', { value: reportError, writable: false, enumerable: true });
    Object.defineProperty(pool, 'setErrorReporter', { value: setErrorReporter, writable: false, enumerable: true });
    Object.defineProperty(pool, 'store', {
        get: function () {
            return refStore.current;
        },
        enumerable: true
    });
    Object.defineProperty(pool, 'dispatch', { value: dispatch, writable: false, enumerable: true });
    Object.defineProperty(pool, 'select', { value: select, writable: false, enumerable: true });
    Object.defineProperty(pool, 'fetch', { value: fetch, writable: false, enumerable: true });
    Object.defineProperty(pool, 'trigger', { value: trigger, writable: false, enumerable: true });
    Object.defineProperty(pool, 'reduce', { value: reduce, writable: false, enumerable: true });
    Object.defineProperty(pool, 'ducks', {
        get: function () {
            return (refDucks.current || []).slice();
        },
        enumerable: true
    });
    Object.defineProperty(pool, 'getDuckByName', { value: getDuckByName, writable: false, enumerable: true });
    Object.defineProperty(pool, 'middlewares', {
        get: function () {
            return (refMiddlewares.current || []).slice();
        },
        enumerable: true
    });
    Object.defineProperty(pool, 'streams', {
        get: function () {
            return (refStreams.current || []).slice();
        },
        enumerable: true
    });
    Object.defineProperty(pool, 'props', {
        get: function () {
            return Object.assign({}, refProps.current || {});
        },
        enumerable: true
    });
    return pool;
}
exports.default = Pool;
//# sourceMappingURL=Pool.js.map