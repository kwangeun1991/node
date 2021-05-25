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
};

module.exports = commonLib;
