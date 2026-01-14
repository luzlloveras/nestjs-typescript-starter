import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: Number, required: true })
  price!: number;

  @Prop({ type: String, required: true })
  currency!: string;

  @Prop({ type: [String], required: true })
  categories!: string[];

  @Prop({ type: Object, required: true })
  measurements!: {
    height: number;
    width: number;
    weight: number;
  };
}

export const ProductSchema = SchemaFactory.createForClass(Product);