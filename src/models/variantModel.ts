import mongoose, { Document, Schema } from 'mongoose';

export interface IVariant extends Document {
  name: string;
  price: number;
}

const variantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Variant = mongoose.model<IVariant>('Variant', variantSchema);
export default Variant;
