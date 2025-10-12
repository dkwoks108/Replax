import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="py-16 bg-cream/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-olive mb-6">
              Our Mission for a Sustainable Future
            </h2>
            <p className="text-olive/80 mb-6">
              At Replax, we believe in making sustainable living accessible to everyone. 
              Our journey began with a simple idea: to provide eco-friendly alternatives 
              that don't compromise on quality or style.
            </p>
            <p className="text-olive/80 mb-6">
              Every product in our collection is carefully selected to ensure it meets 
              our strict sustainability standards. From bamboo essentials to compostable 
              alternatives, we're committed to reducing plastic waste and promoting 
              environmental consciousness.
            </p>
            <p className="text-olive/80 mb-8">
              Join us in our mission to create a cleaner, greener future for generations 
              to come. Every small change matters, and together, we can make a significant 
              impact on our planet's wellbeing.
            </p>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-forest-green mb-2">5000+</h3>
                <p className="text-olive/70">Happy Customers</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-forest-green mb-2">100%</h3>
                <p className="text-olive/70">Eco-friendly</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-forest-green mb-2">50+</h3>
                <p className="text-olive/70">Products</p>
              </div>
            </div>
          </div>

          <div className="relative h-[600px] rounded-lg overflow-hidden">
            <Image
              src="/images/about-collage.jpg"
              alt="Replax sustainable products collage"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}