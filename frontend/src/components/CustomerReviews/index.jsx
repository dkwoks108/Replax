import Image from 'next/image';

const reviews = [
  {
    id: 1,
    name: 'Priya S.',
    avatar: '/avatars/priya.jpg',
    rating: 5,
    text: 'Love the bamboo cutlery set! Completely replaced plastic in my kitchen.',
    product: 'Bamboo Cutlery Set'
  },
  {
    id: 2,
    name: 'Rahul M.',
    avatar: '/avatars/rahul.jpg',
    rating: 5,
    text: 'The compostable plates are sturdy and perfect for parties. Great eco-friendly alternative!',
    product: 'Compostable Plates'
  },
  {
    id: 3,
    name: 'Anita K.',
    avatar: '/avatars/anita.jpg',
    rating: 4,
    text: 'Bamboo toothbrush is excellent. Been using for months and still in great condition.',
    product: 'Bamboo Toothbrush'
  }
];

export default function CustomerReviews() {
  return (
    <section className="py-16 bg-cream/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-olive text-center mb-12">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-cream p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-forest-green">{review.name}</h3>
                  <p className="text-sm text-olive/70">{review.product}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-olive/80">{review.text}</p>
            </div>
          ))}
        </div>
        </div>
      </section>
    );
  }