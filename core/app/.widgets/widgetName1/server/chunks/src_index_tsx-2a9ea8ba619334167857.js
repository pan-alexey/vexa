exports.id = "src_index_tsx";
exports.ids = ["src_index_tsx"];
exports.modules = {

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "webpack/sharing/consume/default/moment/moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _styles_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles.module.css */ "./src/styles.module.css");



var name = 'lazy';
var LazyComponent = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().lazy(function () {
  return __webpack_require__("./src/components lazy recursive ^\\.\\/.*$")("./" + name);
});
var Component = function Component(_ref) {
  var data = _ref.data,
    children = _ref.children,
    contexts = _ref.contexts;
  if (contexts) {
    // @ts-ignore
    var useContext1 = contexts[0]();
    console.log('useContext1', useContext1);
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: _styles_module_css__WEBPACK_IMPORTED_MODULE_2__["default"].root
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "widget 1 \uD83D\uDE0D"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "data: $", JSON.stringify(data)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "time ", moment__WEBPACK_IMPORTED_MODULE_1___default()().format()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "context"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    "data-name": "React lazy:"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Suspense), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LazyComponent, null))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    "data-name": "children",
    className: _styles_module_css__WEBPACK_IMPORTED_MODULE_2__["default"].children
  }, children));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component);

/***/ }),

/***/ "./src/styles.module.css":
/*!*******************************!*\
  !*** ./src/styles.module.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	"root": `widget_ab2885642920fbcc5825`,
	"children": `widget_fd4976405aecbc1491a4`
});


/***/ }),

/***/ "./src/components lazy recursive ^\\.\\/.*$":
/*!********************************************************!*\
  !*** ./src/components/ lazy ^\.\/.*$ namespace object ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./lazy": [
		"./src/components/lazy.tsx",
		"src_components_lazy_tsx"
	],
	"./lazy.tsx": [
		"./src/components/lazy.tsx",
		"src_components_lazy_tsx"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = "./src/components lazy recursive ^\\.\\/.*$";
module.exports = webpackAsyncContext;

/***/ })

};
;
//# sourceMappingURL=src_index_tsx-2a9ea8ba619334167857.js.map