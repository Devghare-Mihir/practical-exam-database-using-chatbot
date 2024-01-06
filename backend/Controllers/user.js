require('dotenv').config()
const User = require("../Models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users, success: true });
  } catch (error) {
    res.status(500).json({ error: error, message: 'Internal Server Error' });
    console.log(error);
  }
}

const registerUsers = async (req, res) => {
  const { fname, lname, enrollment, role, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fname, lname, enrollment, role, email, password: hashedPassword });

    await user.save();


    return res.status(200).json({ user, success: true, message: 'User created successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err, success: false, message: 'User failed to create!' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(500).json({ success: false, message: "Please Enter Correct Credentials" });
    }
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) {
      return res.status(500).json({ success: false, message: "Please Enter Correct Credentials" });
    }
    else {
      const data = {
        user: {
          email: user.email,
          role: user.role
        }
      }
      const token = jwt.sign(data, process.env.SECRET, { expiresIn: '5m' });
      return res.status(200).json({ success: true, token, message: "Login successful!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error, success: false, message: 'User failed to login!' });
  }
}


module.exports = { getUsers, registerUsers, loginUser }