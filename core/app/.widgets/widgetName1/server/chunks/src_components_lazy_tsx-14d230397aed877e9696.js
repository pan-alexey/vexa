"use strict";
exports.id = "src_components_lazy_tsx";
exports.ids = ["src_components_lazy_tsx"];
exports.modules = {

/***/ "./src/components/lazy.tsx":
/*!*********************************!*\
  !*** ./src/components/lazy.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var a = [1, 2, 3, 4, 5];
var LazyComponent = function LazyComponent() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Lazy component 1"), a.map(function (item) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      key: item
    }, item);
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LazyComponent);

/***/ })

};
;
//# sourceMappingURL=src_components_lazy_tsx-14d230397aed877e9696.js.map