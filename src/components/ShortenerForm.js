import { useState } from "react";

export default function ShortenerForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/short", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalUrl: url }),
    });

    const data = await res.json();
    setShortUrl(data.data.shortUrl);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Shorten. Simplify. Share</h1>
      <p className="mb-8">
        Transform long URLs into short, manageable links. Easily share and track
        your links with a user-friendly interface.
      </p>
      <form
        className="flex items-center w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <input
          type="url"
          className="flex-grow p-2 border border-gray-300 rounded-l"
          placeholder="Enter the link here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          className="bg-yellow-500 text-white p-2 rounded-r"
          type="submit"
        >
          Shorten Now!
        </button>
      </form>
      <table className="w-full max-w-5xl mt-10">
        <thead>
          <tr className="text-left bg-gray-200">
            <th className="p-2">Short Link</th>
            <th className="p-2">Original Link</th>
            <th className="p-2">QR Code</th>
            <th className="p-2">Clicks</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{shortUrl}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
