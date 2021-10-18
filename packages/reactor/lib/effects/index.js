"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEffect = exports.setContext = exports.getContext = exports.delay = exports.put = exports.takeEvery = exports.take = exports.call = exports.spawn = void 0;
var Effect_1 = require("./Effect");
Object.defineProperty(exports, "isEffect", { enumerable: true, get: function () { return Effect_1.isEffect; } });
exports.spawn = (0, Effect_1.default)('spawn');
exports.call = (0, Effect_1.default)('call');
exports.take = (0, Effect_1.default)('take');
exports.takeEvery = (0, Effect_1.default)('takeEvery');
exports.put = (0, Effect_1.default)('put');
exports.delay = (0, Effect_1.default)('delay');
exports.getContext = (0, Effect_1.default)('getContext');
exports.setContext = (0, Effect_1.default)('setContext');
//# sourceMappingURL=index.js.map