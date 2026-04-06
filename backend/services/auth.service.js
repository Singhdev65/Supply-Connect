const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { userRepository } = require("../repositories");
const { USER_ROLES } = require("../config/roles");

exports.signup = async ({ name, email, password, role }) => {
  if (!name || !email || !password || !role)
    throw { message: "All fields are required", statusCode: 400 };

  const existing = await userRepository.findByEmail(email);
  if (existing) throw { message: "Email already registered", statusCode: 400 };

  const user = await userRepository.create({
    name,
    email,
    password,
    role,
    ...(role === USER_ROLES.VENDOR ? { sellerStatus: "pending", verificationStatus: "pending" } : {}),
  });

  return buildAuthResponse(user);
};

exports.login = async ({ email, password }) => {
  if (!email || !password)
    throw { message: "Email and password are required", statusCode: 400 };

  const user = await userRepository.findByEmail(email);
  if (!user) throw { message: "Invalid email or password", statusCode: 400 };
  if (user.isBlocked) throw { message: "Account blocked", statusCode: 403 };
  if (user.isSuspended) throw { message: "Account suspended", statusCode: 403 };
  if (user.role === USER_ROLES.VENDOR && user.sellerStatus !== "approved") {
    throw { message: "Seller account approval pending", statusCode: 403 };
  }

  const match = await user.comparePassword(password);
  if (!match) throw { message: "Invalid email or password", statusCode: 400 };

  user.lastLoginAt = new Date();
  user.loginCount = Number(user.loginCount || 0) + 1;
  await userRepository.save(user);

  return buildAuthResponse(user);
};

exports.forgotPassword = async ({ email }) => {
  if (!email) throw { message: "Email is required", statusCode: 400 };

  const user = await userRepository.findByEmail(email);
  if (!user) return { sent: true };

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpiresAt = expiresAt;
  await userRepository.save(user);

  // Replace this with email delivery integration in production deployment.
  return {
    sent: true,
    resetTokenPreview: process.env.NODE_ENV === "production" ? undefined : token,
    expiresAt,
  };
};

exports.resetPassword = async ({ token, password }) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await userRepository.findByResetTokenHash(tokenHash);
  if (!user) throw { message: "Invalid or expired reset token", statusCode: 400 };

  user.password = password;
  user.resetPasswordTokenHash = "";
  user.resetPasswordExpiresAt = null;

  await userRepository.save(user);
  return buildAuthResponse(user);
};

exports.socialLogin = async ({ provider, providerUserId, email, name, role, avatarUrl }) => {
  let user = await userRepository.findBySocialProvider({ provider, providerUserId });

  if (!user) {
    user = await userRepository.findByEmail(email);

    if (!user) {
      user = await userRepository.create({
        name,
        email,
        role,
        password: crypto.randomBytes(24).toString("hex"),
        avatarUrl: avatarUrl || "",
        socialProviders: [{ provider, providerUserId, email }],
      });
    } else {
      const exists = (user.socialProviders || []).some(
        (entry) =>
          entry.provider === provider && entry.providerUserId === providerUserId,
      );
      if (!exists) {
        user.socialProviders.push({ provider, providerUserId, email });
        if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
        await userRepository.save(user);
      }
    }
  }

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
      phone: user.phone || "",
      avatarUrl: user.avatarUrl || "",
      bio: user.bio || "",
      addresses: user.addresses || [],
      sellerStatus: user.sellerStatus || "",
      verificationStatus: user.verificationStatus || "",
      adminSubRole: user.adminSubRole || "none",
    },
  };
}
