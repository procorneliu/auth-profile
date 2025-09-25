"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AgeGate() {
  const router = useRouter();

  const handleConfirm = () => {
    Cookies.set("ageConfirmed", "true", { expires: 7 }); // valid for 7 days
    router.push("/login");
  };

  const handleLeave = () => {
    window.location.href = "https://google.com"; // or another site
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center text-gray-700">
      {/* Logo placeholder */}

      <h1 className="text-2xl font-bold mb-4">18 +</h1>
      <p className="text-gray-600 max-w-md mb-6">
        By continuing, you confirm that you are at least 18 years old and
        legally permitted to use this service.
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleConfirm}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          I’m over 18 years old
        </button>
        <button
          onClick={handleLeave}
          className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Leave the service
        </button>
      </div>
    </div>
  );
}
