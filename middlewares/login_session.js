const { alert, go } = require("../lib/common");

/**
* 로그인 여부 체크 후 추가 처리 미들웨어
*
*/

module.exports.loginSession = (req, res, next) => {
  req.isLogin = res.isLogin = res.locals.isLogin = false;
  if (req.session.memId) { // 로그인 된 경우
    req.isLogin = res.isLogin = res.locals.isLogin = true;
  } else { // 로그인이 안된경우 관리자 페이지 접근 차단
    if(req.url.indexOf("/admin") != -1) {
      //return alert("접근 권한이 없습니다.", res, "/member/login");
    }
  }


  next();
};
