import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/Header';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission to API
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard | Replax</title>
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-olive">Admin Dashboard</h1>
          <button
            onClick={() => {
              if (activeTab === 'products') {
                setIsAddingProduct(true);
              } else {
                setIsAddingBlog(true);
              }
            }}
            className="px-4 py-2 bg-forest-green text-cream rounded hover:bg-olive transition-colors"
          >
            Add New {activeTab === 'products' ? 'Product' : 'Blog Post'}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-olive/20 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-4 px-2 font-medium ${
                activeTab === 'products'
                  ? 'border-b-2 border-forest-green text-forest-green'
                  : 'text-olive/70'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`pb-4 px-2 font-medium ${
                activeTab === 'blogs'
                  ? 'border-b-2 border-forest-green text-forest-green'
                  : 'text-olive/70'
              }`}
            >
              Blog Posts
            </button>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="grid gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-olive mb-2">
                      {product.name}
                    </h3>
                    <p className="text-olive/70 mb-4">{product.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-forest-green font-medium">
                        ₹{product.price}
                      </span>
                      <span className="text-olive/60">
                        Category: {product.category}
                      </span>
                      <span className="text-olive/60">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {/* Handle edit */}}
                      className="p-2 text-olive/70 hover:text-olive"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {/* Handle delete */}}
                      className="p-2 text-red-600/70 hover:text-red-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="grid gap-6">
            {blogs.map(blog => (
              <div
                key={blog.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-olive mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-olive/70 mb-4">{blog.excerpt}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-olive/60">
                        {new Date(blog.date).toLocaleDateString()}
                      </span>
                      <span className="text-olive/60">
                        Author: {blog.author.name}
                      </span>
                      <div className="flex gap-2">
                        {blog.categories.map(category => (
                          <span
                            key={category}
                            className="px-2 py-1 bg-cream text-olive text-sm rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {/* Handle edit */}}
                      className="p-2 text-olive/70 hover:text-olive"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {/* Handle delete */}}
                      className="p-2 text-red-600/70 hover:text-red-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {isAddingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <h2 className="text-xl font-bold text-olive mb-6">
                Add New Product
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-olive/70 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-olive/20 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-olive/70 mb-1">Price</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-olive/20 rounded"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-olive/70 mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-olive/20 rounded"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-olive/70 mb-1">Category</label>
                    <select className="w-full px-4 py-2 border border-olive/20 rounded">
                      <option value="kitchen">Kitchen</option>
                      <option value="bathroom">Bathroom</option>
                      <option value="home">Home & Living</option>
                      <option value="personal-care">Personal Care</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-olive/70 mb-1">Stock</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-olive/20 rounded"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-olive/70 mb-1">Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="w-full"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="px-4 py-2 text-olive/70 hover:text-olive"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-forest-green text-cream rounded hover:bg-olive transition-colors"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Blog Modal */}
        {isAddingBlog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <h2 className="text-xl font-bold text-olive mb-6">
                Add New Blog Post
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-olive/70 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-olive/20 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-olive/70 mb-1">Excerpt</label>
                  <textarea
                    className="w-full px-4 py-2 border border-olive/20 rounded"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-olive/70 mb-1">Content</label>
                  <textarea
                    className="w-full px-4 py-2 border border-olive/20 rounded"
                    rows={8}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-olive/70 mb-1">Categories</label>
                    <select
                      multiple
                      className="w-full px-4 py-2 border border-olive/20 rounded"
                      size={4}
                    >
                      <option value="tips-tricks">Tips & Tricks</option>
                      <option value="zero-waste">Zero Waste</option>
                      <option value="sustainable-living">
                        Sustainable Living
                      </option>
                      <option value="product-guides">Product Guides</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-olive/70 mb-1">Author</label>
                    <select className="w-full px-4 py-2 border border-olive/20 rounded">
                      <option value="1">Priya Sharma</option>
                      <option value="2">Rahul Mehta</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-olive/70 mb-1">
                    Featured Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingBlog(false)}
                    className="px-4 py-2 text-olive/70 hover:text-olive"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-forest-green text-cream rounded hover:bg-olive transition-colors"
                  >
                    Save Blog Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}