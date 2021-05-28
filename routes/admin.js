const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const resume = require("../models/resume");
const { alert, reload } = require("../lib/common");

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

router.route("/profile")
  // 저장된 이력서 데이터
  .get(async(req, res, next) => {
    const data = await resume.get();
    return res.json(data);
  })
  // 이력서 저장 처리
  .post(async (req, res, next) => {
    //console.log(req.body);
    const result = await resume.update(req.body);
    if (!result) {
      return alert("이력서 저장에 실패하였습니다.", res);
    }

    return reload(res, "parent");
  });

// 이력서 이미지 삭제
router.get("/remove_photo", async (req, res, next) => {
  try {
    await fs.unlink(path.join(__dirname, "../public/profile/profile"));
    return res.send("1");
  } catch (err) {}

  return res.send("0");
});

module.exports = router;
