import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String },
    },
    paymentMethod: { type: String, required: true, default: 'card' },
    totalPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

// Virtual alias used by some frontend code
orderSchema.virtual('totalAmount').get(function () {
  return this.totalPrice;
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
