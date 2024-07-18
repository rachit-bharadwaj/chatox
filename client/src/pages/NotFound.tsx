import { Navbar } from "../components/shared";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Navbar />
      <p className="text-5xl text-indigo-500 font-bold">Page Not Found</p>
    </div>
  );
}
