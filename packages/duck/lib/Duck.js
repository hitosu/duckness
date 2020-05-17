"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=Duck;function Duck(a,b,c){var d={current:c},e={},f={},g=[],h=function(a,b){var c=f[b.type],d=null==c||0===c.length?a:1===c.length?c.reducers[0](a,b,e):c.reducers.reduce(function(a,c){var d=c(a,b,e);return null==d?a:d},a);return g.length?g.reduce(function(a,c){if(null==c[0]||c[0](b,e)){var d=c[1](a,b,e);return null==d?a:d}return a},d):d};return Object.defineProperty(h,"duckFace",{value:e,writable:!1,enumerable:!0}),Object.defineProperty(h,"duckName",{value:a,writable:!1,enumerable:!0}),Object.defineProperty(h,"poolName",{value:b,writable:!1,enumerable:!0}),Object.defineProperty(h,"duckContext",{value:d.current,writable:!1,configurable:!0,enumerable:!0}),Object.defineProperty(e,"reduce",{value:h,writable:!1,enumerable:!0}),Object.defineProperty(e,"duckName",{value:a,writable:!1,enumerable:!0}),Object.defineProperty(e,"poolName",{value:b,writable:!1,enumerable:!0}),Object.defineProperty(e,"duckContext",{value:d.current,writable:!1,configurable:!0,enumerable:!0}),addActionTypes(h,e,a,b),addActionConstructors(h,e),addSelectors(h,e),addReducers(h,f,g),addCloning(h,f,g),addContextUpdate(h,e,d),h}function addActionTypes(a,b,c,d){var e={};Object.defineProperty(a,"actionTypes",{value:e,writable:!1,enumerable:!0}),Object.defineProperty(a,"mapActionType",{value:function(a){return e[a]||Object.defineProperty(e,a,{value:(d||"")+"/"+(c||"")+"/"+a,writable:!1,enumerable:!0})[a]},writable:!1,enumerable:!0}),Object.defineProperty(a,"listActionTypes",{value:function(){return Object.keys(e)},writable:!1,enumerable:!0}),Object.defineProperty(b,"actionTypes",{value:e,writable:!1,enumerable:!0})}function addActionConstructors(a,b){function c(d,e,f,g){function h(a){var c=a instanceof Error,d={type:i,payload:!c&&f?f(a,b):a,error:c};return g?g(d,b):d}var i=a.mapActionType(e);return Object.defineProperty(h,"actionType",{value:e,writable:!1,enumerable:!0}),Object.defineProperty(h,"payloadBuilder",{value:f,writable:!1,enumerable:!0}),Object.defineProperty(h,"actionTransformer",{value:g,writable:!1,enumerable:!0}),d&&(Object.defineProperty(h,"actionName",{value:d,writable:!1,enumerable:!0}),Object.defineProperty(c,d,{value:h,writable:!1,enumerable:!0})),h}Object.defineProperty(a,"action",{value:c,writable:!1,enumerable:!0}),Object.defineProperty(b,"action",{value:c,writable:!1,enumerable:!0})}function addSelectors(a,b){var c={};Object.defineProperty(a,"selector",{value:function(a,d){if(a&&"function"==typeof d){var e=function(){for(var a=arguments.length,c=Array(a),e=0;e<a;e++)c[e]=arguments[e];return d.apply(this,[].concat(c,[b]))};Object.defineProperty(e,"selectorName",{value:a,writable:!1,enumerable:!0}),Object.defineProperty(e,"originalSelector",{value:d,writable:!1,enumerable:!0}),Object.defineProperty(c,a,{value:e,writable:!1,enumerable:!0})}},writable:!1,enumerable:!0}),Object.defineProperty(a,"select",{value:c,writable:!1,enumerable:!0}),Object.defineProperty(b,"select",{value:c,writable:!1,enumerable:!0})}function addReducers(a,b,c){Object.defineProperty(a,"reducer",{value:function(d,e){if("function"==typeof e)if("string"==typeof d){var f=a.mapActionType(d);b[f]||(b[f]={actionType:d,reducers:[]}),b[f].reducers.push(e)}else"function"==typeof d?c.push([d,e]):null==d&&c.push([null,e])},writable:!1,enumerable:!0})}function addCloning(a,b,c){Object.defineProperty(a,"clone",{value:function(d,e,f){var g=Duck(d,e,f);return a.listActionTypes().forEach(function(a){g.mapActionType(a)}),Object.keys(a.action).forEach(function(b){var c=a.action[b];"function"==typeof c&&c.actionType&&g.action(b,c.actionType)}),Object.keys(a.select).forEach(function(b){a.select[b].originalSelector&&g.selector(b,a.select[b].originalSelector)}),Object.keys(b).forEach(function(a){var c=b[a];if(c){var d=c.actionType,e=c.reducers;e.forEach(function(a){g.reducer(d,a)})}}),c.forEach(function(a){g.reducer(a[0],a[1])}),g},writable:!1,enumerable:!0})}function addContextUpdate(a,b,c){Object.defineProperty(a,"updateContext",{value:function(d){c.current=d,Object.defineProperty(a,"duckContext",{value:c.current,writable:!1,configurable:!0,enumerable:!0}),Object.defineProperty(b,"duckContext",{value:c.current,writable:!1,configurable:!0,enumerable:!0})},writable:!1,enumerable:!0})}