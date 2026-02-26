const normalizeRolesInput = (rolesInput) => {
  if (!rolesInput) return [];
  if (Array.isArray(rolesInput)) return rolesInput;
  if (typeof rolesInput === "string") return [rolesInput];
  if (Array.isArray(rolesInput.anyOf)) return rolesInput.anyOf;
  return [];
};

const hasRoleAccess = (userRole, rolesInput) => {
  const roles = normalizeRolesInput(rolesInput);
  if (!roles.length) return true;
  return roles.includes(userRole);
};

module.exports = {
  hasRoleAccess,
  normalizeRolesInput,
};
