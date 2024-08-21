import { useState } from "react";
import QRCode from "react-qr-code";
import { FiX } from "react-icons/fi";

function QRCodePopup({ shortUrl, onClose }) {
  const [size, setSize] = useState(128); // Default size

  const handleSizeChange = (e) => {
    setSize(parseInt(e.target.value)); //convert the string to a number
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
      <div className="relative flex flex-col items-center justify-center bg-white p-6 rounded shadow-lg">
        <button
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          onClick={onClose}
        >
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">QR Code</h2>
        <QRCode id="qr-code-svg" value={shortUrl} size={size} />
        <div className="mt-4">
          <label htmlFor="size" className="mr-2 font-bold">
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
            className="bg-yellow-500 text-white px-4 py-2 rounded-full"
            onClick={handleDownload}
          >
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCodePopup;
