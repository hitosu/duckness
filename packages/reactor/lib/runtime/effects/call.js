"use strict";var _Reaction=_interopRequireDefault(require("../../Reaction"));Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=callEffect;function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function callEffect(a,b,c,d){var e=a.payload,f=a.args,g=(0,_Reaction.default)(e);g.iterator=g.generator.apply(g,_toConsumableArray(f)),g.isRunning=!0,d(g,c,void 0,b)}
//# sourceMappingURL=call.js.map