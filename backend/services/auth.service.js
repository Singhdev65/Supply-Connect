const jwt = require("jsonwebtoken");
const { userRepository } = require("../repositories");

exports.signup = async ({ name, email, password, role }) => {
  if (!name || !email || !password || !role)
    throw { message: "All fields are required", statusCode: 400 };

  const existing = await userRepository.findByEmail(email);
  if (existing) throw { message: "Email already registered", statusCode: 400 };

  const user = await userRepository.create({ name, email, password, role });

  return buildAuthResponse(user);
};

exports.login = async ({ email, password }) => {
  if (!email || !password)
    throw { message: "Email and password are required", statusCode: 400 };

  const user = await userRepository.findByEmail(email);
  if (!user) throw { message: "Invalid email or password", statusCode: 400 };

  const match = await user.comparePassword(password);
  if (!match) throw { message: "Invalid email or password", statusCode: 400 };

  return buildAuthResponse(user);
};

function buildAuthResponse(user) {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
