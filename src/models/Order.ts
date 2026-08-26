import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  customer: string;
  item: string;
  status: "Pending" | "Ordered" | "Ready";
}

const OrderSchema: Schema = new Schema({
  customer: { type: String, required: true },
  item: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Ordered", "Ready"], 
    default: "Pending" 
  },
});

export default (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>("Order", OrderSchema);
