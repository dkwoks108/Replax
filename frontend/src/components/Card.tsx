import Image from 'next/image';
import Link from 'next/link';
import { WhatsappIcon } from './Icons';

interface CardProps {
  title: string;
  description: string;
  image: string;
  price: number;
  comparePrice?: number;
  slug: string;
  whatsappNumber?: string;
}

const Card = ({
  title,
  description,
  image,
  price,
  comparePrice,
  slug,
  whatsappNumber = '+91 9571252965'
}: CardProps) => {
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const handleWhatsAppClick = () => {
    const message = `Hi, I'm interested in ${title}. Can you provide more information?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
      <Link href={`/products/${slug}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              {discount}% OFF
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-medium text-gray-900">₹{price.toLocaleString()}</span>
            {comparePrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{comparePrice.toLocaleString()}
              </span>
            )}
          </div>
          
          <button
            onClick={handleWhatsAppClick}
            className="inline-flex items-center text-green-600 hover:text-green-700"
            aria-label="Contact on WhatsApp"
          >
            <WhatsappIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;