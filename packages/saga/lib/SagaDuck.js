"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=SagaDuck;var _duck=_interopRequireDefault(require("@duckness/duck")),_effects=require("redux-saga/effects");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function SagaDuck(a,b,c){function d(){return regeneratorRuntime.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,(0,_effects.all)(h);case 2:case"end":return a.stop();}},e)}var e=regeneratorRuntime.mark(d),f=(0,_duck.default)(a,b,c),g=console.error,h=[];return Object.defineProperty(f,"saga",{value:function(a){h.push((0,_effects.spawn)(regeneratorRuntime.mark(function b(){return regeneratorRuntime.wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.prev=1,b.next=4,(0,_effects.call)(a,f.face);case 4:return b.abrupt("break",12);case 7:b.prev=7,b.t0=b["catch"](1),"function"==typeof g&&g(b.t0);case 10:b.next=0;break;case 12:case"end":return b.stop();}},b,null,[[1,7]])})))},writable:!1,enumerable:!0}),Object.defineProperty(f,"rootSaga",{value:d,writable:!1,enumerable:!0}),Object.defineProperty(f,"errorReporter",{value:function(a){g=a},writable:!1,enumerable:!0}),f}