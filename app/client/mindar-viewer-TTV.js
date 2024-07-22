"use client";
import React, { useEffect, useRef } from "react";
import AFRAME from "aframe";
import "aframe";
import SplashScreen from "./assets/splash.gif";
import { TfiReload } from "react-icons/tfi";
import { createChromaMaterial } from "./assets/chroma-video";
// import "./assets/library/mind-ar-js-1.2.0/dist/mindar-image-aframe.prod.js";
//import {createChromaMaterial} from './assets/chroma-video.js';
// import "mind-ar/dist/mindar-image-aframe.prod.js";
// import "./aframeScript";

// const arrvid = [];
// const arra_vid = [];

export default function Test({ data }) {
  const sceneRef = useRef(null);
  const cameraViewRef = useRef(null);

  const constraints = {
    audio: false,
    video: {
      facingMode: "environment",
    },
  };

  const allData = [
    ...(data?.photos ?? []),
    ...(data?.images ?? []),
    ...(data?.icons ?? []),
    ...(data?.videos ?? []),
    ...(data?.text ?? []),
  ];
  useEffect(() => {
    // import(
    //   "./assets/library/mind-ar-js-1.2.0/dist/mindar-image-aframe.prod.js"
    // );
    // const sceneEl = sceneRef.current;
    // const arSystem = sceneEl.systems["mindar-image-system"];
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
        document.getElementById("anchor").appendChild(text);
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
          y: element.position.y,
          z: element.position.z,
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

        document.getElementById("anchor").appendChild(photo);
      } else if (element.type === "video") {
        video.setAttribute("id", `ele${element.id.substring(0, 5)}`);
        video.setAttribute("src", element.src);
        video.setAttribute("crossorigin", "anonymous");
        video.setAttribute("autoPlay", "false");
        document.getElementById("mainAssets").appendChild(video);
        // arrvid.push(video.attributes.id.value);
        // const texture = new window.THREE.VideoTexture(element.src);
        // const CromaVideo = createChromaMaterial(texture, 0x00ff00);
        // const preview = document.querySelector(
        //   `#ele${element.id.substring(0, 5)}`
        // );
        // const geometry = new window.THREE.PlaneGeometry(
        //   element.position.x,
        //   element.position.y
        // );
        // preview.setObject3D(
        //   "mesh",
        //   new window.THREE.Mesh(geometry, CromaVideo)
        // );

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
        document.getElementById("anchor").appendChild(aVideo);
        // arra_vid.push(video.attributes.id.value);
      } else {
        if (element?.geometry === "Circle") {
          circlePhoto.setAttribute("id", `ele${element.id.substring(0, 5)}`);
          circlePhoto.setAttribute("src", element.src);
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
          document.getElementById("anchor").appendChild(circlePhoto);
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
          document.getElementById("anchor").appendChild(photo);
        }
      }
    });
    // sceneEl.addEventListener("renderstart", () => {
    //   arSystem.start();
    // });
    // return () => {
    //   arSystem.stop();
    // };
    const cameraStart = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cameraViewRef.current) {
          cameraViewRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Oops. Something is broken.", error);
      }
    };

    cameraStart();
    return () => {
      const tracks = cameraViewRef.current?.srcObject?.getTracks();
      if (tracks) {
        tracks.forEach((track) => track.stop());
      }
    };
    // window.addEventListener("load", cameraStart, false);
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
      document.getElementById("card").setAttribute("visible", "true");
      document.getElementById("card").setAttribute("animation", {
        property: "opacity",
        to: 1,
        from: 0,
        autoplay: "true",
        dur: 500,
        easing: "linear",
        loop: "once",
      });
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
  if (!AFRAME.components['mytarget']) {
    AFRAME.registerComponent("mytarget", {
      init: function () {
        var lastIndex = -1;
        var COLORS = ["red", "green", "blue"];
        this.el.addEventListener("click", function (evt) {
          lastIndex = (lastIndex + 1) % COLORS.length;
          this.setAttribute("material", "color", COLORS[lastIndex]);
          console.log("I was clicked at: ", evt.detail.intersection.point);
        });
        document.getElementById("webcam").removeAttribute("hidden");
        document.getElementById("overlay_button").removeAttribute("class");
        const message = document.getElementById("message");
        message.innerHTML = "Tap/click on screen to start the experience";
        const anchor = document.querySelector("#anchor");
        // document.getElementById("splashScreen").setAttribute("hidden", "");
        // const message = document.getElementById("message");
        // message.setAttribute("scale", {
        //   x: window.devicePixelRatio / 2,
        //   y: window.devicePixelRatio / 2,
        //   z: 1,
        // });
        // message.setAttribute("position", {
        //   x: 0,
        //   y: -(window.innerHeight / 600),
        //   z: 1,
        // });
        // message.setAttribute("text", {
        //   value: "Tap/click on screen to start the experience",
        //   align: "center",
        //   anchor: "center",
        // });
        // const anchor = document.querySelector("#anchor");
        // anchor.setAttribute("scale", {
        //   //this is for mobile
        //   x: window.devicePixelRatio / 2.4,
        //   y: window.devicePixelRatio / 2.4,
        //   z: 1,
        // });
  
        //for chroma video
        // const videoMesh = document.getElementById(arrvid[0]);
        // const texture = new THREE.VideoTexture(videoMesh);
        // const video = createChromaMaterial(texture, 0xc7e96b); //The video and the collor to be removed from the video (default is green)
        // const preview = document.getElementById(arra_vid[0]);
        // const geometry = new THREE.PlaneGeometry(1, 0.55);
        // preview.setObject3D("mesh", new THREE.Mesh(geometry, video));
        //add a 'click' event listener to body.
  
        document.body.addEventListener("click", (e) => {
          if (e.target.id !== "") {
            if (!anchor.object3D.visible) {
              if (window.AFRAME.utils.device.isIOS()) {
                DeviceMotionEvent.requestPermission().then((permissionState) => {
                  if (permissionState === "granted") {
                    window.addEventListener("devicemotion", () => {});
                  }
                });
                DeviceMotionEvent.requestPermission().catch(console.error);
              }
              document
                .getElementsByTagName("a-camera")[0]
                .setAttribute(
                  "look-controls",
                  "enabled:true; magicWindowTrackingEnabled: true; touchEnabled: false; mouseEnabled:false"
                );
              message.innerHTML =
                "Tap/click on the buttons and icons to open links.<br> Tap/click on the video to toggle play/pause.";
              document.getElementById("clickArea").removeAttribute("class");
              hideContent();
              anchor.setAttribute("visible", "true");
              showCard();
              // reset.setAttribute("visible","true");
            }
            // else if(e.target.id == "reset"){
            //     //console.log();
            //     resetall();
            // }
          }
        });
      },
    });
  }


  return (
    <>
      <img id="splashScreen" src={SplashScreen} alt="Splash Screen"></img>
      <video id="webcam" ref={cameraViewRef} hidden autoPlay playsInline />
      <a-scene
        ref={sceneRef}
        // mindar-image={`

        //   uiLoading: #splashScreen;
        //   uiError: yes;
        //   uiScanning: yes;
        //   filterMinCF: 0.0000005;
        //   filterBeta: 0.005;
        // `}
        // uiLoading="#splashScreen"
        loading-screen="enabled:false;"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        <a-assets id="mainAssets">
          <img id="card" src={data.targetImage.src} />
        </a-assets>
        <a-camera
          position="0 0 0"
          look-controls="magicWindowTrackingEnabled: false; touchEnabled: false; mouseEnabled:false"
          cursor="fuse: false; rayOrigin: mouse;"
          raycaster="far: 999999; objects: .clickable"
        ></a-camera>

        <a-entity id="target" mytarget position="0 0 0">
          <a-plane
            id="clickArea"
            class="clickable"
            position="0 0 -2"
            scale="20 20 20"
            visible="false"
          ></a-plane>

          {/* <a-plane
            id="message"
            height="0.1"
            position="0 -1.5 0"
            text="value: Tap the screen to place the card; align: center; anchor: center"
            src="https://cdn.glitch.global/1a25e305-bb39-4235-9f92-b31c422cf9ee/Rectangle.png?v=1708409703436"
            opacity="0.6"
          ></a-plane> */}

          <a-entity
            id="anchor"
            // position="-0.45 1.25 -1.75"
            // scale="1.1 1.1 1.1"
            position="-0.5 0 -2"
            scale="1 1 1"
            visible="false"
          >
            <a-plane
              id="card"
              // opacity="0"
              // visible="false"
              scale={`${data?.targetImage?.scale?.x ?? 1} ${
                data?.targetImage?.scale?.y ?? 1
              } ${data?.targetImage?.scale?.z ?? 1}`}
              position="0 0 0"
              src="#card"
            ></a-plane>
          </a-entity>
        </a-entity>
      </a-scene>
      <div id="overlay">
        <span id="message">Tap the screen to place the card</span>
      </div>
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
