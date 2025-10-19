export const runtime = 'edge';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-4xl text-gray-900">404</h1>
        <p className="text-gray-600 text-lg">Page not found</p>
        <a href="/" className="text-blue-600 hover:text-blue-800">
          Go back home
        </a>
      </div>
    </div>
  );
}
