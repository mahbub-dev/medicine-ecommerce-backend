import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  photos: string[];
  description: string;
  metaKey: string;
  price: number;
  discount?: number;
  stockStatus: boolean;
  status: 'active' | 'inactive';
  categories: mongoose.Types.ObjectId[];
  variants: mongoose.Types.ObjectId[];
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    photos: [{ type: String, required: true }],
    description: { type: String, required: true },
    metaKey: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: false },
    stockStatus: { type: Boolean, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variant', required: false }],
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
