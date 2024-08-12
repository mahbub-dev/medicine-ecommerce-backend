import mongoose, { Document, Schema } from 'mongoose';

// Define the ICategory interface
export interface ICategory extends Document {
  name: string;
  slug: string;
  thumbnail: string;
  parentCategory?: mongoose.Types.ObjectId; // Reference to parent category
  level: 'primary' | 'secondary' | 'tertiary'; // Category level (Primary, Secondary, Tertiary)
}

// Define the category schema
const categorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    thumbnail: { type: String, required: false },
    
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
    level: { 
      type: String, 
      enum: ['primary', 'secondary', 'tertiary'], 
      required: true 
    },
  },
  { timestamps: true }
);

// Create the Category model
const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category;
