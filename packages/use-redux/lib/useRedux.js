"use strict";var _react=require("react");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=useRedux,exports.useDispatchAction=useDispatchAction,exports.useDispatch=useDispatch,exports.combineSelectors=combineSelectors;function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _iterableToArrayLimit(a,b){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}}function _arrayWithHoles(a){if(Array.isArray(a))return a}var UNSET_MARKER={};function useRedux(a,b,c,d){var e=(0,_react.useState)(function(){return{selectedState:b(a.getState())}}),f=_slicedToArray(e,2),g=f[0].selectedState,h=f[1],i="function"==typeof d,j="function"==typeof c,k=(0,_react.useRef)(void 0),l=(0,_react.useRef)(UNSET_MARKER);(0,_react.useEffect)(function(){if(k.current=i?a.getState():null,j){var b=!1;c(g,UNSET_MARKER===l.current?g:l.current,function(a){l.current=a,b=!0}),b||(l.current=g)}else!0!==c&&(l.current=g)},[a,b,c,d]);var m=(0,_react.useRef)(null);return m.current=(0,_react.useCallback)(function(a){if(!i||d(a,k.current)){var e=b(a),f=!1;(!0===c||j&&c(e,l.current,function(a){l.current=a,f=!0})||!j&&e!==l.current)&&(h({selectedState:e}),!f&&!0!==c&&(l.current=e))}i&&(k.current=a)},[b,c,d]),(0,_react.useEffect)(function(){var b=a.subscribe(function(){m.current(a.getState())});return function(){b()}},[a]),g}function useDispatchAction(a,b,c){return(0,_react.useCallback)(function(d){return void 0===c?a.dispatch(b(d)):"function"==typeof c?a.dispatch(b(c(d))):a.dispatch(b(c))},[a,b,c])}function useDispatch(a,b){var c=2<arguments.length&&arguments[2]!==void 0?arguments[2]:[];return(0,_react.useCallback)(function(){for(var c=arguments.length,d=Array(c),e=0;e<c;e++)d[e]=arguments[e];return b.apply(void 0,[a.dispatch].concat(d))},[a].concat(_toConsumableArray(c)))}function combineSelectors(a){var b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:{},c=b.selectedStatesEqual,d=Object.keys(a);return{selector:function selector(b){for(var c,e={},f=0;f<d.length;f++)c=d[f],e[c]=a[c](b);return e},shouldUpdate:c?function(a,b,e){for(var f,g=0;g<d.length;g++)if(f=d[g],!c(f,a[f],b[f]))return!0;return e(b),!1}:function(a,b,c){for(var e,f=0;f<d.length;f++)if(e=d[f],a[e]!==b[e])return!0;return c(b),!1}}}
//# sourceMappingURL=useRedux.js.map