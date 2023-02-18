const router = require("express").Router();
const User = require("./userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("JsonWebToken");

router.post("/register", async (req, res) => {
  try {
    var emailExist = await User.findOne({ email: req.body.email });
    console.log('emailExist',emailExist);
    if (emailExist) {
      res.status(400).json("Email already exist");
    }

    //password hash
    var hash = await bcrypt.hash(req.body.password, 10);

    const user = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });

    var data = await user.save();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});
router.post("/login", async (req, res) => {
  try {
    var userExist = await User.findOne({ email: req.body.email });
    console.log(userExist);
    if (!userExist) {
      res.status(400).json("Email not exist");
    }

    var valiPas = await bcrypt.compare(req.body.password, userExist.password);

    if (!valiPas) {
      res.status(400).json("password not valid");
    }
    var userToken = await jwt.sign({ email: userExist.email }, "secret");
      res.status(200).json(userToken);
    //   res.header("auth", userToken).json(userToken);
  } catch (err) {
    res.status(400).json(err);
  }
});

const validUser = (req, res, next) => {
  var token = req.header("auth");
  req.token = token;
  next();
};

router.get("/getALL", validUser, async (req, res) => {
  jwt.verify(req.token, "secret", async (err, data) => {
    if (err) {
      res.status(403).send("Forbidden");
    } else {
      const data = await User.find().select(["-password"]);
      res.json(data);
    }
  });
});

module.exports = router;
