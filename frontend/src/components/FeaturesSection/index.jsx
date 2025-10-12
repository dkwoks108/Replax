import Image from 'next/image';

const features = [
  {
    icon: '/icons/eco.svg',
    title: 'Eco-Friendly Materials',
    description: 'All products made from sustainable, biodegradable materials',
  },
  {
    icon: '/icons/certified.svg',
    title: 'FSSAI Certified',
    description: 'Products meet highest food safety and quality standards',
  },
  {
    icon: '/icons/plastic-free.svg',
    title: 'Zero Plastic',
    description: 'Completely plastic-free packaging and products',
  },
  {
    icon: '/icons/biodegradable.svg',
    title: 'Compostable',
    description: 'Products naturally decompose leaving no harmful residue',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-cream/50">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold text-olive mb-12">
          Why Choose ReplaX?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 bg-cream rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-forest-green mb-2">
                {feature.title}
              </h3>
              <p className="text-olive/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}