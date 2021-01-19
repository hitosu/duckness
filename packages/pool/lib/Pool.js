"use strict";var _redux=require("redux");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=Pool;function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(Object(b),!0).forEach(function(c){_defineProperty(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(Object(b)).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _toArray(a){return _arrayWithHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableRest()}function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(a,b){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}var initDucksStream=Object.freeze({afterBuild:function afterBuild(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{},b=a.refStore,c=a.refDucks,d=a.refProps;c.current.forEach(function(a){b.current.dispatch({type:a.mapActionType("@@INIT"),payload:d.current})})}});function mapDuck(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},b=1<arguments.length?arguments[1]:void 0,c=b.poolName,d=b.duckName;return null!=c&&null!=d&&(null==a[c]&&(a[c]={}),a[c][d]=b),a}function Pool(){function a(){"function"==typeof w.current&&w.current.apply(w,arguments)}function b(a){if("string"==typeof a||Array.isArray(a)){var b="string"==typeof a?[g,a]:[a[0],a[1]],c=_slicedToArray(b,2),d=c[0],e=c[1];return t.map[d]?t.map[d][e]:null}return null}function c(c){if(1===c.length)return c[0];if(1<c.length){var d=_toArray(c),e=d[0],f=d[1],g=d.slice(2),h=b(e);if(null==h){var j=new Error("Received action '".concat(f,"' dispatch but duck '").concat(e,"' is not found"));return j.actionName=f,j.duckPath=e,a(j,"@duckness/pool","dispatch"),null}var i=h.action[f];if(null==i){var k=new Error("Received action dispatch but action '".concat(f,"' for duck '").concat(e,"' is not found"));return k.actionName=f,k.duckPath=e,a(k,"@duckness/pool","dispatch"),null}return i.apply(void 0,_toConsumableArray(g))}return null}function d(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:s.current;s.current=b||{},y.root=r?r(t.current,{refProps:s,refReducers:y,refDucks:t,refErrorReporter:w}):function(b,c){var d=y.pre?y.pre(b,c):b,e=t.current.reduce(function(b,d){try{return d(b,c)}catch(e){try{e.poolName=g,e.duckPoolName=d.poolName,e.duckName=d.duckName,e.dispatchedAction=c}catch(a){}return a(e,"@duckness/pool","reducer",d.poolName,d.duckName),b}},d);return y.post?y.post(e,c):e},u.current.forEach(function(a){a.beforeBuild&&a.beforeBuild({refDucks:t,refProps:s,refReducers:y,refErrorReporter:w})});var c="object"===("undefined"==typeof window?"undefined":_typeof(window))&&window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}):function(a){return a},d=[].concat(_toConsumableArray(u.current.reduce(function(a,b){return b.middlewares?a.concat(b.middlewares({refDucks:t,refProps:s,refReducers:y,refErrorReporter:w})||[]):a},[])),_toConsumableArray(v.current)),e=c(_redux.applyMiddleware.apply(void 0,_toConsumableArray(d)));return x.current=(0,_redux.createStore)(y.root,q?q(s.current,{refProps:s,refDucks:t,refReducers:y,refErrorReporter:w})||{}:{},e),u.current.forEach(function(a){a.afterBuild&&a.afterBuild({refStore:x,refDucks:t,refProps:s,refReducers:y,refErrorReporter:w})}),x.current}var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},f=e.poolName,g=void 0===f?"pool":f,h=e.props,i=void 0===h?{}:h,j=e.ducks,k=void 0===j?[]:j,l=e.middlewares,m=void 0===l?[]:l,n=e.streams,o=void 0===n?[]:n,p=e.buildStore,q=void 0===p?function(){return{}}:p,r=e.buildRootReducer,s={current:i||{}},t={current:k||[],map:(k||[]).reduce(function(a,b){return mapDuck(a,b)},{})},u={current:[].concat(_toConsumableArray(o||[]),[initDucksStream])},v={current:m||[]},w={current:"undefined"!=typeof console&&console.error||function(){}},x={current:null},y={root:null,pre:null,post:null},z={};return Object.defineProperty(z,"addDuck",{value:function(a){t.current.push(a),t.map=mapDuck(t.map,a)},writable:!1,enumerable:!0}),Object.defineProperty(z,"addMiddleware",{value:function(a){v.current.push(a)},writable:!1,enumerable:!0}),Object.defineProperty(z,"addStream",{value:function(a){u.current.unshift(a)},writable:!1,enumerable:!0}),Object.defineProperty(z,"preReducer",{value:function(b){y.pre=function(c,d){try{return b(c,d)}catch(b){try{b.dispatchedAction=d,b.poolName=g}catch(a){}return a(b,"@duckness/pool","pre reducer"),c}}},writable:!1,enumerable:!0}),Object.defineProperty(z,"postReducer",{value:function(b){y.post=function(c,d){try{return b(c,d)}catch(b){try{b.dispatchedAction=d,b.poolName=g}catch(a){}return a(b,"@duckness/pool","post reducer"),c}}},writable:!1,enumerable:!0}),Object.defineProperty(z,"build",{value:d,writable:!1,enumerable:!0}),Object.defineProperty(z,"reportError",{value:a,writable:!1,enumerable:!0}),Object.defineProperty(z,"setErrorReporter",{value:function(a){w.current=a},writable:!1,enumerable:!0}),Object.defineProperty(z,"store",{get:function get(){return x.current},enumerable:!0}),Object.defineProperty(z,"dispatch",{value:function(){for(var b=arguments.length,d=Array(b),e=0;e<b;e++)d[e]=arguments[e];var f=c(d);if(null==f){var i=new Error("Received action dispatch without action");i.poolName=g,a(i,"@duckness/pool","dispatch")}else{if(x.current)return x.current.dispatch(f);var h=new Error("Received action dispatch but pool is not built yet");h.dispatchedAction=f,h.poolName=g,a(h,"@duckness/pool","dispatch",f)}},writable:!1,enumerable:!0}),Object.defineProperty(z,"reduce",{value:function(b,c){if(void 0===c&&!x.current){var h=new Error("Reducing state but pool is not built yet");return h.dispatchedAction=b,h.poolName=g,a(h,"@duckness/pool","reduce",b),b}var d=void 0===c?x.current.getState():b,e=void 0===c?b:c;if(y.root)return y.root(d,e);var f=new Error("Reducing state but pool is not built yet");return f.dispatchedAction=e,f.poolName=g,a(f,"@duckness/pool","reduce",e),d},writable:!1,enumerable:!0}),Object.defineProperty(z,"ducks",{get:function get(){return _toConsumableArray(t.current||[])},enumerable:!0}),Object.defineProperty(z,"getDuckByName",{value:b,writable:!1,enumerable:!0}),Object.defineProperty(z,"middlewares",{get:function get(){return _toConsumableArray(v.current||[])},enumerable:!0}),Object.defineProperty(z,"streams",{get:function get(){return _toConsumableArray(u.current||[])},enumerable:!0}),Object.defineProperty(z,"props",{get:function get(){return _objectSpread({},s.current||{})},enumerable:!0}),z}
//# sourceMappingURL=Pool.js.map