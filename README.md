# Shortly - URL Shortener

Shortly is a simple and efficient URL shortener application that allows users to shorten long URLs, generate QR codes for the shortened URLs, and easily copy them to the clipboard. This project is built using modern web technologies and deployed on Vercel.

## Demo

Check out the live demo: [Shortly - URL Shortener](https://shortivity.vercel.app)

## Tech Stack

- **Frontend/Backend:** Next.js
- **Styling:** Tailwind CSS
- **Database:** MongoDB (via Mongoose)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v14.x or later)
- npm (v6.x or later) or Yarn
- MongoDB (either locally or using a cloud service like MongoDB Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/hcysm1/shortly.git
   cd shortly
   ```

2. **Install dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of your project and add the following:

   ```bash
   MONGO_URI=your_mongodb_connection_string
   BASE_URL=https://shortivity.vercel.app
   ```

4. **Run the application:**

   To start the development server, run:

   ```bash
   npm run dev
   ```

   Or with Yarn:

   ```bash
   yarn dev
   ```

   The app will be available at `http://localhost:3000`.

### Deployment

The project is already set up for deployment on Vercel. If you wish to redeploy or deploy to a different platform, ensure that your environment variables are set correctly in your platform's environment settings.

### Database Connection

Ensure your MongoDB database is accessible and the connection string in your `.env` file is correct. You can use MongoDB Atlas for a cloud-based solution.
