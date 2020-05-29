"use strict";var _redux=require("redux");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=Pool;function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(Object(b),!0).forEach(function(c){_defineProperty(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(Object(b)).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function Pool(){function a(){"function"==typeof s.current&&s.current.apply(s,arguments)}function b(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:o.current;o.current=b||{};var c=n?n(p.current,{refDucks:p,refErrorReporter:s}):function(b,c){return p.current.reduce(function(b,d){try{return d(b,c)}catch(c){return a(c,"@duckness/pool","reducer",d.poolName,d.duckName),b}},b)};q.current.forEach(function(a){a.beforeBuild&&a.beforeBuild({refDucks:p,refErrorReporter:s})});var d="object"===("undefined"==typeof window?"undefined":_typeof(window))&&window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}):function(a){return a},e=[].concat(_toConsumableArray(q.current.reduce(function(a,b){return b.middlewares?a.concat(b.middlewares({refDucks:p,refErrorReporter:s})||[]):a},[])),_toConsumableArray(r.current)),f=d(_redux.applyMiddleware.apply(void 0,_toConsumableArray(e)));return t.current=(0,_redux.createStore)(c,m?m(o.current,{refProps:o,refDucks:p,refErrorReporter:s})||{}:{},f),q.current.forEach(function(a){a.afterBuild&&a.afterBuild({refStore:t,refDucks:p,refErrorReporter:s})}),p.current.forEach(function(a){t.current.dispatch({type:a.mapActionType("@@INIT"),payload:o.current})}),t.current}var c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},d=c.props,e=void 0===d?{}:d,f=c.ducks,g=void 0===f?[]:f,h=c.middlewares,i=void 0===h?[]:h,j=c.streams,k=void 0===j?[]:j,l=c.buildStore,m=void 0===l?function(){return{}}:l,n=c.buildRootReducer,o={current:e||{}},p={current:g||[]},q={current:k||[]},r={current:i||[]},s={current:"undefined"!=typeof console&&console.error||function(){}},t={current:null},u={};return Object.defineProperty(u,"addDuck",{value:function(a){p.current.push(a)},writable:!1,enumerable:!0}),Object.defineProperty(u,"addMiddleware",{value:function(a){r.current.push(a)},writable:!1,enumerable:!0}),Object.defineProperty(u,"addStream",{value:function(a){q.current.push(a)},writable:!1,enumerable:!0}),Object.defineProperty(u,"build",{value:b,writable:!1,enumerable:!0}),Object.defineProperty(u,"reportError",{value:a,writable:!1,enumerable:!0}),Object.defineProperty(u,"setErrorReporter",{value:function(a){s.current=a},writable:!1,enumerable:!0}),Object.defineProperty(u,"store",{get:function get(){return t.current},enumerable:!0}),Object.defineProperty(u,"ducks",{get:function get(){return _toConsumableArray(p.current||[])},enumerable:!0}),Object.defineProperty(u,"middlewares",{get:function get(){return _toConsumableArray(r.current||[])},enumerable:!0}),Object.defineProperty(u,"streams",{get:function get(){return _toConsumableArray(q.current||[])},enumerable:!0}),Object.defineProperty(u,"props",{get:function get(){return _objectSpread({},o.current||{})},enumerable:!0}),u}
//# sourceMappingURL=Pool.js.map