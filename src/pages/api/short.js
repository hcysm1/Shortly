import dbConnect from "../../utils/dbConnect";
import Url from "../../models/Url";
import { nanoid } from "nanoid"; //library used to generate unique short IDs

export default async function handler(req, res) {
  const { method } = req; //extracts the HTTP method (e.g., GET, POST) from the request.

  await dbConnect(); //check if database is connected
  const baseUrl = process.env.BASE_URL || "https://localhost:3000";

  switch (method) {
    case "POST":
      try {
        const { originalUrl } = req.body;
        const shortCode = nanoid(6);
        const shortUrl = `${baseUrl}/${shortCode}`;
        const newUrl = await Url.create({ originalUrl, shortUrl, shortCode });
        res.status(201).json({ success: true, data: newUrl });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "GET":
      try {
        const urls = await Url.find({});
        res.status(200).json({ success: true, data: urls });
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
      }
      break;
    case "PUT":
      try {
        const { shortCode } = req.body; // Assuming the shortCode is sent in the body
        const url = await Url.findOneAndUpdate(
          { shortCode }, // Find the document by shortCode
          { $inc: { clicks: 1 } }, // Increment the clicks field by 1
          { new: true } // Return the updated document
        );

        if (!url) {
          return res
            .status(404)
            .json({ success: false, message: "URL not found" });
        }

        res.status(200).json({ success: true, data: url });
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
      }
      break;
    case "DELETE":
      try {
        const { shortCode } = req.body; // Assuming the shortCode is sent in the body
        const url = await Url.findOneAndDelete(
          { shortCode } // Find the document by shortCode
        );

        if (!url) {
          return res
            .status(404)
            .json({ success: false, message: "URL not found" });
        }

        res.send({ message: "URL deleted successfully" });
      } catch (error) {
        res
          .status(500)
          .send({ message: "An error occurred while deleting the URL" });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
