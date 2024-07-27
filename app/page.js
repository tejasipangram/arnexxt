"use client";
import "@/app/client/App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import MindarViewerSV from "./mindar-viewer-SV.js";
import MindarViewerSV from "@/app/client/mindar-viewer-SV.js";
import MindarViewerSVAnd from "@/app/client/mindar-viewer-SV-Android.js";
// import MindarViewerSVAnd from "./mindar-viewer-SV-Android.js";
// import SplashScreen from "./assets/splash.gif";
import { Helmet } from "react-helmet";
// import scaning from "./assets/gif/scaning.gif";
// import logo from "./assets/svg/final_logo_white.svg";
// import Screen from "./assets/svg/Splash-screen.svg";
import DisplayScreen from "@/app/client/assets/svg/Desktop_background.svg";
import { getCookie, setCookie } from "@/app/client/components/cookies.js";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";

function App() {
  const [branding, setBranding] = useState([]);
  // const { username, experienceName } = useParams();
  const url = window.location.href;
  console.log(url);

  const nextRoutes = url.split("/#/")[1];
  console.log(nextRoutes);


  const username = nextRoutes.split("/")[0];
  const experienceName = nextRoutes.split("/")[1];
  console.log(username, experienceName);
  const [started, setStarted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [startExperience, setStartExperience] = useState(false);
  const [metaDescription, setMetaDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaImage, setMetaImage] = useState("");

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  function getOperatingSystem() {
    const platform = navigator.platform;
    const userAgent = navigator.userAgent;
    if (/Mac/.test(platform)) {
      return "Mac OS";
    } else if (/Win/.test(platform)) {
      return "Windows";
    } else if (/Android/.test(userAgent)) {
      return "Android";
    } else if (/Linux/.test(platform)) {
      return "Linux";
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
      return "iOS";
    } else {
      return "Unknown";
    }
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const languages = navigator.languages;
  const userAgent = navigator?.userAgent;
  const isMobile = isMobileDevice();
  const operatingSystem = getOperatingSystem();

  const loadArData = async () => {
    try {
      setStartExperience(false);
      setLoading(true);
      setError(false);
      // const url =
      // "https://sandboxapi.immarsify.com/api/ar/ar_view/lalit121/nanao";
      const response = await axios.get(
        `https://sandboxapi.immarsify.com/api/ar/ar_view/${username}/${experienceName}`
      );
      // const response = await axios.get(url);
      if (response.status === 200) {
        setLoading(false);
        setStarted(response.data.data.arExperience);
        console.log(response.data.data);

        const vcardData = response.data.data?.arExperience?.icons?.filter(
          (icon) => icon?.isvCard === true
        );
        console.log(vcardData);
        if (vcardData.length > 0) {
          setMetaDescription(vcardData[0]?.vCardJson?.note);
          setMetaImage(vcardData[0]?.vCardJson?.photo);
        } else if (response.data.data?.image) {
          setMetaImage(response.data.data?.arExperience.image);
        } else {
          console.log(response.data.data?.arExperience?.targetImage?.src);
          setMetaImage(response.data.data?.arExperience?.targetImage?.src);
        }

        setMetaTitle(response.data.data.arExperience?.name);
        let userId = response.data.data.arExperience.userId;
        let resellerId = response?.data?.data?.arExperience?.resellerId;
        analytics(
          username,
          experienceName,
          userId,
          resellerId,
          timezone,
          userAgent,
          languages
        );
        setBranding(response.data.data.branding);
      }
    } catch (error) {
      setLoading(false);
      console.log(error?.response?.data?.isDeleted);
      setError(true);
      if (!error?.response?.data?.isSubscriptionActive) {
        setIsSubscribed(false);
      } else if (error?.response?.data?.isDeleted) {
        setIsDeleted(true);
      }
    }
  };

  useEffect(() => {
    console.log("came in useffect ", username, experienceName);
    if (username && experienceName) {
      loadArData();
    }
  }, [username, experienceName]);

  const filterBranding = (name) => {
    let data = branding.filter((li) => li.name === name);
    if (data.length > 0) {
      if (data[0]?.enabled && data[0]?.url) {
        return data[0].url;
      }
    }
  };

  const analytics = async (
    username,
    experienceName,
    userId,
    resellerId,
    timezone,
    userAgent,
    languages
  ) => {
    try {
      let visitorId = getCookie("visitorId");

      if (!visitorId) {
        visitorId = uuidv4();
        setCookie("visitorId", visitorId, 365);
      }

      // const response = await axios.post("http://localhost:8001/api/visitors/add_visitors", {
      await axios.post(
        "https://sandboxapi.immarsify.com/api/visitors/add_visitors",
        {
          timezone,
          userAgent,
          languages,
          ...(visitorId && { visitorId: visitorId }),
          isMobile,
          operatingSystem,
          userDetails: {
            username,
            experienceName,
            userId,
            ...(resellerId && { resellerId: resellerId }),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  console.log(metaTitle, metaDescription, metaImage, "this is started ");

  return (
    <>
      <div className="App">
        {started && (
          <>
            {!filterBranding("Custom Welcome Screen") ? (
              <div className="container_wrapper">
                {/* {console.log((/iPad|iPhone|iPod/.test(userAgent)))} */}
                {userAgent && /iPad|iPhone|iPod/.test(userAgent) ? (
                  <MindarViewerSV
                    loadingScreen={filterBranding("Loading Screen")}
                    brandLogo={filterBranding("Loading Screen")}
                    helperLogo={filterBranding("Helper Message and Icon")}
                    data={started}
                  />
                ) : (
                  <MindarViewerSVAnd
                    loadingScreen={filterBranding("Loading Screen")}
                    brandLogo={filterBranding("Loading Screen")}
                    helperLogo={filterBranding("Helper Message and Icon")}
                    data={started}
                  />
                )}
              </div>
            ) : startExperience ? (
              <div className="container_wrapper">
                {userAgent && /iPad|iPhone|iPod/.test(userAgent) ? (
                  <MindarViewerSV
                    loadingScreen={filterBranding("Loading Screen")}
                    brandLogo={filterBranding("Loading Screen")}
                    helperLogo={filterBranding("Helper Message and Icon")}
                    data={started}
                  />
                ) : (
                  <MindarViewerSVAnd
                    loadingScreen={filterBranding("Loading Screen")}
                    brandLogo={filterBranding("Loading Screen")}
                    helperLogo={filterBranding("Helper Message and Icon")}
                    data={started}
                  />
                )}
              </div>
            ) : (
              <div
                style={{
                  backgroundImage: `url(${
                    filterBranding("Custom Welcome Screen")
                      ? filterBranding("Custom Welcome Screen")
                      : DisplayScreen
                  })`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "end",
                }}
                className="container_wrapper button_wrapper"
              >
                {/* {filterBranding("Custom Welcome Screen") ?? (
                <img src={logo} alt="Logo" className="main_page_logo" />
              )} */}
                <button
                  onClick={() => setStartExperience(true)}
                  className="startButton"
                >
                  Launch
                </button>
              </div>
            )}
          </>
        )}

        {console.log(error)}

        {error && !isSubscribed && (
          <div className="wrapper">
            <h2>This Immarsify experience owner Is No Longer Subscribed</h2>
            <h3>Please contact the experience owner</h3>
          </div>
        )}

        {error && isDeleted && (
          <div className="wrapper">
            <h2>This Immarsify experience No Longer Exists</h2>
            <h3>Please contact the experience owner</h3>
          </div>
        )}

        {error && !isDeleted && isSubscribed && (
          <div className="wrapper">
            <h2>No Immarsify experience found</h2>
            <h3>Please check URL</h3>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
