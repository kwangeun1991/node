const express = require('express');
const router = express.Router();
const member = require("../models/member"); // member Model 불러오기
const { joinValidator } = require("../middlewares/join_validator"); // 회원가입 유효성 검사

router.route("/join")
      // 회원가입 양식 form - get 방식이니까
      .get((req, res, next) => {
        res.render("member/form");
      })
      // 회원가입 처리 - post 방식
      .post(joinValidator, async(req, res, next) => {
        try {
          const result = await member.join(req.memId, req.memPw);
        } catch (err) {
          console.error(err);
          next(err);
        }
      });

module.exports = router;
