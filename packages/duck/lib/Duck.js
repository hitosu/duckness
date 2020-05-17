"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=Duck;function Duck(a,b,c){var d=function(a){return a},e={};return addActionTypes(d,e,a,b,c),addActionConstructors(d,e,a,b,c),addSelectors(d,e,a,b,c),d}function addActionTypes(a,b,c,d){var e={};Object.defineProperty(a,"actionTypes",{value:e,writable:!1,enumerable:!0}),Object.defineProperty(a,"mapActionType",{value:function(a){return e[a]||Object.defineProperty(e,a,{value:(d||"")+"/"+(c||"")+"/"+a,writable:!1,enumerable:!0})[a]},writable:!1,enumerable:!0}),Object.defineProperty(a,"listActionTypes",{value:function(){return Object.keys(e)},writable:!1,enumerable:!0}),Object.defineProperty(b,"actionTypes",{value:e,writable:!1,enumerable:!0})}function addActionConstructors(a,b,c,d,e){var f={};Object.defineProperty(a,"action",{value:function(b,c,d,g){function h(a){var b=a instanceof Error,c={type:i,payload:!b&&d?d(a,e):a,error:b};return g?g(c,e):c}var i=a.mapActionType(c);return Object.defineProperty(h,"actionType",{value:c,writable:!1,enumerable:!0}),Object.defineProperty(h,"payloadBuilder",{value:d,writable:!1,enumerable:!0}),Object.defineProperty(h,"actionTransformer",{value:g,writable:!1,enumerable:!0}),b&&(Object.defineProperty(h,"actionName",{value:b,writable:!1,enumerable:!0}),Object.defineProperty(f,b,{value:h,writable:!1,enumerable:!0})),h},writable:!1,enumerable:!0}),Object.defineProperty(a,"act",{value:f,writable:!1,enumerable:!0})}function addSelectors(a,b,c,d,e){var f={};Object.defineProperty(a,"selector",{value:function(a,c){if(a&&"function"==typeof c){var d=function(){var a=Array.prototype.slice.call(arguments);return a.push(b),a.push(e),c.apply(this,a)};Object.defineProperty(d,"selectorName",{value:a,writable:!1,enumerable:!0}),Object.defineProperty(f,a,{value:d,writable:!1,enumerable:!0})}},writable:!1,enumerable:!0}),Object.defineProperty(a,"select",{value:f,writable:!1,enumerable:!0}),Object.defineProperty(b,"select",{value:f,writable:!1,enumerable:!0})}