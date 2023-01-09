"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=SagaDuck;var _duck=_interopRequireDefault(require("@duckness/duck")),_effects=require("redux-saga/effects");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _regeneratorRuntime(){"use strict";function a(a,b,c){return Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}),a[b]}function b(a,b,c,e){var f=b&&b.prototype instanceof d?b:d,g=Object.create(f.prototype),h=new m(e||[]);return s(g,"_invoke",{value:i(a,c,h)}),g}function c(a,b,c){try{return{type:"normal",arg:a.call(b,c)}}catch(a){return{type:"throw",arg:a}}}function d(){}function e(){}function f(){}function g(b){["next","throw","return"].forEach(function(c){a(b,c,function(a){return this._invoke(c,a)})})}function h(a,b){function d(e,f,g,h){var i=c(a[e],a,f);if("throw"!==i.type){var j=i.arg,k=j.value;return k&&"object"==_typeof(k)&&r.call(k,"__await")?b.resolve(k.__await).then(function(a){d("next",a,g,h)},function(a){d("throw",a,g,h)}):b.resolve(k).then(function(a){j.value=a,g(j)},function(a){return d("throw",a,g,h)})}h(i.arg)}var e;s(this,"_invoke",{value:function value(a,c){function f(){return new b(function(b,e){d(a,c,b,e)})}return e=e?e.then(f,f):f()}})}function i(a,b,d){var e="suspendedStart";return function(f,g){if("executing"==e)throw new Error("Generator is already running");if("completed"==e){if("throw"===f)throw g;return o()}for(d.method=f,d.arg=g;;){var h=d.delegate;if(h){var i=j(h,d);if(i){if(i===x)continue;return i}}if("next"===d.method)d.sent=d._sent=d.arg;else if("throw"===d.method){if("suspendedStart"==e)throw e="completed",d.arg;d.dispatchException(d.arg)}else"return"===d.method&&d.abrupt("return",d.arg);e="executing";var k=c(a,b,d);if("normal"===k.type){if(e=d.done?"completed":"suspendedYield",k.arg===x)continue;return{value:k.arg,done:d.done}}"throw"===k.type&&(e="completed",d.method="throw",d.arg=k.arg)}}}function j(a,b){var d=b.method,e=a.iterator[d];if(void 0===e)return b.delegate=null,"throw"===d&&a.iterator.return&&(b.method="return",b.arg=void 0,j(a,b),"throw"===b.method)||"return"!==d&&(b.method="throw",b.arg=new TypeError("The iterator does not provide a '"+d+"' method")),x;var f=c(e,a.iterator,b.arg);if("throw"===f.type)return b.method="throw",b.arg=f.arg,b.delegate=null,x;var g=f.arg;return g?g.done?(b[a.resultName]=g.value,b.next=a.nextLoc,"return"!==b.method&&(b.method="next",b.arg=void 0),b.delegate=null,x):g:(b.method="throw",b.arg=new TypeError("iterator result is not an object"),b.delegate=null,x)}function k(a){var b={tryLoc:a[0]};1 in a&&(b.catchLoc=a[1]),2 in a&&(b.finallyLoc=a[2],b.afterLoc=a[3]),this.tryEntries.push(b)}function l(a){var b=a.completion||{};b.type="normal",delete b.arg,a.completion=b}function m(a){this.tryEntries=[{tryLoc:"root"}],a.forEach(k,this),this.reset(!0)}function n(a){if(a){var b=a[u];if(b)return b.call(a);if("function"==typeof a.next)return a;if(!isNaN(a.length)){var c=-1,d=function b(){for(;++c<a.length;)if(r.call(a,c))return b.value=a[c],b.done=!1,b;return b.value=void 0,b.done=!0,b};return d.next=d}}return{next:o}}function o(){return{value:void 0,done:!0}}_regeneratorRuntime=function(){return p};var p={},q=Object.prototype,r=q.hasOwnProperty,s=Object.defineProperty||function(a,b,c){a[b]=c.value},t="function"==typeof Symbol?Symbol:{},u=t.iterator||"@@iterator",v=t.asyncIterator||"@@asyncIterator",w=t.toStringTag||"@@toStringTag";try{a({},"")}catch(b){a=function(a,b,c){return a[b]=c}}p.wrap=b;var x={},y={};a(y,u,function(){return this});var z=Object.getPrototypeOf,A=z&&z(z(n([])));A&&A!==q&&r.call(A,u)&&(y=A);var B=f.prototype=d.prototype=Object.create(y);return e.prototype=f,s(B,"constructor",{value:f,configurable:!0}),s(f,"constructor",{value:e,configurable:!0}),e.displayName=a(f,w,"GeneratorFunction"),p.isGeneratorFunction=function(a){var b="function"==typeof a&&a.constructor;return!!b&&(b===e||"GeneratorFunction"===(b.displayName||b.name))},p.mark=function(b){return Object.setPrototypeOf?Object.setPrototypeOf(b,f):(b.__proto__=f,a(b,w,"GeneratorFunction")),b.prototype=Object.create(B),b},p.awrap=function(a){return{__await:a}},g(h.prototype),a(h.prototype,v,function(){return this}),p.AsyncIterator=h,p.async=function(a,c,d,e,f){void 0===f&&(f=Promise);var g=new h(b(a,c,d,e),f);return p.isGeneratorFunction(c)?g:g.next().then(function(a){return a.done?a.value:g.next()})},g(B),a(B,w,"Generator"),a(B,u,function(){return this}),a(B,"toString",function(){return"[object Generator]"}),p.keys=function(a){var b=Object(a),c=[];for(var d in b)c.push(d);return c.reverse(),function a(){for(;c.length;){var d=c.pop();if(d in b)return a.value=d,a.done=!1,a}return a.done=!0,a}},p.values=n,m.prototype={constructor:m,reset:function reset(a){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(l),!a)for(var b in this)"t"===b.charAt(0)&&r.call(this,b)&&!isNaN(+b.slice(1))&&(this[b]=void 0)},stop:function stop(){this.done=!0;var a=this.tryEntries[0].completion;if("throw"===a.type)throw a.arg;return this.rval},dispatchException:function dispatchException(a){function b(b,d){return f.type="throw",f.arg=a,c.next=b,d&&(c.method="next",c.arg=void 0),!!d}if(this.done)throw a;for(var c=this,d=this.tryEntries.length-1;0<=d;--d){var e=this.tryEntries[d],f=e.completion;if("root"===e.tryLoc)return b("end");if(e.tryLoc<=this.prev){var g=r.call(e,"catchLoc"),h=r.call(e,"finallyLoc");if(g&&h){if(this.prev<e.catchLoc)return b(e.catchLoc,!0);if(this.prev<e.finallyLoc)return b(e.finallyLoc)}else if(!g){if(!h)throw new Error("try statement without catch or finally");if(this.prev<e.finallyLoc)return b(e.finallyLoc)}else if(this.prev<e.catchLoc)return b(e.catchLoc,!0)}}},abrupt:function abrupt(a,b){for(var c,d=this.tryEntries.length-1;0<=d;--d)if(c=this.tryEntries[d],c.tryLoc<=this.prev&&r.call(c,"finallyLoc")&&this.prev<c.finallyLoc){var e=c;break}e&&("break"===a||"continue"===a)&&e.tryLoc<=b&&b<=e.finallyLoc&&(e=null);var f=e?e.completion:{};return f.type=a,f.arg=b,e?(this.method="next",this.next=e.finallyLoc,x):this.complete(f)},complete:function complete(a,b){if("throw"===a.type)throw a.arg;return"break"===a.type||"continue"===a.type?this.next=a.arg:"return"===a.type?(this.rval=this.arg=a.arg,this.method="return",this.next="end"):"normal"===a.type&&b&&(this.next=b),x},finish:function finish(a){for(var b,c=this.tryEntries.length-1;0<=c;--c)if(b=this.tryEntries[c],b.finallyLoc===a)return this.complete(b.completion,b.afterLoc),l(b),x},catch:function _catch(a){for(var b,c=this.tryEntries.length-1;0<=c;--c)if(b=this.tryEntries[c],b.tryLoc===a){var d=b.completion;if("throw"===d.type){var e=d.arg;l(b)}return e}throw new Error("illegal catch attempt")},delegateYield:function delegateYield(a,b,c){return this.delegate={iterator:n(a),resultName:b,nextLoc:c},"next"===this.method&&(this.arg=void 0),x}},p}function SagaDuck(a,b,c){function d(){"function"==typeof i.current&&i.current.apply(i,arguments)}function e(a){j.push((0,_effects.spawn)(_regeneratorRuntime().mark(function b(){return _regeneratorRuntime().wrap(function c(b){for(;1;)switch(b.prev=b.next){case 0:return b.prev=1,b.next=4,(0,_effects.call)(a,h.duckFace);case 4:return b.abrupt("break",13);case 7:b.prev=7,b.t0=b["catch"](1);try{b.t0.poolName=h.poolName,b.t0.duckName=h.duckName}catch(a){}d(b.t0,"@duckness/saga",h.poolName,h.duckName);case 11:b.next=0;break;case 13:case"end":return b.stop();}},b,null,[[1,7]])})))}function f(){return _regeneratorRuntime().wrap(function b(a){for(;1;)switch(a.prev=a.next){case 0:return a.next=2,(0,_effects.all)(j);case 2:case"end":return a.stop();}},g)}var g=_regeneratorRuntime().mark(f),h=(0,_duck.default)(a,b,c),i={current:"undefined"!=typeof console&&console.error||function(){}},j=[];return Object.defineProperty(h,"saga",{value:e,writable:!1,enumerable:!0}),Object.defineProperty(h,"rootSaga",{value:f,writable:!1,enumerable:!0}),Object.defineProperty(h,"setErrorReporter",{value:function b(a){i.current=a},writable:!1,enumerable:!0}),Object.defineProperty(h,"reportError",{value:d,writable:!1,enumerable:!0}),h}
//# sourceMappingURL=SagaDuck.js.map