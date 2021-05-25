const { alert } = require("../lib/common");
/**
* 회원가입 유효성 검사 미들웨어
*
*/
module.exports.joinValidator = (req, res, next) => {
  // 필수입력 항목 체크
  // req.body.memId req.body.memPw
  if (!req.body.memId) {
    return alert("아이디를 입력하세요.", res);
  }

  if (!req.body.memPw) {
    return alert("비밀번호를 입력하세요.", res);
  }

  next(); // 유효성 검사 성공시 다음 미들웨어로 이동
};
