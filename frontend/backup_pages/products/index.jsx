import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Products({ products, categories }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const generateWhatsAppLink = (product) => {
    const message = `Hi, I'm interested in buying ${product.name} from Replax.`;
    return `https://wa.me/919571252965?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      <Head>
        <title>Shop Eco-Friendly Products | Replax</title>
        <meta name="description" content="Browse our collection of sustainable and eco-friendly products for a greener lifestyle." />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-cream/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-olive mb-4">Categories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded ${
                    selectedCategory === 'all'
                      ? 'bg-olive text-cream'
                      : 'text-olive hover:bg-cream/50'
                  }`}
                >
                  All Products
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`w-full text-left px-3 py-2 rounded ${
                      selectedCategory === category.slug
                        ? 'bg-olive text-cream'
                        : 'text-olive hover:bg-cream/50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-olive">
                {selectedCategory === 'all'
                  ? 'All Products'
                  : categories.find(c => c.slug === selectedCategory)?.name || 'Products'}
              </h1>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-olive/20 rounded bg-cream text-olive"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h2 className="text-lg font-semibold text-olive hover:text-forest-green mb-2">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="text-olive/70 mb-2">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-forest-green">
                        ₹{product.price}
                      </span>
                      <a
                        href={generateWhatsAppLink(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export async function getStaticProps() {
  // In a real app, this would fetch from your API
  const products = [
    {
      id: 1,
      name: 'Bamboo Cutlery Set',
      price: 599,
      image: '/products/bamboo-cutlery.jpg',
      category: 'Kitchen',
    },
    // Add more products...
  ];

  const categories = [
    {
      id: 1,
      name: 'Kitchen',
      slug: 'kitchen',
      image: '/categories/kitchen.jpg',
    },
    // Add more categories...
  ];

  return {
    props: {
      products,
      categories,
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
}