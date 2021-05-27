/**
* 이력서 관리 페이지
*
*/
const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  const params = {
    addClass : 'admin_page',
  };
  return res.render("admin/main", params);
});

// 이력서 저장 처리
router.post("/profile", (req, res, next) => {
  console.log(req.body);
  res.send('');
});

module.exports = router;
