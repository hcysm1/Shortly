import dbConnect from "../../utils/dbConnect";
import Url from "../../models/Url";
import { nanoid } from "nanoid"; //library used to generate unique short IDs

export default async function handler(req, res) {
  const { method } = req; //extracts the HTTP method (e.g., GET, POST) from the request.

  await dbConnect(); //check if database is connected

  switch (method) {
    case "POST":
      try {
        const { originalUrl } = req.body;
        const shortUrl = nanoid(6);
        const newUrl = await Url.create({ originalUrl, shortUrl });
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
    default:
      res.status(400).json({ success: false });
      break;
  }
}
