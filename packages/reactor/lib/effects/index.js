"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.put = exports.takeEvery = exports.take = exports.call = exports.spawn = void 0;
var Effect_1 = require("./Effect");
exports.spawn = Effect_1.default('spawn');
exports.call = Effect_1.default('call');
exports.take = Effect_1.default('take');
exports.takeEvery = Effect_1.default('takeEvery');
exports.put = Effect_1.default('put');
exports.delay = Effect_1.default('delay');
//# sourceMappingURL=index.js.map