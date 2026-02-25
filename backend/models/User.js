const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["vendor", "buyer"], required: true },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  console.log("Saving user:", this.email);
  if (!this.isModified("password")) return;
  try {
    this.password = await bcrypt.hash(this.password, 10);
    console.log("Password hashed successfully");
  } catch (err) {
    console.error("Hashing error:", err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
