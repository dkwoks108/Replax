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

/* Compatibility wrapper: ensures a default export for consumers that import '@/components/Button' */
import * as ButtonModule from './ButtonImpl';
const ButtonDefault = ButtonModule.default ?? ButtonModule.Button ?? (props => null);
export default ButtonDefault;