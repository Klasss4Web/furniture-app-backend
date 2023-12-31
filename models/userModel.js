const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      default: "12345",
    },
    imageUrl: {
      type: String,
      required: false,
      default:
        "https://media.istockphoto.com/photos/girl-with-headphones-and-neon-lighting-stylized-3d-character-picture-id1330874201?b=1&k=20&m=1330874201&s=170667a&w=0&h=GL7X6kheNB4ip-Mw8B0aI3KbUfWCzRthJqCNv5qq2jg=",
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
    birthDay: {
      type: String,
      required: true,
      unique: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    userType: {
      type: String,
      required: false,
      default: "user",
    },
    status: {
      type: String,
      required: false,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);


//LOGIN
userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password)
}

// REGISTER
userSchema.pre("save", async function(next) {
  if(!this.isModified("password")){
    next()
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model("User", userSchema);

