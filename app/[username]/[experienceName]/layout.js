// app/admin/layout.jsx

import { notFound } from "next/navigation";
import axios from "axios";

// Function to fetch metadata based on route parameters

// export async function generateMetadata() {
//   // read route params
//  const data =  fetchMetadata()
//   // fetch data

//   // optionally access and extend (rather than replace) parent metadata

//   return {
//     title: "immersify",
//     description: "this is descirption",
//     url: "http//:next.jscom",
//     openGraph: {
//       images: ["https://wallpapercave.com/wp/wp5984937.jpg"],
//     },
//   };
// }

async function fetchMetadata(username, experienceName) {
  try {
    const response = await axios.get(
      `https://sandboxapi.immarsify.com/api/${
        username === "Admin" ? "template/template_view" : "ar/ar_view"
      }/${username}/${experienceName}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    return null;
  }
}

// Layout component
export default async function RootLayout({ children, params }) {
  let metaDescription = "";
  let metaImage = "";
  let metaTitle = "";
  const { username, experienceName } = params;
  if (username && experienceName !== "%5Bobject%20Object%5D") {
    console.log(username, experienceName);

    const data = await fetchMetadata(username, experienceName);
    const vcardData = data?.data?.arExperience?.icons?.filter(
      (icon) => icon?.isvCard === true
    );
    console.log(data?.data?.arExperience.image);
    metaTitle = data?.data?.arExperience?.name;
    if (vcardData?.length > 0) {
      metaDescription = vcardData[0]?.vCardJson?.note;
      console.log("came in vcard data");
      // setMetaImage(vcardData[0]?.vCardJson?.photo);
      metaImage = vcardData[0]?.vCardJson?.photo;
    } else if (data?.data?.arExperience?.image) {
      metaImage = data?.data?.arExperience.image;
      metaDescription = "Grow your business with immarsify";
    } else {
      metaImage = data?.data?.arExperience?.targetImage?.src;
      metaDescription = "Grow your business with immarsify";
    }

    console.log(metaTitle, metaDescription, metaImage);
  }
  return (
    <html>
      <head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta
          property="og:url"
          content={`http://localhost:3000/admin/${username}/${experienceName}`}
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
      </head>
      <body>{children}</body>
    </html>
  );
}
