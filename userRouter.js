const router = require("express").Router();
const User = require("./userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Salary = require("./salary");
const Expanse = require("./expanse");

router.post("/add-expanse", async (req, res) => {
  try {
    if (!req.body.user_id) {
      res.status(400).json("user_id is requird.!");
    }
    if (req.body._id) {
      await Expanse.findOneAndUpdate(
        { "_id": req.body._id }, // Filter
        {
          food: req.body.food,
          loan: req.body.loan,
          fuel_office: req.body.fuel_office,
          fuel_personal: req.body.fuel_personal,
        }, // Update
      )
    } else {
      const expanse = await new Expanse({
        user_id: req.body.user_id,
        food: req.body.food,
        loan: req.body.loan,
        fuel_office: req.body.fuel_office,
        fuel_personal: req.body.fuel_personal,
      });
      var data = await expanse.save();
    }
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.post("/get-expanse", async (req, res) => {
  try {
    const data = await Expanse.findOne({ user_id: req.body.user_id })
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.post("/add-salary", async (req, res) => {
  try {
    if (!req.body.user_id) {
      res.status(400).json("user_id is requird.!");
    }
    if (req.body._id) {
      await Salary.findOneAndUpdate(
        { "_id": req.body._id }, // Filter
        { salary: req.body.salary }, // Update
      )
    } else {
      const salary = await new Salary({
        user_id: req.body.user_id,
        salary: req.body.salary,
      });
      var data = await salary.save();
    }
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.post("/get-salary", async (req, res) => {
  try {
    const data = await Salary.findOne({ user_id: req.body.user_id })
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  try {

    var emailExist = await User.findOne({ email: req.body.email });

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
    console.log(data)
    var userToken = jwt.sign({ email: data.email, user_id: data?._id, name: data?.name }, "secret");
    res.status(200).json({ userToken });

  } catch (err) {
    res.status(400).json(err);
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
    var userToken = jwt.sign({ email: userExist.email, user_id: userExist?.id, name: userExist?.name }, "secret");
    res.status(200).json({ userToken });
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
