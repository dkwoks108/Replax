import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Blog({ posts, categories }) {
  return (
    <>
      <Head>
        <title>Eco-Living Blog | Replax</title>
        <meta name="description" content="Tips, guides, and stories about sustainable living and eco-friendly practices." />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-olive mb-8">
              Eco-Living Blog
            </h1>

            <div className="grid gap-8">
              {posts.map(post => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative aspect-video md:aspect-square">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex gap-2 mb-3">
                        {post.categories.map(category => (
                          <Link
                            key={category}
                            href={`/blog/category/${category.toLowerCase()}`}
                            className="text-sm px-3 py-1 bg-cream text-olive rounded-full hover:bg-olive hover:text-cream transition-colors"
                          >
                            {category}
                          </Link>
                        ))}
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-xl font-semibold text-olive hover:text-forest-green mb-3">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="text-olive/70 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={post.author.avatar}
                              alt={post.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm text-olive/80">
                            {post.author.name}
                          </span>
                        </div>
                        <span className="text-sm text-olive/60">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-72 flex-shrink-0">
            {/* Categories */}
            <div className="bg-cream/30 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-olive mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map(category => (
                  <Link
                    key={category.slug}
                    href={`/blog/category/${category.slug}`}
                    className="flex items-center justify-between py-2 text-olive hover:text-forest-green"
                  >
                    <span>{category.name}</span>
                    <span className="text-olive/60">{category.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-cream/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-olive mb-4">
                Popular Posts
              </h2>
              <div className="space-y-4">
                {posts.slice(0, 3).map(post => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="flex gap-4 group"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-olive group-hover:text-forest-green font-medium line-clamp-2">
                        {post.title}
                      </h3>
                      <span className="text-sm text-olive/60">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

export async function getStaticProps() {
  // In a real app, this would fetch from your API
  const posts = [
    {
      id: 1,
      title: '10 Easy Ways to Start Your Zero-Waste Journey',
      slug: '10-easy-ways-to-start-zero-waste-journey',
      excerpt: 'Discover simple steps to reduce your environmental impact and begin your journey towards a zero-waste lifestyle.',
      image: '/blog/zero-waste-journey.jpg',
      date: '2025-10-01',
      categories: ['Tips & Tricks', 'Zero Waste'],
      author: {
        name: 'Priya Sharma',
        avatar: '/team/priya.jpg',
      },
    },
    // Add more posts...
  ];

  const categories = [
    {
      name: 'Tips & Tricks',
      slug: 'tips-tricks',
      count: 12,
    },
    {
      name: 'Zero Waste',
      slug: 'zero-waste',
      count: 8,
    },
    {
      name: 'Sustainable Living',
      slug: 'sustainable-living',
      count: 15,
    },
    {
      name: 'Product Guides',
      slug: 'product-guides',
      count: 6,
    },
  ];

  return {
    props: {
      posts,
      categories,
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
}