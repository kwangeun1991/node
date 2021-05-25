const express = require('express');
const router = express.Router();
const member = require("../models/member"); // member Model 불러오기
const { joinValidator } = require("../middlewares/join_validator"); // 회원가입 유효성 검사
const { alert, go } = require("../lib/common"); // 공통 함수

// 회원가입 부분
router.route("/join")
      // 회원가입 양식 form - get 방식이니까
      .get((req, res, next) => {
        res.render("member/form");
      })
      // 회원가입 처리 - post 방식
      .post(joinValidator, async(req, res, next) => {
        try {
          const result = await member.join(req.body.memId, req.body.memPw);
          if (result) { // 성공
            return go("/member/login", res, "parent");
          }
        } catch (err) {
          console.error(err);
          next(err);
        }

        // 실패
        return alert("관리자 등록 요청 실패", res);
      });

// 로그인 부분
router.route("/login")
      // 로그인 양식
      .get((req, res, next) => {
        return res.render("member/login");
      })
      // 로그인 처리
      .post(joinValidator, async(req, res, next) => {
        try {
          const result = await member.login(req.body.memId, req.body.memPw, req);
          if (result) { // 로그인 성공
            return go("/admin", res, "parent");
          }
        } catch (err) {
          console.error(err);
          next(err);
        }

        // 로그인 실패
        return alert("로그인 실패", res);
      });

// 로그아웃
router.route("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/member/login");
});

module.exports = router;
