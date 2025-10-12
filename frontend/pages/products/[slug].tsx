import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Types
interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  brand: {
    _id: string;
    name: string;
  };
  stock: number;
  specifications: Record<string, string>;
  tags: string[];
}

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWhatsAppInquiry = () => {
    try {
      setLoading(true);
      setError(null);
      const message = encodeURIComponent(
        `Hi, I'm interested in ${product.name} (₹${product.price}). Can you provide more information?`
      );
      const whatsappURL = `https://wa.me/919571252965?text=${message}`;
      window.open(whatsappURL, '_blank');
    } catch (err) {
      setError('Failed to open WhatsApp. Please try again.');
      console.error('WhatsApp error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{product.name} - Replax</title>
        <meta name="description" content={product.description.slice(0, 160)} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <Image 
                    src={image} 
                    alt={product.name} 
                    fill
                    sizes="(max-width: 768px) 25vw, 10vw"
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold">₹{product.price}</span>
              {product.comparePrice && (
                <span className="text-gray-500 line-through">₹{product.comparePrice}</span>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-gray-600">{product.description}</p>
              
              <div>
                <span className="font-semibold">Brand:</span> {product.brand.name}
              </div>
              
              <div>
                <span className="font-semibold">Category:</span> {product.category.name}
              </div>
              
              <div>
                <span className="font-semibold">Availability:</span>{' '}
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="flex items-center gap-4 mb-8">
              <label htmlFor="quantity" className="font-semibold">
                Quantity:
              </label>
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border-r hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value))))}
                  className="w-16 text-center py-1"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1 border-l hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* WhatsApp Inquiry Button */}
            <button
              onClick={handleWhatsAppInquiry}
              disabled={loading}
              className={`w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/>
              </svg>
              Inquire on WhatsApp
            </button>

            {/* Specifications */}
            {Object.keys(product.specifications).length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Specifications</h2>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex border-b pb-2">
                      <span className="font-semibold w-1/3">{key}:</span>
                      <span className="w-2/3">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ProductDetailProps> = async ({ params }) => {
  try {
    const slug = params?.slug;
    if (!slug) {
      return {
        notFound: true,
      };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`);
    
    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    const product = await res.json();

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      notFound: true,
    };
  }
};

export default ProductDetail;