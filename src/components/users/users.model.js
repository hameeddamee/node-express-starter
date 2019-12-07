const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const config = require("../../config");

// let dbConnection = mongoose.createConnection(`${config.dbURI}BOX_MERCHANTS`);
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      trim: true
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      trim: true
    },
    resetPassword: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    enable: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  },
  { collection: "users" }
);

userSchema.pre("save", async function(next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const hash = await bcrypt.hashSync(this.password);
    this.password = hash;

    return next();
  } catch (e) {
    return next(e);
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
