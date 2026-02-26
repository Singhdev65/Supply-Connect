exports.generateUPIQR = ({ amount, orderId }) => {
  const upiId = process.env.UPI_ID;

  const upiLink = `upi://pay?pa=${upiId}&pn=SupplyConnect&am=${amount}&cu=INR&tn=${orderId}`;

  return {
    qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      upiLink,
    )}`,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  };
};
