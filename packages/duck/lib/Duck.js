"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=Duck;function Duck(a,b,c){var d={},e={},f=[],g=function(a,b){var g=e[b.type],h=null==g||0===g.length?a:1===g.length?g[0](a,b,d,c):g.reduce(function(a,e){var f=e(a,b,d,c);return null==f?a:f},a);return f.length?f.reduce(function(a,e){if(e[0](b,c)){var f=e[1](a,b,d,c);return null==f?a:f}return a},h):h};return Object.defineProperty(g,"duckFace",{value:d,writable:!1,enumerable:!0}),Object.defineProperty(g,"duckName",{value:a,writable:!1,enumerable:!0}),Object.defineProperty(g,"poolName",{value:b,writable:!1,enumerable:!0}),Object.defineProperty(g,"duckContext",{value:c,writable:!1,enumerable:!0}),Object.defineProperty(d,"reduce",{value:g,writable:!1,enumerable:!0}),Object.defineProperty(d,"duckName",{value:a,writable:!1,enumerable:!0}),Object.defineProperty(d,"poolName",{value:b,writable:!1,enumerable:!0}),Object.defineProperty(d,"duckContext",{value:c,writable:!1,enumerable:!0}),addActionTypes(g,d,a,b,c),addActionConstructors(g,d,a,b,c),addSelectors(g,d,a,b,c),addReducers(g,d,a,b,c,e,f),g}function addActionTypes(a,b,c,d){var e={};Object.defineProperty(a,"actionTypes",{value:e,writable:!1,enumerable:!0}),Object.defineProperty(a,"mapActionType",{value:function(a){return e[a]||Object.defineProperty(e,a,{value:(d||"")+"/"+(c||"")+"/"+a,writable:!1,enumerable:!0})[a]},writable:!1,enumerable:!0}),Object.defineProperty(a,"listActionTypes",{value:function(){return Object.keys(e)},writable:!1,enumerable:!0}),Object.defineProperty(b,"actionTypes",{value:e,writable:!1,enumerable:!0})}function addActionConstructors(a,b,c,d,e){function f(b,c,d,g){function h(a){var b=a instanceof Error,c={type:i,payload:!b&&d?d(a,e):a,error:b};return g?g(c,e):c}var i=a.mapActionType(c);return Object.defineProperty(h,"actionType",{value:c,writable:!1,enumerable:!0}),Object.defineProperty(h,"payloadBuilder",{value:d,writable:!1,enumerable:!0}),Object.defineProperty(h,"actionTransformer",{value:g,writable:!1,enumerable:!0}),b&&(Object.defineProperty(h,"actionName",{value:b,writable:!1,enumerable:!0}),Object.defineProperty(f,b,{value:h,writable:!1,enumerable:!0})),h}Object.defineProperty(a,"action",{value:f,writable:!1,enumerable:!0}),Object.defineProperty(b,"action",{value:f,writable:!1,enumerable:!0})}function addSelectors(a,b,c,d,e){var f={};Object.defineProperty(a,"selector",{value:function(a,c){if(a&&"function"==typeof c){var d=function(){for(var a=arguments.length,d=Array(a),f=0;f<a;f++)d[f]=arguments[f];return c.apply(this,[].concat(d,[b,e]))};Object.defineProperty(d,"selectorName",{value:a,writable:!1,enumerable:!0}),Object.defineProperty(f,a,{value:d,writable:!1,enumerable:!0})}},writable:!1,enumerable:!0}),Object.defineProperty(a,"select",{value:f,writable:!1,enumerable:!0}),Object.defineProperty(b,"select",{value:f,writable:!1,enumerable:!0})}function addReducers(a,b,c,d,e,f,g){Object.defineProperty(a,"reducer",{value:function(b,c){if("function"==typeof c)if("string"==typeof b){var d=a.mapActionType(b);f[d]||(f[d]=[]),f[d].push(c)}else"function"==typeof b?g.push([b,c]):null==b&&g.push([function(){return!0},c])},writable:!1,enumerable:!0})}