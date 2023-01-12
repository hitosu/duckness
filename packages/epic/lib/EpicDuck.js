"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var duck_1 = require("@duckness/duck");
var redux_observable_1 = require("redux-observable");
var operators_1 = require("rxjs/operators");
function EpicDuck(duckName, poolName, duckContext) {
    var duck = (0, duck_1.default)(duckName, poolName, duckContext);
    var refErrorReporter = {
        current: ('undefined' !== typeof console && console.error) || (function () { return void 0; })
    };
    function setErrorReporter(reporter) {
        refErrorReporter.current = reporter;
    }
    function reportError() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if ('function' === typeof refErrorReporter.current) {
            refErrorReporter.current.apply(refErrorReporter, args);
        }
    }
    var epics = [];
    function addEpic(epic) {
        epics.push(function (action$, state$, dependencies) {
            return (dependencies ? epic(action$, state$, dependencies, duck.duckFace) : epic(action$, state$, duck.duckFace)).pipe((0, operators_1.catchError)(function (error, source) {
                try {
                    error.poolName = duck.poolName;
                    error.duckName = duck.duckName;
                }
                catch (_a) {
                }
                reportError(error, '@duckness/epic', duck.poolName, duck.duckName);
                return source;
            }));
        });
    }
    function rootEpic() {
        return redux_observable_1.combineEpics.apply(void 0, epics);
    }
    Object.defineProperty(duck, 'epic', { value: addEpic, writable: false, enumerable: true });
    Object.defineProperty(duck, 'rootEpic', { value: rootEpic, writable: false, enumerable: true });
    Object.defineProperty(duck, 'setErrorReporter', { value: setErrorReporter, writable: false, enumerable: true });
    Object.defineProperty(duck, 'reportError', { value: reportError, writable: false, enumerable: true });
    return duck;
}
exports.default = EpicDuck;
//# sourceMappingURL=EpicDuck.js.map