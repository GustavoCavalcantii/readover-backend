import mongoose, { Schema } from "mongoose";
import { INotification } from "../interfaces/INotification";

const notificationSchema = new Schema<INotification>({
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
