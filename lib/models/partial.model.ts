import mongoose from "mongoose";

const partialSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,//one partial can have multiple children partials as children, more like comments under comments
      ref: "Partial",
    },
  ],
});

const Partial = mongoose.models.Partial || mongoose.model("Partial", partialSchema);

export default Partial;
