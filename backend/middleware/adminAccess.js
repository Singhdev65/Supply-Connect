const { User } = require("../models");
const { ADMIN_LIKE_ROLES, resolvePermissions } = require("../config/adminPermissions");

const adminAccess = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

      const authUser = await User.findById(req.user.id);
      if (!authUser) return res.status(401).json({ message: "Unauthorized" });

      if (!ADMIN_LIKE_ROLES.includes(authUser.role)) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const granted = resolvePermissions(authUser);
      if (requiredPermissions.length) {
        const hasAll = requiredPermissions.every((permission) =>
          granted.includes(permission),
        );
        if (!hasAll) {
          return res.status(403).json({ message: "Missing required admin permission" });
        }
      }

      req.admin = {
        id: String(authUser._id),
        role: authUser.role,
        subRole: authUser.adminSubRole,
        permissions: granted,
      };

      return next();
    } catch (error) {
      return res.status(500).json({ message: "Failed to validate admin access" });
    }
  };
};

module.exports = adminAccess;
