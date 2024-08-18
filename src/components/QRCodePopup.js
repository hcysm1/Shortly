import { useState } from "react";
import QRCode from "react-qr-code";

function QRCodePopup({ shortUrl, onClose }) {
  const [size, setSize] = useState(128); // Default size

  const handleSizeChange = (e) => {
    setSize(parseInt(e.target.value));
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "qr-code.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">QR Code</h2>
        <QRCode id="qr-code-svg" value={shortUrl} size={size} />
        <div className="mt-4">
          <label htmlFor="size" className="mr-2">
            Size:
          </label>
          <select id="size" value={size} onChange={handleSizeChange}>
            <option value={128}>128x128</option>
            <option value={256}>256x256</option>
            <option value={512}>512x512</option>
          </select>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleDownload}
          >
            Download SVG
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCodePopup;
