const jwt = require("jsonwebtoken");
const { hasRoleAccess } = require("../utils/authorization");
const { User } = require("../models");

const auth = (roles = []) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const authUser = await User.findById(decoded.id).select(
        "_id role isBlocked isSuspended sellerStatus adminSubRole",
      );
      if (!authUser) return res.status(401).json({ message: "Unauthorized" });
      if (authUser.isBlocked) return res.status(403).json({ message: "Account blocked" });
      if (authUser.isSuspended) return res.status(403).json({ message: "Account suspended" });
      if (authUser.role === "vendor" && authUser.sellerStatus !== "approved") {
        return res.status(403).json({ message: "Seller account is not approved" });
      }

      req.user = {
        id: String(authUser._id),
        role: authUser.role,
        adminSubRole: authUser.adminSubRole,
      };

      if (!hasRoleAccess(authUser.role, roles)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error("JWT error:", err);
      return res.status(401).json({ message: "Invalid Token" });
    }
  };
};

module.exports = auth;
