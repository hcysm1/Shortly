import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Url || mongoose.model("Url", UrlSchema);
