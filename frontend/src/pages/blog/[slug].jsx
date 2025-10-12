import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function BlogPost({ post, relatedPosts }) {
  return (
    <>
      <Head>
        <title>{post.title} | Replax Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <article>
          {/* Hero Section */}
          <div className="relative aspect-[21/9] rounded-lg overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Article Header */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex gap-2 mb-4">
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

            <h1 className="text-4xl font-bold text-olive mb-6">{post.title}</h1>

            <div className="flex items-center gap-6 text-olive/70">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="block font-medium text-olive">
                    {post.author.name}
                  </span>
                  <span className="text-sm">
                    {post.author.role || 'Content Writer'}
                  </span>
                </div>
              </div>
              <span className="text-sm">
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="text-sm">{post.readTime} min read</span>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-olive max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share Links */}
            <div className="mt-12 pt-8 border-t border-olive/10">
              <h2 className="text-xl font-semibold text-olive mb-4">
                Share this article
              </h2>
              <div className="flex gap-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    post.title
                  )}&url=${encodeURIComponent(
                    `https://replax.eco/blog/${post.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-olive/70 hover:text-olive"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `https://replax.eco/blog/${post.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-olive/70 hover:text-olive"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${post.title} https://replax.eco/blog/${post.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-olive/70 hover:text-olive"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-cream/30 rounded-lg">
              <div className="flex gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-olive mb-2">
                    {post.author.name}
                  </h3>
                  <p className="text-olive/70 mb-4">{post.author.bio}</p>
                  <div className="flex gap-4">
                    {post.author.social?.twitter && (
                      <a
                        href={post.author.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-olive/70 hover:text-olive"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    )}
                    {post.author.social?.linkedin && (
                      <a
                        href={post.author.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-olive/70 hover:text-olive"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="max-w-5xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-olive mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map(relatedPost => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="group"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                  <Image
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-olive group-hover:text-forest-green mb-2">
                  {relatedPost.title}
                </h3>
                <p className="text-olive/70 line-clamp-2">{relatedPost.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  // In a real app, this would fetch from your API
  const posts = [
    { slug: '10-easy-ways-to-start-zero-waste-journey' },
    // Add more post slugs...
  ];

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  // In a real app, this would fetch from your API
  const post = {
    id: 1,
    title: '10 Easy Ways to Start Your Zero-Waste Journey',
    slug: params.slug,
    excerpt: 'Discover simple steps to reduce your environmental impact and begin your journey towards a zero-waste lifestyle.',
    image: '/blog/zero-waste-journey.jpg',
    date: '2025-10-01',
    readTime: 8,
    categories: ['Tips & Tricks', 'Zero Waste'],
    author: {
      name: 'Priya Sharma',
      role: 'Sustainability Expert',
      avatar: '/team/priya.jpg',
      bio: 'Priya is a zero-waste lifestyle advocate and sustainability consultant with over 5 years of experience helping people transition to eco-friendly living.',
      social: {
        twitter: 'https://twitter.com/priyasharma',
        linkedin: 'https://linkedin.com/in/priyasharma',
      },
    },
    content: `
      <p>Starting a zero-waste journey might seem daunting at first, but with these simple steps, you'll be well on your way to a more sustainable lifestyle...</p>
      <!-- Add more HTML content here -->
    `,
  };

  const relatedPosts = [
    {
      id: 2,
      title: 'The Ultimate Guide to Composting at Home',
      slug: 'ultimate-guide-composting-at-home',
      excerpt: 'Learn everything you need to know about setting up and maintaining a successful composting system in your home.',
      image: '/blog/composting-guide.jpg',
    },
    // Add more related posts...
  ];

  return {
    props: {
      post,
      relatedPosts,
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
}