import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCarousel from '../../components/ProductCarousel';

export default function ProductDetails({ product, relatedProducts }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const generateWhatsAppLink = () => {
    const message = `Hi, I'm interested in buying ${product.name} from Replax.`;
    return `https://wa.me/919571252965?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      <Head>
        <title>{product.name} | Replax</title>
        <meta name="description" content={product.description} />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index
                      ? 'ring-2 ring-offset-2 ring-forest-green'
                      : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-olive mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-forest-green">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-olive/60 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {product.discount && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <div className="prose prose-olive mb-8">
              <p className="text-olive/80 text-lg mb-6">{product.description}</p>
              
              <h2 className="text-xl font-semibold text-olive mb-4">Key Features</h2>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-olive/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {product.specifications && (
                <>
                  <h2 className="text-xl font-semibold text-olive mb-4 mt-8">
                    Specifications
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-2 py-2 border-b border-olive/10"
                      >
                        <span className="text-olive/70">{key}</span>
                        <span className="text-olive">{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Buy on WhatsApp
            </a>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <ProductCarousel
            title="You May Also Like"
            products={relatedProducts}
            whatsappNumber="919571252965"
          />
        </section>
      </main>

      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  // In a real app, this would fetch from your API
  const products = [
    { id: 1 },
    { id: 2 },
    // Add more product IDs...
  ];

  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  // In a real app, this would fetch from your API
  const product = {
    id: parseInt(params.id),
    name: 'Bamboo Cutlery Set',
    price: 599,
    originalPrice: 799,
    discount: 25,
    description: 'Replace plastic cutlery with this elegant and durable bamboo set. Perfect for everyday use and travel.',
    images: [
      '/products/bamboo-cutlery-1.jpg',
      '/products/bamboo-cutlery-2.jpg',
      '/products/bamboo-cutlery-3.jpg',
      '/products/bamboo-cutlery-4.jpg',
    ],
    features: [
      'Made from 100% organic bamboo',
      'Naturally antibacterial',
      'Biodegradable and eco-friendly',
      'Includes fork, spoon, knife, and chopsticks',
      'Comes with a cotton carrying pouch',
    ],
    specifications: {
      'Material': 'Organic Bamboo',
      'Set Includes': 'Fork, Spoon, Knife, Chopsticks',
      'Dimensions': '20cm x 4cm x 1.5cm',
      'Weight': '120g',
      'Care Instructions': 'Hand wash recommended',
    },
    category: 'Kitchen',
  };

  const relatedProducts = [
    // Add related products...
  ];

  return {
    props: {
      product,
      relatedProducts,
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
}