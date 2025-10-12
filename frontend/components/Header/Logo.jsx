import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <Image
          src="/logo.svg"
          alt="ReplaX Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="text-xl font-semibold text-olive">ReplaX</span>
    </Link>
  );
}