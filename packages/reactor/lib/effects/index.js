"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEffect = exports.setContext = exports.getContext = exports.delay = exports.put = exports.takeEvery = exports.take = exports.call = exports.spawn = void 0;
var Effect_1 = require("./Effect");
Object.defineProperty(exports, "isEffect", { enumerable: true, get: function () { return Effect_1.isEffect; } });
exports.spawn = Effect_1.default('spawn');
exports.call = Effect_1.default('call');
exports.take = Effect_1.default('take');
exports.takeEvery = Effect_1.default('takeEvery');
exports.put = Effect_1.default('put');
exports.delay = Effect_1.default('delay');
exports.getContext = Effect_1.default('getContext');
exports.setContext = Effect_1.default('setContext');
//# sourceMappingURL=index.js.map