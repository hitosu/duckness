"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_observable_1 = require("redux-observable");
function PoolEpicStream(_a) {
    var _b = _a === void 0 ? {} : _a, buildRootEpic = _b.buildRootEpic;
    var epicMiddleware = (0, redux_observable_1.createEpicMiddleware)();
    var beforeBuild = function () {
    };
    var middlewares = function () {
        return [epicMiddleware];
    };
    var afterBuild = function (_a) {
        var refDucks = _a.refDucks, refErrorReporter = _a.refErrorReporter;
        var rootEpic = buildRootEpic
            ? buildRootEpic(refDucks.current, { refDucks: refDucks, refErrorReporter: refErrorReporter })
            : redux_observable_1.combineEpics.apply(void 0, refDucks.current.reduce(function (epics, duck) {
                if (duck.rootEpic) {
                    duck.setErrorReporter(refErrorReporter.current);
                    epics.push(duck.rootEpic());
                }
                return epics;
            }, []));
        epicMiddleware.run(rootEpic);
    };
    var PoolEpicStream = {};
    Object.defineProperty(PoolEpicStream, 'middlewares', { value: middlewares, writable: false, enumerable: true });
    Object.defineProperty(PoolEpicStream, 'beforeBuild', { value: beforeBuild, writable: false, enumerable: true });
    Object.defineProperty(PoolEpicStream, 'afterBuild', { value: afterBuild, writable: false, enumerable: true });
    return PoolEpicStream;
}
exports.default = PoolEpicStream;
//# sourceMappingURL=PoolEpicStream.js.map