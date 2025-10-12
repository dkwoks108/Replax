import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

// Types
interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  brand: {
    _id: string;
    name: string;
  };
  stock: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductsPageProps {
  initialProducts: Product[];
  categories: Category[];
  totalProducts: number;
}

const ProductsPage = ({ initialProducts, categories, totalProducts }: ProductsPageProps) => {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const productsPerPage = 12;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: productsPerPage.toString(),
          ...(selectedCategory && { category: selectedCategory }),
          ...(sortBy && { sort: sortBy }),
          ...(priceRange.min && { minPrice: priceRange.min }),
          ...(priceRange.max && { maxPrice: priceRange.max }),
        });

        const response = await fetch('/api/products?' + queryParams.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedCategory, sortBy, priceRange]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (min: string, max: string) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
  };

  return (
    <>
      <Head>
        <title>Our Products - Replax</title>
        <meta name="description" content="Browse our collection of quality products" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="flex flex-wrap gap-6 mb-8">
          {/* Categories */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedCategory === '' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryChange(category._id)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    selectedCategory === category._id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort and Price Range */}
          <div className="flex-[3]">
            <div className="flex flex-wrap gap-4 mb-4">
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border rounded"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>

              {/* Price Range */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={priceRange.min}
                  onChange={(e) => handlePriceRangeChange(e.target.value, priceRange.max)}
                  className="w-24 px-3 py-2 border rounded"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={priceRange.max}
                  onChange={(e) => handlePriceRangeChange(priceRange.min, e.target.value)}
                  className="w-24 px-3 py-2 border rounded"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                  <Link href={`/products/${product.slug}`} key={product._id} className="group block">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
                      <div className="relative h-48">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.brand.name}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-xl font-bold">₹{product.price}</span>
                          {product.comparePrice && (
                            <span className="text-gray-500 line-through text-sm">
                              ₹{product.comparePrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async ({ query }) => {
  const { page = '1', category, sort, minPrice, maxPrice } = query;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: '12',
    ...(category && { category: String(category) }),
    ...(sort && { sort: String(sort) }),
    ...(minPrice && { minPrice: String(minPrice) }),
    ...(maxPrice && { maxPrice: String(maxPrice) }),
  });

  try {
    // Fetch products
    const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${queryParams}`);
    if (!productsRes.ok) throw new Error('Failed to fetch products');
    const productsData = await productsRes.json();

    // Fetch categories
    const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
    if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
    const categories = await categoriesRes.json();

    return {
      props: {
        initialProducts: productsData.products,
        categories,
        totalProducts: productsData.total,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialProducts: [],
        categories: [],
        totalProducts: 0,
      },
    };
  }
};

export default ProductsPage;