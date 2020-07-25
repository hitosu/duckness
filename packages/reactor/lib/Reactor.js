"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocalReactorRuntime_1 = require("./runtimes/local/LocalReactorRuntime");
function Reactor(runtime) {
    if (runtime === void 0) { runtime = LocalReactorRuntime_1.default; }
    var reactor = runtime();
    return Object.freeze(reactor);
}
exports.default = Reactor;
//# sourceMappingURL=Reactor.js.map