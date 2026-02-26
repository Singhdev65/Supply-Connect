const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Review = require("./models/Review");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

const usersData = require("./data/users");
const { buildProducts, buildMockCommerceData } = require("./data/mockCommerce");
const generateChatData = require("./data/chat");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const seed = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Conversation.deleteMany();
    await Message.deleteMany();
    console.log("Cleared old data");

    const users = await Promise.all(
      usersData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      }),
    );

    const insertedUsers = await User.insertMany(users);
    console.log(`Users inserted (${insertedUsers.length})`);

    const vendorIds = insertedUsers
      .filter((user) => user.role === "vendor")
      .map((user) => user._id);

    const products = buildProducts(vendorIds, 12);
    const insertedProducts = await Product.insertMany(products);
    console.log(`Products inserted (${insertedProducts.length})`);

    const { orders, reviews } = buildMockCommerceData({
      users: insertedUsers,
      products: insertedProducts,
    });

    const insertedOrders = await Order.insertMany(orders);
    console.log(`Orders inserted (${insertedOrders.length})`);

    const insertedReviews = await Review.insertMany(reviews, { ordered: false });
    console.log(`Reviews inserted (${insertedReviews.length})`);

    const ratingStats = await Review.aggregate([
      {
        $group: {
          _id: "$product",
          ratingAverage: { $avg: "$rating" },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    await Promise.all(
      ratingStats.map((row) =>
        Product.updateOne(
          { _id: row._id },
          {
            $set: {
              ratingAverage: Number((row.ratingAverage || 0).toFixed(2)),
              ratingCount: row.ratingCount || 0,
            },
          },
        ),
      ),
    );
    console.log("Product rating aggregates updated");

    const userIds = insertedUsers.map((user) => user._id);
    const { conversations, messages } = generateChatData(userIds, 50, 20);

    await Conversation.insertMany(conversations);
    await Message.insertMany(messages);
    console.log(`Conversations inserted (${conversations.length})`);
    console.log(`Messages inserted (${messages.length})`);

    console.log("Seeding completed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
