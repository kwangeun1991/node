const express = require('express');

const router = express.Router();

router.route("/join")
      // 회원가입 양식 form - get 방식이니까
      .get((req, res, next) => {
        res.render("member/form");
      })
      // 회원가입 처리 - post 방식
      .post((req, res, next) => {

      });

module.exports = router;
