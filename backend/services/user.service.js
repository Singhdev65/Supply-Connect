const mongoose = require("mongoose");
const { userRepository } = require("../repositories");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  avatarUrl: user.avatarUrl || "",
  bio: user.bio || "",
  addresses: (user.addresses || []).map((address) => ({
    id: address._id,
    label: address.label || "",
    recipientName: address.recipientName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2 || "",
    landmark: address.landmark || "",
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    isDefault: Boolean(address.isDefault),
    createdAt: address.createdAt,
    updatedAt: address.updatedAt,
  })),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getUserOrThrow = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw { message: "User not found", statusCode: 404 };
  return user;
};

const ensureDefaultAddress = (user) => {
  if (!user.addresses?.length) return;

  const hasDefault = user.addresses.some((address) => address.isDefault);
  if (hasDefault) return;

  user.addresses[0].isDefault = true;
};

exports.getMyProfile = async (authUser) => {
  const user = await getUserOrThrow(authUser.id);
  ensureDefaultAddress(user);
  if (user.isModified()) await userRepository.save(user);
  return sanitizeUser(user);
};

exports.updateMyProfile = async (authUser, payload) => {
  const user = await getUserOrThrow(authUser.id);

  user.name = payload.name;
  user.phone = payload.phone || "";
  user.avatarUrl = payload.avatarUrl || "";
  user.bio = payload.bio || "";

  const updated = await userRepository.save(user);
  return sanitizeUser(updated);
};

exports.addAddress = async (authUser, payload) => {
  const user = await getUserOrThrow(authUser.id);
  const nextAddress = {
    ...payload,
    label: payload.label || "",
    line2: payload.line2 || "",
    landmark: payload.landmark || "",
  };

  if (!user.addresses.length || payload.isDefault) {
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
    nextAddress.isDefault = true;
  }

  user.addresses.push(nextAddress);
  const updated = await userRepository.save(user);
  return sanitizeUser(updated);
};

exports.updateAddress = async (authUser, addressId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw { message: "Invalid address id", statusCode: 400 };
  }

  const user = await getUserOrThrow(authUser.id);
  const address = user.addresses.id(addressId);
  if (!address) throw { message: "Address not found", statusCode: 404 };

  Object.assign(address, {
    label: payload.label || "",
    recipientName: payload.recipientName,
    phone: payload.phone,
    line1: payload.line1,
    line2: payload.line2 || "",
    landmark: payload.landmark || "",
    city: payload.city,
    state: payload.state,
    postalCode: payload.postalCode,
    country: payload.country,
  });

  if (payload.isDefault) {
    user.addresses.forEach((entry) => {
      entry.isDefault = String(entry._id) === String(address._id);
    });
  }

  ensureDefaultAddress(user);
  const updated = await userRepository.save(user);
  return sanitizeUser(updated);
};

exports.deleteAddress = async (authUser, addressId) => {
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw { message: "Invalid address id", statusCode: 400 };
  }

  const user = await getUserOrThrow(authUser.id);
  const address = user.addresses.id(addressId);
  if (!address) throw { message: "Address not found", statusCode: 404 };

  address.deleteOne();
  ensureDefaultAddress(user);

  const updated = await userRepository.save(user);
  return sanitizeUser(updated);
};

exports.setDefaultAddress = async (authUser, addressId) => {
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw { message: "Invalid address id", statusCode: 400 };
  }

  const user = await getUserOrThrow(authUser.id);
  const target = user.addresses.id(addressId);
  if (!target) throw { message: "Address not found", statusCode: 404 };

  user.addresses.forEach((address) => {
    address.isDefault = String(address._id) === String(addressId);
  });

  const updated = await userRepository.save(user);
  return sanitizeUser(updated);
};
