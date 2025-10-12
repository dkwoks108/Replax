export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-forest-green mb-4">About ReplaX</h1>
        <p className="mb-4">
          ReplaX is a sustainability-focused brand committed to providing eco-friendly, zero-waste
          alternatives to everyday plastic products. Our mission is to reduce plastic pollution and
          promote sustainable living through high-quality, compostable, and biodegradable products.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Materials & Certifications</h2>
        <ul className="list-disc pl-5">
          <li>Renewable materials: bamboo, sugarcane bagasse, palm leaf, areca nut</li>
          <li>FSSAI-approved materials and BPA-free components where applicable</li>
          <li>Near zero-plastic packaging and FSC-approved bamboo</li>
        </ul>
      </div>
    </div>
  );
}
