/**
* 이력서 관리 페이지
*
*/
const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  return res.send("관리자 페이지");
});

module.exports = router;
