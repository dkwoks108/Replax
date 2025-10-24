import Head from 'next/head';
import Header from '../components/Header';
import AnnouncementBoard from '../components/AnnouncementBoard';
import PosterSlider from '../components/PosterSlider';
import CategoryScroller from '../components/CategoryScroller';
import FeaturesSection from '../components/FeaturesSection';
import ProductCarousel from '../components/ProductCarousel';
import CustomerReviews from '../components/CustomerReviews';
import SocialMediaFeed from '../components/SocialMediaFeed';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';

export default function Home({ featuredProducts, categories }) {
  return (
    <>
      <Head>
        <title>Replax - Eco-Friendly Products for Sustainable Living</title>
        <meta name="description" content="Discover sustainable alternatives for everyday products. Shop our collection of eco-friendly and plastic-free essentials for a greener lifestyle." />
      </Head>

      <Header />
      
      <main>
        <AnnouncementBoard />
        <PosterSlider />
        <CategoryScroller categories={categories} />
        <FeaturesSection />
        <ProductCarousel 
          title="Bestsellers"
          products={featuredProducts}
          whatsappNumber="919571252965"
        />
        <AboutSection />
        <CustomerReviews />
        <SocialMediaFeed />
      </main>

      <Footer />
    </>
  );
}

export async function getStaticProps() {
  // In a real app, this would fetch from your API
  const featuredProducts = [
    {
      id: 1,
      name: 'Bamboo Cutlery Set',
      price: 599,
      image: '/products/bamboo-cutlery.jpg',
      category: 'Kitchen',
    },
    {
      id: 2,
      name: 'Compostable Plates (Pack of 20)',
      price: 399,
      image: '/products/compostable-plates.jpg',
      category: 'Kitchen',
    },
    // Add more products...
  ];

  const categories = [
    {
      id: 1,
      name: 'Kitchen',
      image: '/categories/kitchen.jpg',
      slug: 'kitchen',
    },
    {
      id: 2,
      name: 'Bathroom',
      image: '/categories/bathroom.jpg',
      slug: 'bathroom',
    },
    // Add more categories...
  ];

  return {
    props: {
      featuredProducts,
      categories,
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
}