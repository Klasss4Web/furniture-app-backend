const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");

//LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  try {
    if (user && (await user.matchPassword(password))) {
      if (user?.status.toLowerCase() === "active") {
        res.status(200).json({
          message: "Login successful",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            userType: user.userType,
            createdAt: user.createdAt,
            token: generateToken(user._id),
          },
        });
      } else {
        res.status(401);
        throw new Error(`Your account is ${user?.status}, contact admin`);
      }
    } else {
      res.status(401);
      throw new Error("Invalid login credentials");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

//REGISTER
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  try {
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      res.status(201).json({
        message: "User created successfully",
        data: {
          _id: user?._id,
          name: user?.name,
          email: user?.email,
          imageUrl: user?.imageUrl,
          isAdmin: user?.isAdmin,
          userType: user?.userType,
          createdAt: user?.createdAt,
          token: generateToken(user?._id),
        },
      });
    } else {
      res.status(400);
      throw new Error("Invalid user details");
    }
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
});

//ADMIN CREATE USERS
const createUserByAdmin = async (req, res) => {
  const { name, email, password, userType, imageUrl } = req.body;
  const userExists = await User.findOne({ email });

  const isAdmin = userType === "admin" ? true : false;

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    imageUrl,
    isAdmin,
    password,
    userType,
  });

  if (user) {
    res.status(201).json({
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      image: user?.image,
      isAdmin: user?.isAdmin,
      userType: user?.userType,
      createdAt: user?.createdAt,
      token: generateToken(user?._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

//PROFILE
const getUserProfile = async (req, res) => {
  // res.send("User Profile")
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user?.imageUrl,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

//UPDATE PROFILE
const updateUser = async (req, res) => {
  try {
    // res.send("User Profile")
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req?.body?.name || user?.name;
      user.email = req?.body?.email || user?.email;
      user.imageUrl = req?.body?.imageUrl || user?.imageUrl;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updateUser = await user.save();
      res.json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
        createdAt: updateUser.createdAt,
        token: generateToken(updateUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

//UPDATE ADMIN PROFILE
const updateAminProfile = async (req, res) => {
  // res.send("User Profile")
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req?.body?.name || user?.name;
    user.email = req?.body?.email || user?.email;
    user.image = req?.body?.image || user?.image;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updateUser = await user.save();
    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      createdAt: updateUser.createdAt,
      token: generateToken(updateUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

//UPDATE USER STATUS: BAN AND UNBAN
const updateUserStatus = async (req, res) => {
  const { status } = req.body;
  const user = await User.findById(req.params.id);

  if (user) {
    user.status = status;

    const updateUserStatus = await user.save();
    res.json({
      _id: updateUserStatus._id,
      name: updateUserStatus.name,
      email: updateUserStatus.email,
      status: updateUserStatus.status,
      isAdmin: updateUserStatus.isAdmin,
      createdAt: updateUserStatus.createdAt,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

//DELETE USER: ADMIN ONLY ACCESS
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
};

//GET ALL USER: ADMIN ONLY ACCESS

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};
module.exports = { login, register, getUserProfile, updateUser };
