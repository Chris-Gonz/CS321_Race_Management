"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/socket";
exports.ids = ["pages/api/socket"];
exports.modules = {

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = import("socket.io");;

/***/ }),

/***/ "(api)/./src/pages/api/socket.ts":
/*!*********************************!*\
  !*** ./src/pages/api/socket.ts ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ SocketHandler)\n/* harmony export */ });\n/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! socket.io */ \"socket.io\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([socket_io__WEBPACK_IMPORTED_MODULE_0__]);\nsocket_io__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nfunction SocketHandler(req, res) {\n    if (res.socket.server.io) {\n        res.end();\n        return;\n    }\n    console.log(\"Setting up socket.io server\");\n    const io = new socket_io__WEBPACK_IMPORTED_MODULE_0__.Server(res.socket.server);\n    res.socket.server.io = io;\n    io.on(\"connection\", (socket)=>{\n        /* Page listeners */ // Starts the timers on the index page\n        socket.on(\"start\", ()=>{\n            io.emit(\"start-time\");\n        });\n        // Cears the timers on the index page\n        socket.on(\"clear\", ()=>{\n            io.emit(\"clear-time\");\n        });\n        // When press Record lap button on admin, seend to index page to record lap time\n        socket.on(\"record-lap\", (index)=>{\n            io.emit(\"get-lap-time\", index);\n        });\n        // Update cars list\n        socket.on(\"update-cars\", (cars)=>{\n            socket.broadcast.emit(\"get-cars\", cars);\n        });\n        /* Racer listeners */ // Send setup signal to admin page to create new car\n        socket.on(\"setup-racer\", (data)=>{\n            console.log(\"setting up new racer\");\n            const newRacer = {\n                carNum: data.number,\n                name: data.name,\n                link: \"\",\n                image: \"/RaceTrack.jpg\",\n                currentSpeed: 0,\n                connection: true,\n                LapTime: 0\n            };\n            io.emit(\"add-racer\", newRacer);\n        });\n    // need start/stop signal from us to them\n    // need constant stats in json format, this should be constantly pushed to us.\n    });\n    res.end();\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3NvY2tldC50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNtQztBQUVwQixTQUFTQyxjQUFjQyxHQUFRLEVBQUVDLEdBQVEsRUFBRTtJQUN6RCxJQUFJQSxJQUFJQyxNQUFNLENBQUNDLE1BQU0sQ0FBQ0MsRUFBRSxFQUFFO1FBQ3pCSCxJQUFJSSxHQUFHO1FBQ1A7SUFDRCxDQUFDO0lBRURDLFFBQVFDLEdBQUcsQ0FBQztJQUNaLE1BQU1ILEtBQUssSUFBSU4sNkNBQU1BLENBQUNHLElBQUlDLE1BQU0sQ0FBQ0MsTUFBTTtJQUN2Q0YsSUFBSUMsTUFBTSxDQUFDQyxNQUFNLENBQUNDLEVBQUUsR0FBR0E7SUFFdkJBLEdBQUdJLEVBQUUsQ0FBQyxjQUFjLENBQUNOLFNBQVc7UUFDL0Isa0JBQWtCLEdBRWxCLHNDQUFzQztRQUN0Q0EsT0FBT00sRUFBRSxDQUFDLFNBQVMsSUFBTTtZQUN4QkosR0FBR0ssSUFBSSxDQUFDO1FBQ1Q7UUFFQSxxQ0FBcUM7UUFDckNQLE9BQU9NLEVBQUUsQ0FBQyxTQUFTLElBQU07WUFDeEJKLEdBQUdLLElBQUksQ0FBQztRQUNUO1FBRUEsZ0ZBQWdGO1FBQ2hGUCxPQUFPTSxFQUFFLENBQUMsY0FBYyxDQUFDRSxRQUFVO1lBQ2xDTixHQUFHSyxJQUFJLENBQUMsZ0JBQWdCQztRQUN6QjtRQUVBLG1CQUFtQjtRQUNuQlIsT0FBT00sRUFBRSxDQUFDLGVBQWUsQ0FBQ0csT0FBUztZQUNsQ1QsT0FBT1UsU0FBUyxDQUFDSCxJQUFJLENBQUMsWUFBWUU7UUFDbkM7UUFFQSxtQkFBbUIsR0FFbkIsb0RBQW9EO1FBQ3BEVCxPQUFPTSxFQUFFLENBQUMsZUFBZSxDQUFDSyxPQUFTO1lBQ2xDUCxRQUFRQyxHQUFHLENBQUM7WUFDWixNQUFNTyxXQUFnQjtnQkFDckJDLFFBQVFGLEtBQUtHLE1BQU07Z0JBQ25CQyxNQUFNSixLQUFLSSxJQUFJO2dCQUNmQyxNQUFNO2dCQUNOQyxPQUFPO2dCQUNQQyxjQUFjO2dCQUNkQyxZQUFZLElBQUk7Z0JBQ2hCQyxTQUFTO1lBQ1Y7WUFDQWxCLEdBQUdLLElBQUksQ0FBQyxhQUFhSztRQUN0QjtJQUVBLHlDQUF5QztJQUV6Qyw4RUFBOEU7SUFDL0U7SUFFQWIsSUFBSUksR0FBRztBQUNSLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9saXZlLWZlZWQtd2Vic2l0ZS8uL3NyYy9wYWdlcy9hcGkvc29ja2V0LnRzPzMzMzEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FyIH0gZnJvbSBcIkAvaW50ZXJmYWNlL0NhclwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tIFwic29ja2V0LmlvXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTb2NrZXRIYW5kbGVyKHJlcTogYW55LCByZXM6IGFueSkge1xyXG5cdGlmIChyZXMuc29ja2V0LnNlcnZlci5pbykge1xyXG5cdFx0cmVzLmVuZCgpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Y29uc29sZS5sb2coXCJTZXR0aW5nIHVwIHNvY2tldC5pbyBzZXJ2ZXJcIik7XHJcblx0Y29uc3QgaW8gPSBuZXcgU2VydmVyKHJlcy5zb2NrZXQuc2VydmVyKTtcclxuXHRyZXMuc29ja2V0LnNlcnZlci5pbyA9IGlvO1xyXG5cclxuXHRpby5vbihcImNvbm5lY3Rpb25cIiwgKHNvY2tldCkgPT4ge1xyXG5cdFx0LyogUGFnZSBsaXN0ZW5lcnMgKi9cclxuXHJcblx0XHQvLyBTdGFydHMgdGhlIHRpbWVycyBvbiB0aGUgaW5kZXggcGFnZVxyXG5cdFx0c29ja2V0Lm9uKFwic3RhcnRcIiwgKCkgPT4ge1xyXG5cdFx0XHRpby5lbWl0KFwic3RhcnQtdGltZVwiKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIENlYXJzIHRoZSB0aW1lcnMgb24gdGhlIGluZGV4IHBhZ2VcclxuXHRcdHNvY2tldC5vbihcImNsZWFyXCIsICgpID0+IHtcclxuXHRcdFx0aW8uZW1pdChcImNsZWFyLXRpbWVcIik7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBXaGVuIHByZXNzIFJlY29yZCBsYXAgYnV0dG9uIG9uIGFkbWluLCBzZWVuZCB0byBpbmRleCBwYWdlIHRvIHJlY29yZCBsYXAgdGltZVxyXG5cdFx0c29ja2V0Lm9uKFwicmVjb3JkLWxhcFwiLCAoaW5kZXgpID0+IHtcclxuXHRcdFx0aW8uZW1pdChcImdldC1sYXAtdGltZVwiLCBpbmRleCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBVcGRhdGUgY2FycyBsaXN0XHJcblx0XHRzb2NrZXQub24oXCJ1cGRhdGUtY2Fyc1wiLCAoY2FycykgPT4ge1xyXG5cdFx0XHRzb2NrZXQuYnJvYWRjYXN0LmVtaXQoXCJnZXQtY2Fyc1wiLCBjYXJzKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8qIFJhY2VyIGxpc3RlbmVycyAqL1xyXG5cclxuXHRcdC8vIFNlbmQgc2V0dXAgc2lnbmFsIHRvIGFkbWluIHBhZ2UgdG8gY3JlYXRlIG5ldyBjYXJcclxuXHRcdHNvY2tldC5vbihcInNldHVwLXJhY2VyXCIsIChkYXRhKSA9PiB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwic2V0dGluZyB1cCBuZXcgcmFjZXJcIik7XHJcblx0XHRcdGNvbnN0IG5ld1JhY2VyOiBDYXIgPSB7XHJcblx0XHRcdFx0Y2FyTnVtOiBkYXRhLm51bWJlcixcclxuXHRcdFx0XHRuYW1lOiBkYXRhLm5hbWUsXHJcblx0XHRcdFx0bGluazogXCJcIiwgLy8gbGluayB0byB2aWRlbyBmZWVkP1xyXG5cdFx0XHRcdGltYWdlOiBcIi9SYWNlVHJhY2suanBnXCIsIC8vIHBsYWNlaG9sZGVyIGZvciB3ZWJjYW1cclxuXHRcdFx0XHRjdXJyZW50U3BlZWQ6IDAsXHJcblx0XHRcdFx0Y29ubmVjdGlvbjogdHJ1ZSxcclxuXHRcdFx0XHRMYXBUaW1lOiAwLFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRpby5lbWl0KFwiYWRkLXJhY2VyXCIsIG5ld1JhY2VyKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIG5lZWQgc3RhcnQvc3RvcCBzaWduYWwgZnJvbSB1cyB0byB0aGVtXHJcblxyXG5cdFx0Ly8gbmVlZCBjb25zdGFudCBzdGF0cyBpbiBqc29uIGZvcm1hdCwgdGhpcyBzaG91bGQgYmUgY29uc3RhbnRseSBwdXNoZWQgdG8gdXMuXHJcblx0fSk7XHJcblxyXG5cdHJlcy5lbmQoKTtcclxufVxyXG4iXSwibmFtZXMiOlsiU2VydmVyIiwiU29ja2V0SGFuZGxlciIsInJlcSIsInJlcyIsInNvY2tldCIsInNlcnZlciIsImlvIiwiZW5kIiwiY29uc29sZSIsImxvZyIsIm9uIiwiZW1pdCIsImluZGV4IiwiY2FycyIsImJyb2FkY2FzdCIsImRhdGEiLCJuZXdSYWNlciIsImNhck51bSIsIm51bWJlciIsIm5hbWUiLCJsaW5rIiwiaW1hZ2UiLCJjdXJyZW50U3BlZWQiLCJjb25uZWN0aW9uIiwiTGFwVGltZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/socket.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/socket.ts"));
module.exports = __webpack_exports__;

})();