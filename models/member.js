const { sequelize, Sequelize : { QueryTypes } } = require("./index");
const bcrypt = require('bcrypt');

/**
* member Model
*
*
*/
const member = {
  /**
  * 관리자 등록 요청 처리
  *
  * @param String memId 아이디
  * @param String memPw 비밀번호
  *
  * @return Boolean
  */
  join : async function (memId, memPw) {
    try {
      const hash = await bcrypt.hash(memPw, 10);

      const sql = `INSERT INTO member (memId, memPw) VALUES (:memId, :memPw)`;

      await sequelize.query(sql, {
        replacements : { memId : memId, memPw : hash },
        type : QueryTypes.INSERT,
      });

      return true;

    } catch (err) {
      console.error(err);
      return false;
    }
  },
  /**
  * 로그인
  *
  * @param String memId
  * @param String memPw
  * @param Object req - Request 객체
  *
  * @return Boolean
  */
  login : async function (memId, memPw, req) {
      const sql = `SELECT * FROM member WHERE memId = ? AND isAdmin=1`;
      const rows = await sequelize.query(sql, {
        replacements : [memId],
        type : QueryTypes.SELECT,
      });

      if (rows.length == 0) { // 회원이 없는경우
        return false;
      }

      // 회원이 존재하면 비밀번호 일치 하는지 체크
      const match = await bcrypt.compare(memPw, rows[0].memPw);
      if (match) { // 비밀번호 일치 - 로그인 됨
        req.session.memId = rows[0].memId;
        return true;
      }

      // 불일치 - 로그인 실패
      return false;

  },
};

module.exports = member;
