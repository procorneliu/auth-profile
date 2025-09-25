"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        withCredentials: true,
      });
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 2 * 1024 * 1024) {
        setError("File is too large. Max size is 2MB.");
        setFile(null);
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
        setError("Invalid file type. Only JPG, PNG, or WEBP allowed.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(f);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}/avatar`,
        formData,
        { withCredentials: true }
      );
      setUser({ ...user, avatarUrl: res.data.avatarUrl });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!user) return;
    try {
      setSaving(true);
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`,
        { firstName: user.firstName, lastName: user.lastName },
        { withCredentials: true }
      );
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-gray-700">
        <h1 className="text-xl font-semibold text-center mb-6">Profile</h1>

        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-gray-500 text-sm">No avatar</span>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="avatarInput"
            className="hidden"
          />
          <label
            htmlFor="avatarInput"
            className="cursor-pointer bg-gray-100 border px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Choose Avatar
          </label>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3 hover:bg-green-600 transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Avatar"}
          </button>
        </div>

        {/* Editable fields */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            First name
          </label>
          <input
            type="text"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            className="w-full border px-3 py-2 rounded-md mt-1"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Last name
          </label>
          <input
            type="text"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            className="w-full border px-3 py-2 rounded-md mt-1"
          />

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 w-full hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 w-full rounded-lg mt-6 hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
