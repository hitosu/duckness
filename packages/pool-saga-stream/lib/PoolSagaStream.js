"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_saga_1 = require("redux-saga");
var effects_1 = require("redux-saga/effects");
function PoolSagaStream(_a) {
    var _b = _a === void 0 ? {} : _a, buildRootSaga = _b.buildRootSaga;
    var sagaMiddleware = (0, redux_saga_1.default)();
    var beforeBuild = function () {
    };
    var middlewares = function () {
        return [sagaMiddleware];
    };
    var afterBuild = function (_a) {
        var refDucks = _a.refDucks, refErrorReporter = _a.refErrorReporter;
        var rootSaga = buildRootSaga
            ? buildRootSaga(refDucks.current, { refDucks: refDucks, refErrorReporter: refErrorReporter })
            : function defaultRootSaga() {
                var sagas;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sagas = refDucks.current.reduce(function (sagas, duck) {
                                if (duck.rootSaga) {
                                    if (refErrorReporter.current) {
                                        duck.setErrorReporter(refErrorReporter.current);
                                    }
                                    sagas.push((0, effects_1.spawn)(function () {
                                        var error_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!true) return [3, 5];
                                                    _a.label = 1;
                                                case 1:
                                                    _a.trys.push([1, 3, , 4]);
                                                    return [4, (0, effects_1.call)(duck.rootSaga)];
                                                case 2:
                                                    _a.sent();
                                                    return [3, 5];
                                                case 3:
                                                    error_1 = _a.sent();
                                                    if (refErrorReporter.current) {
                                                        refErrorReporter.current(error_1, '@duckness/pool-saga-stream', 'saga', duck.poolName, duck.duckName);
                                                    }
                                                    return [3, 4];
                                                case 4: return [3, 0];
                                                case 5: return [2];
                                            }
                                        });
                                    }));
                                }
                                return sagas;
                            }, []);
                            return [4, (0, effects_1.all)(sagas)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            };
        sagaMiddleware.run(rootSaga);
    };
    var PoolSagaStream = {};
    Object.defineProperty(PoolSagaStream, 'middlewares', { value: middlewares, writable: false, enumerable: true });
    Object.defineProperty(PoolSagaStream, 'beforeBuild', { value: beforeBuild, writable: false, enumerable: true });
    Object.defineProperty(PoolSagaStream, 'afterBuild', { value: afterBuild, writable: false, enumerable: true });
    return PoolSagaStream;
}
exports.default = PoolSagaStream;
//# sourceMappingURL=PoolSagaStream.js.map