"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=Reactor;var _runReaction=_interopRequireDefault(require("./runtime/runReaction")),_stopReaction=_interopRequireDefault(require("./runtime/stopReaction")),_Reaction=_interopRequireDefault(require("./Reaction"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function Reactor(){var a={isRunning:!1,reactions:new Set,subscriptions:new Map},b={};return addReagents(b,a),addReactions(b,a),addRuntime(b,a),addSubscriptions(b,a),b}function addReagents(a,b){Object.defineProperty(a,"put",{value:function(a){if(b.isRunning){var c=a.type;if(b.subscriptions.has(c))for(var d=_toConsumableArray(b.subscriptions.get(c)),e=0;e<d.length;e++)d[e](a)}},writable:!1,enumerable:!0})}function addReactions(a,b){Object.defineProperty(a,"addReaction",{value:function(c){var d=(0,_Reaction.default)(c);return b.reactions.add(d),b.isRunning&&(0,_runReaction.default)(d,a,void 0),function(){d.isRunning&&(0,_stopReaction.default)(d,a),b.reactions.delete(d)}},writable:!1,enumerable:!0})}function addRuntime(a,b){Object.defineProperty(a,"run",{value:function(){if(!b.isRunning){b.isRunning=!0;for(var c,d=_toConsumableArray(b.reactions),e=0;e<d.length;e++)c=d[e],c.isRunning&&(0,_stopReaction.default)(c,a),(0,_runReaction.default)(c,a,void 0);return!0}return!1},writable:!1,enumerable:!0}),Object.defineProperty(a,"stop",{value:function(){return!!b.isRunning&&(b.isRunning=!1,b.reactions.forEach(function(b){b.isRunning&&(0,_stopReaction.default)(b,a)}),!0)},writable:!1,enumerable:!0}),Object.defineProperty(a,"isRunning",{get:function get(){return b.isRunning},enumerable:!0}),Object.defineProperty(a,"runReaction",{value:function(b,c,d){return(0,_runReaction.default)(b,a,c,d)},writable:!1,enumerable:!0}),Object.defineProperty(a,"stopReaction",{value:function(b){return(0,_stopReaction.default)(b,a)},writable:!1,enumerable:!0})}function addSubscriptions(a,b){function c(a,c){if("function"==typeof c)return b.subscriptions.has(a)||b.subscriptions.set(a,new Set),b.subscriptions.get(a).add(c),function(){return!!(b.subscriptions.has(a)&&b.subscriptions.get(a).has(c))&&(b.subscriptions.get(a).delete(c),!0)};throw new Error("Reactor.takeEvery: listener should be a Function")}Object.defineProperty(a,"takeEvery",{value:c,writable:!1,enumerable:!0}),Object.defineProperty(a,"take",{value:function(a,b){if("function"==typeof b)var d=c(a,function(a){d(),b(a)});else throw new Error("Reactor.take: listener should be a Function")},writable:!1,enumerable:!0})}
//# sourceMappingURL=Reactor.js.map