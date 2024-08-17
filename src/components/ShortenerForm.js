import { useState, useEffect, useCallback } from "react";
import QRCode from "qrcode.react";

export default function ShortenerForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlHistory, setUrlHistory] = useState([]);

  useEffect(() => {
    fetchUrlHistory();
  }, []);

  const fetchUrlHistory = useCallback(async () => {
    const res = await fetch("/api/short");
    const data = await res.json();
    setUrlHistory(data.data);
  }, []);

  useEffect(() => {
    fetchUrlHistory();
  }, [fetchUrlHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Optional: show loading state

    const res = await fetch("/api/short", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalUrl: url }),
    });

    const data = await res.json();
    setShortUrl(data.data.shortUrl);
    setUrl("");

    // Fetch updated URL history
    fetchUrlHistory();

    setLoading(false); // Optional: hide loading state
  };

  const handleLinkClick = async (entry) => {
    await fetch(`/api/short`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shortCode: entry.shortCode }),
    });

    // Update clicks locally
    setUrlHistory((prevHistory) =>
      prevHistory.map((item) =>
        item._id === entry._id ? { ...item, clicks: item.clicks + 1 } : item
      )
    );
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
            <th className="p-4">Short Link</th>
            <th className="p-4">Original Link</th>
            <th className="p-4">QR Code</th>
            <th className="p-4">Clicks</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {urlHistory.map((entry) => (
            <tr key={entry._id} className="border-b border-gray-200">
              <td className="p-4">
                <a
                  href={entry.shortUrl}
                  target="_blank"
                  onClick={() => handleLinkClick(entry)}
                >
                  {entry.shortUrl}
                </a>
              </td>
              <td className="p-4">{entry.originalUrl}</td>
              <td className="p-4">
                <QRCode value={entry.shortUrl} size={50} />
              </td>
              <td className="p-4">{entry.clicks}</td>
              <td className="p-4">{entry.status}</td>
              <td className="p-4">
                {new Date(entry.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
