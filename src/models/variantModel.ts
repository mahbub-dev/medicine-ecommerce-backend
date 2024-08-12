import mongoose, { Document, Schema } from 'mongoose';

export interface IVariant extends Document {
  product:mongoose.Schema.Types.ObjectId,
  name: string;
  price: number;
}

const variantSchema: Schema = new Schema(
  {
    product:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Variant = mongoose.model<IVariant>('Variant', variantSchema);
export default Variant;
