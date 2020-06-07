"use strict";var _react=require("react");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=useRedux,exports.useDispatchAction=useDispatchAction;function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _iterableToArrayLimit(a,b){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function useRedux(a,b,c,d){var e=(0,_react.useState)(function(){return b(a.getState())}),f=_slicedToArray(e,2),g=f[0],h=f[1];return(0,_react.useEffect)(function(){var e={current:d?a.getState():null},f={current:c?g:null},i={current:a.subscribe(function(){var g=a.getState();if(!d||d(g,e.current)){var i=b(g);(!c||c(i,f.current))&&h(i),c&&(f.current=i)}d&&(e.current=g)})};return function(){i.current()}},[a,b,c,d]),[g,a.dispatch]}function useDispatchAction(a,b,c){return(0,_react.useCallback)(function(d){return void 0===c?a.dispatch(b(d)):"function"==typeof c?a.dispatch(b(c(d))):a.dispatch(b(c))},[a,b,c])}
//# sourceMappingURL=useRedux.js.map