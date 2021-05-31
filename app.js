const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { sequelize } = require("./models");
const { loginSession } = require("./middlewares/login_session");

// 라우터
const memberRouter = require("./routes/member");
const adminRouter = require("./routes/admin");
const uploadRouter = require("./routes/upload");
const indexRouter = require("./routes/index"); // index.js 생략 가능

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');

nunjucks.configure('views', {
  express : app,
  watch : true,
});

// DB 연결 - promise 방식
sequelize.sync ({ force : false })
        .then (() => {
          console.log("데이터베이스 연결 성공");
        })
        .catch ((err) => {
          console.error(err);
        });

app.use(morgan('dev'));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use("/", express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키설정
app.use(session({
  resave : false,
  saveUninitialized : true,
  cookie : {
    httpOnly : true,
    secure : false,
  },
  name : 'skesession',
}));
app.use(loginSession);

// 라우터 등록
app.use("/member", memberRouter);
app.use("/admin", adminRouter);
app.use("/upload", uploadRouter);
app.use("/", indexRouter); // / -> 기본경로는 생략가능 => indexRouter 만 써도됨

// 없는 페이지 처리 미들웨어 (라우터)
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url}은 없는 페이지 입니다.`);
  error.status = 404;
  next(error); // 에러 처리 미들웨어로 전달
});

// 에러처리 미들웨어 (라우터)
app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status || 500).render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
