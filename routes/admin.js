const express = require('express');
const router = express.Router();
const resume = require("../models/resume");

/**
* 이력서 관리 페이지
*
*/
router.get("/", (req, res, next) => {
  const params = {
    addClass : 'admin_page',
  };
  return res.render("admin/main", params);
});

// 이력서 저장 처리
router.post("/profile", async (req, res, next) => {
  //console.log(req.body);
  const result = await resume.update(req.body);
  res.send('');
});

module.exports = router;
