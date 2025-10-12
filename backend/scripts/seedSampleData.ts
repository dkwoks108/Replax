/**
 * Seed script to insert/update sample categories, products, blogs, and update WhatsApp BuyButton.
 * Run with: npx ts-node ./scripts/seedSampleData.ts
 *
 * Make sure to set MONGODB_URI in environment or in ../.env before running.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from '../src/models/Category';
import Product from '../src/models/Product';
import BlogCategory from '../src/models/BlogCategory';
import Blog from '../src/models/Blog';
import BuyButton from '../src/models/BuyButton';

dotenv.config({ path: __dirname + '/../../backend/.env' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/replax';

async function upsertCategory(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let cat = await Category.findOne({ slug });
  if (!cat) cat = await Category.create({ name, slug });
  else cat.name = name, await cat.save();
  return cat;
}

async function upsertBlogCategory(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let cat = await BlogCategory.findOne({ slug });
  if (!cat) cat = await BlogCategory.create({ name, slug });
  else cat.name = name, await cat.save();
  return cat;
}

async function upsertProduct(item: any, categoryId: any) {
  let product = await Product.findOne({ name: item.name });
  if (!product) {
    product = await Product.create({ ...item, category: categoryId });
  } else {
    product.description = item.description;
    product.price = item.price;
    product.images = item.images || product.images;
    product.category = categoryId;
    await product.save();
  }
  return product;
}

async function upsertBlog(item: any, categoryId: any) {
  const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let blog = await Blog.findOne({ slug });
  if (!blog) {
    blog = await Blog.create({ title: item.title, slug, content: item.content, image: item.image, category: categoryId });
  } else {
    blog.title = item.title;
    blog.content = item.content;
    blog.image = item.image;
    blog.category = categoryId;
    await blog.save();
  }
  return blog;
}

async function setWhatsAppNumber(number: string) {
  // Deactivate others
  await BuyButton.updateMany({}, { isActive: false });
  const existing = await BuyButton.findOne({ phoneNumber: number });
  if (existing) {
    existing.isActive = true; await existing.save();
    return existing;
  }
  const b = await BuyButton.create({ phoneNumber: number, isActive: true });
  return b;
}

async function main() {
  await mongoose.connect(MONGO_URI).catch((e) => {
    console.warn('Could not connect to MongoDB for seeding:', e.message || e);
  });

  // Sample categories and products (shortened example)
  const catNames = ['Bamboo', 'Compostable', 'Personal Care'];
  const cats: any = {};
  for (const name of catNames) {
    const c = await upsertCategory(name);
    cats[name] = c;
  }

  // Sample products
  const products = [
    {
      name: 'Bamboo Toothbrush (Pack of 2)',
      description: 'Sustainably sourced bamboo handle with soft nylon-free bristles. Compostable handle.',
      price: 199,
      images: ['https://via.placeholder.com/600x400?text=Bamboo+Toothbrush']
    },
    {
      name: 'Sugarcane Bagasse Plate (10-inch, set of 25)',
      description: 'Durable compostable plates made from sugarcane bagasse. Microwave safe.',
      price: 499,
      images: ['https://via.placeholder.com/600x400?text=Bagasse+Plates']
    }
  ];

  for (const p of products) {
    const cat = p.name.toLowerCase().includes('bamboo') ? cats['Bamboo'] : cats['Compostable'];
    await upsertProduct(p, cat._id);
  }

  // Blog categories and blogs
  const blogCat = await upsertBlogCategory('Sustainability Tips');
  await upsertBlog({ title: 'How to go plastic-free in the kitchen', content: 'Tips to replace single-use plastics with compostable alternatives.', image: 'https://via.placeholder.com/800x400?text=Kitchen+Tips' }, blogCat._id);

  // Update WhatsApp Buy Button number to the requested number
  await setWhatsAppNumber('+919571252965');

  console.log('Seeding complete.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
