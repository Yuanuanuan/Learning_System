const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("正在接收跟auth有關的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連結");
});

router.post("/register", async (req, res) => {
  // 確認是否都是符合規範的值
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // 確認是否為註冊過的信箱
  const emailExits = await User.findOne({ email: req.body.email });
  if (emailExits) return res.status(400).send("此信箱已註冊過!");
  // 製作新用戶
  let { username, email, password, role } = req.body;
  let newUser = new User({
    username,
    email,
    password,
    role,
  });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "成功儲存使用者",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者!");
  }
});

router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundUser = await User.findOne({ email: req.body.email });
  if (foundUser)
    return res.status(401).send("無法找到使用者!請確認信箱是否正確。");

  foundUser.comparePassword(req.body.passwrod, (err, isMatch) => {
    if (err) return res.status(500).send(err);
    if (isMatch) {
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        msg: '成功登入!',
        token: 'JWT ' + token,
        user: foundUser,
      })
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

module.exports = router;
