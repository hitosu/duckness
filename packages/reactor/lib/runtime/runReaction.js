"use strict";var _effects=_interopRequireDefault(require("./effects"));Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=runReaction;function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function runReaction(a,b,c,d){a.isRunning||a.run();var e=a.next(c);if(e.done)d&&d(e.value);else{var f=e.value;"object"===_typeof(f)&&f.type?_effects.default[f.type]?_effects.default[f.type](f,function(c){runReaction(a,b,c,d)},b):runReaction(a,b,void 0,d):runReaction(a,b,void 0,d)}}
//# sourceMappingURL=runReaction.js.map