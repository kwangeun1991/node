/**
* 공통 함수
*/
const commonLib = {
  /**
  * alert 메세지 출력
  *
  * @param String msg 출력 메세지
  * @param Object res - Response 객체
  */
  alert : function (msg, res) {
    return res.send(`<script>alert("${msg}");</script>`);
  },
  /**
  * 페이지 이동
  *
  * @param String url 이동할 경로
  * @param Object res - Request 객체
  * @param String target _self _parent .. 이동할 창
  */
  go : function (url, res, target) {
    target = target || "self";
    return res.send(`<script>${target}.location.href='${url}';</script>`);
  },
};

module.exports = commonLib;
