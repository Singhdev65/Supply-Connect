const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const User = require("./models/User");
const Product = require("./models/Product");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

const usersData = require("./data/users");
const generateProducts = require("./data/products");
const generateChatData = require("./data/chat");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

const seed = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Conversation.deleteMany();
    await Message.deleteMany();
    console.log("🗑 Cleared old data");

    const users = await Promise.all(
      usersData.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        return { ...u, password: hashedPassword };
      }),
    );

    const insertedUsers = await User.insertMany(users);
    console.log("👥 Users inserted");

    const vendorIds = insertedUsers
      .filter((u) => u.role === "vendor")
      .map((u) => u._id);

    const products = generateProducts(vendorIds);
    await Product.insertMany(products);
    console.log(`🛒 Products inserted (${products.length})`);

    const userIds = insertedUsers.map((u) => u._id);

    const { conversations, messages } = generateChatData(userIds, 50, 20);

    await Conversation.insertMany(conversations);
    await Message.insertMany(messages);
    console.log(`💬 Conversations inserted (${conversations.length})`);
    console.log(`✉️ Messages inserted (${messages.length})`);

    console.log("🎉 Seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
