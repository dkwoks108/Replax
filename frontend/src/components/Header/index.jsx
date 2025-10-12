import { useState } from 'react';
import Link from 'next/link';
import HamburgerMenu from './HamburgerMenu';
import Logo from './Logo';
import CartIcon from './CartIcon';
import LoginSignup from './LoginSignup';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-cream shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <HamburgerMenu onToggle={setIsMobileMenuOpen} />
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/products" className="text-olive hover:text-forest-green transition-colors">
              Products
            </Link>
            <Link href="/blog" className="text-olive hover:text-forest-green transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-olive hover:text-forest-green transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-olive hover:text-forest-green transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <CartIcon />
            <div className="hidden lg:block">
              <LoginSignup />
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-olive/10">
            <div className="flex flex-col gap-4">
              <Link href="/products" className="text-olive hover:text-forest-green transition-colors">
                Products
              </Link>
              <Link href="/blog" className="text-olive hover:text-forest-green transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-olive hover:text-forest-green transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-olive hover:text-forest-green transition-colors">
                Contact
              </Link>
              <div className="pt-4 border-t border-olive/10">
                <LoginSignup />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}