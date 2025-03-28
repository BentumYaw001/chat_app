import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    isGroup: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groupName: {
      type: String,
      required: function () {
        return this.isGroup;
      },
    },
    groupPicture: {
      type: String,
      default: "https://example.com/default-group.png",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
