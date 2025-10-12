import Image from 'next/image';

const socialFeeds = [
  {
    id: 1,
    platform: 'instagram',
    username: '@replax.eco',
    image: '/social/instagram-1.jpg',
    likes: 234,
    caption: 'Start your eco-friendly journey with our bamboo essentials! 🌱 #SustainableLiving'
  },
  {
    id: 2,
    platform: 'instagram',
    username: '@replax.eco',
    image: '/social/instagram-2.jpg',
    likes: 189,
    caption: 'Zero waste kitchen goals achieved with Replax products 🌿 #ZeroWaste'
  },
  {
    id: 3,
    platform: 'instagram',
    username: '@replax.eco',
    image: '/social/instagram-3.jpg',
    likes: 312,
    caption: 'Make the switch to sustainable alternatives today! 🌎 #EcoFriendly'
  }
];

export default function SocialMediaFeed() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-olive text-center mb-4">
          Follow Us on Instagram
        </h2>
        <p className="text-center text-olive/70 mb-12">
          @replax.eco
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialFeeds.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square">
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-olive/70">{post.username}</span>
                  <span className="text-olive/50">•</span>
                  <span className="text-olive/70">{post.likes} likes</span>
                </div>
                <p className="text-olive/80 text-sm">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://instagram.com/replax.eco"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-olive text-cream rounded-full hover:bg-forest-green transition-colors"
          >
            View More on Instagram
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}