import dbConnect from "../utils/dbConnect";
import Url from "../models/Url";

export default function RedirectPage() {
  return null; // no need to render anything
}

//redirect logic

export async function getServerSideProps({ params }) {
  await dbConnect();

  const { shortCode } = params;

  const url = await Url.findOne({ shortCode });

  if (url) {
    return {
      redirect: {
        destination: url.originalUrl,
        permanent: false,
      },
    };
  }

  return {
    notFound: true,
  };
}
