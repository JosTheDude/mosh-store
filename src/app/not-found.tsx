export const runtime = "edge";
export const dynamic = "force-static";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-bold text-4xl">404</h1>
      <p className="text-lg">Page Not Found</p>
      <p>
        <a href="/" style={{ textDecoration: "underline", color: "white" }}>
          ⬅️ Return to Home
        </a>
      </p>
    </div>
  );
}
