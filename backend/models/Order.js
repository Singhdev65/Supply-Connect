const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending Payment",
        "Paid",
        "Accepted by Vendor",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Completed",
        "Cancelled",
        "Returned",
        "Refunded",
      ],
      default: "Pending Payment",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
