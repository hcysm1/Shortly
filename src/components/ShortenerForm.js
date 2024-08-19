import { useState, useEffect, useCallback } from "react";
import QRCodePopup from "./QrcodePopup";
import QRCode from "react-qr-code";
import { FiClipboard, FiTrash2 } from "react-icons/fi"; // Import the clipboard and trash icon

export default function ShortenerForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlHistory, setUrlHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");

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

  const handleQRCodeClick = (shortUrl) => {
    setSelectedUrl(shortUrl);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl); // Copy the short URL to the clipboard
    alert("Short URL copied to clipboard!");
  };

  const handleDelete = async (entry) => {
    try {
      const res = await fetch(`/api/short`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shortCode: entry.shortCode }),
      });

      if (res.ok) {
        // Remove the URL from the state to delete the row
        setUrlHistory((prevHistory) =>
          prevHistory.filter((entry) => entry.shortCode !== entry.shortCode)
        );
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the URL.");
    }
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
            <th className="p-4">Date</th>
            <th className="p-4">Action</th>
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
              <td className="max-w-xs truncate">{entry.originalUrl}</td>
              <td className="p-4">
                <button
                  onClick={() => handleQRCodeClick(entry.shortUrl)}
                  className="cursor-pointer"
                >
                  <QRCode value={entry.shortUrl} size={30} />
                </button>
              </td>

              <td className="p-4">{entry.clicks}</td>
              <td className="p-4">
                {new Date(entry.createdAt).toLocaleDateString()}
              </td>
              <td className="text-black p-4 inline-flex space-x-2 cursor-pointer">
                <FiClipboard
                  size={24}
                  onClick={() => handleCopy(entry.shortUrl)}
                />
                <FiTrash2 size={24} onClick={() => handleDelete(entry)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && <QRCodePopup shortUrl={selectedUrl} onClose={closePopup} />}
    </div>
  );
}
