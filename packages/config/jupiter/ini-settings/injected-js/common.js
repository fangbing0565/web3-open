__webpack_public_path__ = window.__publicUrl__ || __webpack_public_path__;
// inject buildInfo
const build_info = BUILD_INFO;
window.APP_BUILD_INFO = window.APP_BUILD_INFO || {};
window.APP_BUILD_INFO[build_info.app_name] = build_info;
