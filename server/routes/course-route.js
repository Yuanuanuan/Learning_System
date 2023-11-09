const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  next();
});

// 尋找所有課程
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用id尋找特定課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 創建課程
router.post("/", async (req, res) => {
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res.status(400).send("只有講師才能發佈課程!");
  }

  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    await newCourse.save();
    return res.send("新課程創建成功!");
  } catch (e) {
    return res.status(500).send("無法創建課程...");
  }
});

// 更改課程
router.patch("/:_id", async (req, res) => {
  // 先驗證有沒有符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  // 確認課程存在
  try {
    let courseFouned = await Course.findOne({ _id });
    if (courseFouned) return res.status(400).send("查無此課程!");
  } catch (e) {
    return res.status(500).send(e);
  }
  // 使用者必須是此課程講師才能編輯課程
  if (courseFound.instructor.equals(req.user._id)) {
    let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });
    return res.send({
      msg: "課程更新成功!",
      updatedCourse,
    });
  } else {
    return res.status(403).send("只有此課程講師可以更改此課程!");
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;

  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("查無此課程，無法刪除課程!");
    }
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("刪除成功!");
    } else {
      return res.status(403).send("只有此課程的講師才能刪除課程!");
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
