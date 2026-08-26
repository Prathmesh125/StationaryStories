import mongoose, { Schema, Document } from "mongoose";

export interface IStock extends Document {
  name: string;
  current: number;
  reorder: number;
  predicted: number;
}

const StockSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  current: { type: Number, required: true, default: 0 },
  reorder: { type: Number, required: true, default: 50 },
  predicted: { type: Number, required: true, default: 0 },
});

export default mongoose.models.Stock || mongoose.model<IStock>("Stock", StockSchema);
