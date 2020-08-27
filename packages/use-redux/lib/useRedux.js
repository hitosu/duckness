"use strict";var _react=require("react");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=useRedux,exports.useDispatchAction=useDispatchAction,exports.useDispatch=useDispatch;function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _iterableToArrayLimit(a,b){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function useRedux(a,b,c,d){var e=(0,_react.useState)(function(){return b(a.getState())}),f=_slicedToArray(e,2),g=f[0],h=f[1],i="function"==typeof d,j=(0,_react.useRef)(null);j.current=(0,_react.useMemo)(function(){return i?a.getState():null},[a,i]);var k=(0,_react.useRef)(null);!0!==c&&(k.current=g);var l=(0,_react.useRef)(null);return l.current=(0,_react.useCallback)(function(a){if(!i||d(a,j.current)){var e=b(a),f=!1;(!0===c||"function"==typeof c&&c(e,k.current,function(a){k.current=a,f=!0})||e!==k.current)&&(h(e),!f&&!0!==c&&(k.current=e))}i&&(j.current=a)},[b,c,d,i]),(0,_react.useEffect)(function(){var b=a.subscribe(function(){l.current(a.getState())});return function(){b()}},[a]),g}function useDispatchAction(a,b,c){return(0,_react.useCallback)(function(d){return void 0===c?a.dispatch(b(d)):"function"==typeof c?a.dispatch(b(c(d))):a.dispatch(b(c))},[a,b,c])}function useDispatch(a,b){var c=2<arguments.length&&arguments[2]!==void 0?arguments[2]:[];return(0,_react.useCallback)(function(){for(var c=arguments.length,d=Array(c),e=0;e<c;e++)d[e]=arguments[e];return b.apply(void 0,[a.dispatch].concat(d))},[a].concat(_toConsumableArray(c)))}
//# sourceMappingURL=useRedux.js.map