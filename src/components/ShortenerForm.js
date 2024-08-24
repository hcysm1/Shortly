import { useState, useEffect, useCallback } from "react";
import QRCodePopup from "./QrcodePopup";
import QRCode from "react-qr-code";
import { FiClipboard, FiTrash2, FiLink } from "react-icons/fi"; // Import the clipboard and trash icon

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
          prevHistory.filter((item) => item._id !== entry._id)
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
    <div className="flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-gray-500 to-yellow-500 text-transparent bg-clip-text leading-tight">
          Shorten. Simplify. Share
        </h1>
        <p className="mb-10">
          Transform long URLs into short, manageable links. Easily share and
          track your links with a user-friendly interface.
        </p>
      </div>
      <form className="relative w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FiLink className="text-gray-400 h-5 w-5" />
        </div>

        <input
          type="url"
          className="w-full pl-10 pr-20 py-3 md:pl-12 md:pr-24 rounded-full outline outline-2 outline-gray-300 hover:outline-gray-800 focus:outline-gray-800"
          placeholder="Paste your long link here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          className="absolute right-1 top-1 px-4 py-2 md:px-6 md:py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-700"
          type="submit"
        >
          Shorten Now!
        </button>
      </form>

      {urlHistory.length === 0 ? (
        <p className="mt-10 text-gray-400">
          Looks like you have not shortened any URLs yet. Start by adding your
          first URL!
        </p>
      ) : (
        <div className="w-full max-w-5xl mt-10 overflow-x-auto rounded-lg">
          <table className="w-full text-left bg-white border border-gray-200">
            <thead>
              <tr className="text-white bg-neutral-800">
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
                <tr
                  key={entry._id}
                  className="border-b border-gray-200 text-center"
                >
                  <td className="inline-flex space-x-2 text-black cursor-pointer mt-2 p-4 ">
                    <a
                      href={entry.shortUrl}
                      className="hover:text-slate-500"
                      target="_blank"
                      onClick={() => handleLinkClick(entry)}
                    >
                      {entry.shortUrl}
                    </a>
                    <FiClipboard
                      className=" bg-slate-200 hover:bg-slate-300 rounded-full"
                      style={{ padding: "0.25rem" }}
                      size={24}
                      onClick={() => handleCopy(entry.shortUrl)}
                    />
                  </td>

                  <td className="max-w-xs truncate">{entry.originalUrl}</td>
                  <td className=" mt-2 p-4">
                    <button
                      onClick={() => handleQRCodeClick(entry.shortUrl)}
                      className="cursor-pointer"
                    >
                      <QRCode
                        value={entry.shortUrl}
                        size={30}
                        className="hover:bg-slate-300 rounded-lg"
                        style={{ padding: "0.25rem" }}
                      />
                    </button>
                  </td>

                  <td className="p-4">{entry.clicks}</td>
                  <td className="p-4">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="text-black inline-flex space-x-2 cursor-pointer hover:bg-slate-300 rounded-full mt-2 p-4"
                    style={{ padding: "0.25rem" }}
                  >
                    <FiTrash2 size={24} onClick={() => handleDelete(entry)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showPopup && <QRCodePopup shortUrl={selectedUrl} onClose={closePopup} />}
    </div>
  );
}
