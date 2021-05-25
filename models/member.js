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
    const hash = await bcrypt.hash(memPw, 10);

    const sql = `INSERT INTO member (memId, memPw) VALUES (:memId, :memPw)`;

    const result = await sequelize.query(sql, {
      replacements : { memId : memId, memPw : hash },
      type : QueryTypes.INSERT,
    });
    console.log(result);
  },
};

module.exports = member;
