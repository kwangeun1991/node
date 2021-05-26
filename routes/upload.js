/**
* 파일 업로드 라우터
*
*/
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const router = express.Router();

const upload = multer({
  storage : multer.diskStorage({
    // 파일이 저장될 경로
    destination : (req, file, done) => {
      done(null, "public/profile");
    },
    // 저장할 파일명 설정
    filename : (req, file, done) => {
      // 파일 1개만 업로드
      done(null, "profile");
    },
  }),
  limit : { fileSize : 10 * 1024 * 1024 }, // 10mb
});

router.route("/")
      .get((req, res, next) => {
        res.render("upload");
      })
      .post(upload.single("file"), async (req, res, next) => {
        //console.log(req.file);
        // 이미지가 아닌 파일이 업로드 된 경우 -> 삭제
        let isSuccess = true;
        if (req.file && req.file.mimetype.indexOf("image") == -1) {
          await fs.unlink(req.file.path);
          isSuccess = false;
        }

        return res.send(`<script>parent.uploadCallback(${isSuccess});</script>`);
      });

module.exports = router;
