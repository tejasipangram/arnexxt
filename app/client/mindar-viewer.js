"use client";
import React, { useEffect, useRef } from "react";
import AFRAME from "aframe";
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import SplashScreen from "./assets/splash.gif";
import { TfiReload } from "react-icons/tfi";
// import "./assets/library/mind-ar-js-1.2.0/dist/mindar-image-aframe.prod.js";
// import "./aframeScript";

export default function Test({ data }) {
  const sceneRef = useRef(null);
  const allData = [
    ...(data?.photos ?? []),
    ...(data?.images ?? []),
    ...(data?.icons ?? []),
    ...(data?.videos ?? []),
    ...(data?.text ?? []),
  ];

  useEffect(() => {
    const sceneEl = sceneRef.current;
    const arSystem = sceneEl.systems["mindar-image-system"];
    allData.forEach((element) => {
      let photo = document.createElement("a-image");
      let text = document.createElement("a-text");
      let video = document.createElement("video");
      let aVideo = document.createElement("a-video");
      let circlePhoto = document.createElement("a-circle");
      if (element.type === "text") {
        text.setAttribute("id", `ele${element.id.substring(0, 5)}`);
        text.setAttribute("value", element.body);
        text.setAttribute("color", element.color);
        text.setAttribute("scale", {
          x: element.fontSize / 15,
          y: element.fontSize / 15,
          z: 1,
        });
        text.setAttribute("opacity", "0");
        text.setAttribute("position", {
          x: element.position.x,
          y: element.position.y,
          z: element.position.z,
        });
        document.getElementById("mainEntity").appendChild(text);
      } else if (element.type === "icons") {
        photo.setAttribute("id", `ele${element.id.substring(0, 5)}`);
        photo.setAttribute("src", element.src);
        photo.setAttribute("class", "clickable");
        photo.setAttribute("opacity", "0");
        photo.setAttribute("scale", {
          x: element.scale.x,
          y: element.scale.y,
          z: 0,
        });
        photo.setAttribute("position", {
          x: element.position.x,
          y: -element.position.z,
          z: element.position.y,
        });

        if (element?.isvCard) {
          photo.addEventListener("click", function (evt) {
            const blob = new Blob([element?.vCard], {
              type: "text/plain;charset=utf-8",
            });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = `${
              element?.vCardJson?.firstName + "_" + element?.vCardJson?.lastName
            }.vcf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          });
        } else {
          element?.isLink &&
            photo.addEventListener("click", function (evt) {
              window.open(element?.iconLink, "_blank");
            });
        }

        document.getElementById("mainEntity").appendChild(photo);
      } else if (element.type === "video") {
        video.setAttribute("id", `ele${element.id.substring(0, 5)}`);
        video.setAttribute("src", element.src);
        video.setAttribute("crossorigin", "anonymous");
        video.setAttribute("autoPlay", "false");
        document.getElementById("mainAssets").appendChild(video);
        aVideo.setAttribute("id", `ele${element.id.substring(0, 5)}a_video`);
        aVideo.setAttribute("src", `#ele${element.id.substring(0, 5)}`);
        aVideo.setAttribute("opacity", "0");
        aVideo.setAttribute("class", "clickable");
        aVideo.setAttribute("position", {
          x: element.position.x,
          y: element.position.y,
          z: element.position.z,
        });
        aVideo.setAttribute("scale", {
          x: element.scale.x,
          y: element.scale.y,
          z: 0,
        });
        document.getElementById("mainEntity").appendChild(aVideo);
      } else {
        if (element?.geometry === "Circle") {
          circlePhoto.setAttribute("id", `ele${element.id.substring(0, 5)}`);
          circlePhoto.setAttribute(
            "src",
            element.src + "?not-from-cache-please"
          );
          circlePhoto.setAttribute("opacity", "0");
          circlePhoto.setAttribute("position", {
            x: element.position.x,
            y: element.position.y,
            z: element.position.z,
          });
          circlePhoto.setAttribute("scale", {
            x: element.scale.x / 2,
            y: element.scale.y / 2,
            z: 0,
          });
          document.getElementById("mainEntity").appendChild(circlePhoto);
        } else {
          photo.setAttribute("id", `ele${element.id.substring(0, 5)}`);
          photo.setAttribute("src", element.src);
          photo.setAttribute("opacity", "0");
          photo.setAttribute("position", {
            x: element.position.x,
            y: element.position.y,
            z: element.position.z,
          });
          photo.setAttribute("scale", {
            x: element.scale.x,
            y: element.scale.y,
            z: 0,
          });
          document.getElementById("mainEntity").appendChild(photo);
        }
      }
    });
    sceneEl.addEventListener("renderstart", () => {
      arSystem.start();
    });
    return () => {
      arSystem.stop();
    };
  }, []);

  const hideContent = () => {
    allData.forEach((element) => {
      let currentDoc = document.querySelector(
        `#ele${element.id.substring(0, 5)}`
      );

      if (element.type === "video") {
        currentDoc.pause();
        currentDoc.currentTime = 0.1;
      } else {
        currentDoc.setAttribute("visible", "false");
        currentDoc.setAttribute("opacity", "0");
      }
    });
  };

  const showCard = () => {
    allData.forEach((element, idx) => {
      let currentDoc = document.querySelector(
        `#ele${element.id.substring(0, 5)}`
      );
      currentDoc.setAttribute("visible", "true");

      if (element.type === "video") {
        currentDoc.play();
        let avideo = document.querySelector(
          `#ele${element.id.substring(0, 5)}a_video`
        );
        avideo.addEventListener("click", function (evt) {
          if (currentDoc.paused) {
            currentDoc.play();
          } else if (!currentDoc.paused) {
            currentDoc.pause();
          } else {
            currentDoc.play();
          }
        });
        avideo.setAttribute(`animation`, {
          property: "position",
          to: {
            x: element.position.x,
            y: -element.position.z,
            z: -0.05 || element.position.y,
          },
          from: { x: 0, y: 0, z: -0.05 },
          autoplay: "true",
          dur: element?.animation?.duration,
          delay: element?.animation?.delay,
          easing: "linear",
          loop: "once",
        });
        avideo.setAttribute(`animation__2`, {
          property: "opacity",
          to: "1",
          from: "0",
          autoplay: "true",
          dur: element?.animation?.duration,
          delay: element?.animation?.delay,
          loop: "once",
          easing: "linear",
        });
      } else if (element.isAnimation) {
        currentDoc.setAttribute(`animation`, {
          property: "position",
          to: {
            x: element.position.x,
            y: -element.position.z,
            z: -0.05 || element.position.y,
          },
          from: { x: 0, y: 0, z: -0.05 },
          autoplay: "true",
          dur: element?.animation?.duration,
          delay: element?.animation?.delay,
          easing: "linear",
          loop: "once",
        });
        currentDoc.setAttribute(`animation__2`, {
          property: "opacity",
          to: "1",
          from: "0",
          autoplay: "true",
          dur: element?.animation?.duration,
          delay: element?.animation?.delay,
          loop: "once",
          easing: "linear",
        });
      }
    });
  };
  if (!AFRAME.components["mytarget"]) {
    AFRAME.registerComponent("mytarget", {
      init: function () {
        document.getElementById("overlay_button").removeAttribute("class");
        this.el.addEventListener("targetFound", (event) => {
          console.log("target found");
          hideContent();
          showCard();
        });

        //THIS FUNCTION IS EXECUTED ONCE WHEN THE CAMERA FEED LOSSES THE TARGET IMAGE OR IS UNABLE TO IDENTIFY IT IN FEED
        this.el.addEventListener("targetLost", (event) => {
          console.log("targetLost");
          hideContent();
        });
      },
    });
  }

  return (
    <>
      <img
        id="splashScreen"
        className="hidden"
        src={SplashScreen}
        alt="Splash Screen"
      ></img>
      <a-scene
        ref={sceneRef}
        mindar-image={`imageTargetSrc: ${data.mind.src};
        uiLoading: #splashScreen;
        uiError: yes;
        uiScanning: yes;
        filterMinCF: 0.0000005;
        filterBeta: 0.005;
        stayVisible: false;
        warmupTolerance: 2;
        missTolerance: 1;`}
        loading-screen="enabled:false"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        <a-assets id="mainAssets">
          <img id="target" src={data.targetImage.src} />
          {/* <img id="splashScreen" src="https://cdn.glitch.global/1a25e305-bb39-4235-9f92-b31c422cf9ee/splash.gif?v=1708435980193"/> */}
        </a-assets>
        <a-camera
          position="0 0 0"
          look-controls="enabled: false"
          cursor="fuse: false; rayOrigin: mouse;"
          raycaster="far: 999999; objects: .clickable"
        ></a-camera>

        <a-entity id="mainEntity" mytarget mindar-image-target="targetIndex: 0">
          <a-plane
            scale={`${data?.targetImage?.scale?.x ?? 1} ${
              data?.targetImage?.scale?.y ?? 1
            } ${data?.targetImage?.scale?.z ?? 1}`}
            position="0 0 0"
            src="#target"
          ></a-plane>
        </a-entity>
      </a-scene>
      <div
        id="overlay_button"
        className="hidden"
        onClick={(e) => {
          e.stopPropagation();
          window.location.reload(false);
        }}
      >
        <TfiReload size={25} />
      </div>
    </>
  );
}
