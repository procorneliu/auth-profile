"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,{ withCredentials: true });
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p>Email: {user.email}</p>
      <p>Name: {user.firstName} {user.lastName}</p>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 mt-4"
      >
        Logout
      </button>
    </div>
  );
}
