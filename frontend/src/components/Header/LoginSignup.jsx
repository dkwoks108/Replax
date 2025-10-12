import Link from 'next/link';

export default function LoginSignup() {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="text-olive hover:text-forest-green transition-colors"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="bg-olive text-cream px-4 py-2 rounded-lg hover:bg-forest-green transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}