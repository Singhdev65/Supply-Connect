const { ActivityLog } = require("../models");

exports.logActivity = async ({
  actor,
  actorRole,
  module,
  action,
  targetType = "",
  targetId = "",
  metadata = {},
  ip = "",
  userAgent = "",
}) => {
  if (!actor || !module || !action) return null;
  try {
    return await ActivityLog.create({
      actor,
      actorRole,
      module,
      action,
      targetType,
      targetId: targetId ? String(targetId) : "",
      metadata,
      ip,
      userAgent,
    });
  } catch (_err) {
    return null;
  }
};
