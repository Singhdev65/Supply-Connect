const jwt = require("jsonwebtoken");
const { hasRoleAccess } = require("../utils/authorization");

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      if (!hasRoleAccess(decoded.role, roles)) {
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
