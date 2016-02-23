"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}();Object.defineProperty(exports,"__esModule",{value:!0});var _chalk=require("chalk"),_chalk2=_interopRequireDefault(_chalk),_base_transform=require("./base_transform"),_base_transform2=_interopRequireDefault(_base_transform),_actions=require("../actions"),DispatchTransform=function(e){function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];_classCallCheck(this,t);var r=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,{objectMode:!0}));if(r.name="dispatch",r.action=r.createAction({type:"done",data:null}),e.store&&(r.store=e.store),!r.store)throw new Error("BaseDispatcher: No store provided");return r.on("error",function(e){process.stderr.write((e.stack||e.message)+"\n")}),r}return _inherits(t,e),_createClass(t,[{key:"formatError",value:function(e){return _chalk2["default"].red.bold(e)+"\n"}},{key:"process",value:function(e){switch(e.type){case"error":this.pushAction({type:"error",data:this.formatError(e.data)});break;case"file":this.updateFile(e.data,e.params);break;default:this.pushAction({type:"navigate",data:null===e.data.value?"blank":e.data.value,params:e.params})}}},{key:"updateFile",value:function(e,t){var r=e.type,a=e.operation,n=e.value,o="unselect"===a?_actions.removeFile:_actions.addFile;"all"===r&&1===t.queryCount&&"select"===a&&(this.action.type="navigate",this.action.data="all"),this.store.dispatch(o(n))}},{key:"_flush",value:function(e){this.push(this.action),e()}},{key:"_transform",value:function(e,t,r){this.process(e),r()}}]),t}(_base_transform2["default"]);exports["default"]=DispatchTransform;