"use client";
import React, { useEffect, useRef, useState } from "react";
import AFRAME from "aframe";
import SplashScreen from "./assets/splash.gif";
import { TfiReload } from "react-icons/tfi";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import { FaShareAlt } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { TbHelpCircle } from "react-icons/tb";
// import Stats from "https://cdnjs.cloudflare.com/ajax/libs/stats.js/16/Stats.min.js"
import Screen from "./assets/svg/Splash-screen.svg";
import cover from "./assets/cover.webp";
import Rightbutton from "./assets/right.png";
import Leftbutton from "./assets/left.png";
import playIcon from "./assets/playIcon.svg";
import pauseIcon from "./assets/pauseIcon.svg";
import { createChromaMaterial } from "./assets/chroma-video.js";
import HelpBox from "./components/Help.jsx";
import ShareTray from "./components/share.jsx";
import scanIco from "./assets/svg/scanIco.svg";
import scanLogo from "./assets/svg/scanLogo.svg";

import axios from "axios";
import EnquiryFormModal from "./components/EnquiryModal.jsx";
const THREE = window.THREE;
const removeBG = [];
const icoModel = [];
let sv = false;
let vidBGRemoved = false;
let sceneCenter;
let sceneAngle;
let sceneScale;
let preAcc;

export default function Test({ data, brandLogo, loadingScreen, helperLogo }) {
  let isQueryModalOpen = false;
  let isArReady = false;
  let clickAreaActive = true;
  sceneCenter = data.centerPosition?.position
    ? data.centerPosition
    : { position: { x: 0, y: 0, z: 0 } };
  sceneAngle = data.centerPosition?.rotation
    ? data.centerPosition
    : { rotation: { x: 0, y: 0, z: 0 } };
  sceneScale = data.sceneScale?.changeScale
    ? data.sceneScale
    : { changeScale: false };
  const sceneRef = useRef(null);
  const allData = [
    ...(data?.photos ?? []),
    ...(data?.images ?? []),
    ...(data?.icons ?? []),
    ...(data?.documents ?? []),
    ...(data?.videos ?? []),
    ...(data?.text ?? []),
    ...(data?.model ?? []),
    ...(data?.carousel ?? []),
    ...(data?.resume ?? []),
  ];

  console.log("data: ", data);

  const FilterResumeData = (resume) => {
    let iconsArray = [];
    resume?.resumeData?.forEach((item) => {
      iconsArray.push(item);
    });

    return iconsArray;
  };

  useEffect(() => {
    const sceneEl = sceneRef.current;
    const arSystem = sceneEl.systems["mindar-image-system"];
    let photo = document.createElement("a-image");
    allData.forEach((element) => {
      let photo = document.createElement("a-image");
      let text = document.createElement("a-text");
      let model = document.createElement("a-gltf-model");
      let video = document.createElement("video");
      let aVideo = document.createElement("a-video");
      let circlePhoto = document.createElement("a-circle");
      let carouselEntity = document.createElement("a-entity");
      let resume = document.createElement("a-plane");

      if (element.type === "text") {
        text.setAttribute("id", `ele${element.id.substring(0, 5)}`);
        text.setAttribute("value", element.body);
        text.setAttribute("align", "center");
        text.setAttribute("anchor", "center");
        text.setAttribute("color", element.color);
        text.setAttribute("scale", {
          x: element.fontSize / 15,
          y: element.fontSize / 15,
          z: 1,
        });
        text.setAttribute("opacity", "0");
        text.setAttribute("position", {
          x: element.position.x + 0.1,
          y: -element.position.z,
          z: element.position.y,
        });
        text.setAttribute("rotation", {
          x: (element.rotation.x + 1.66) * 50,
          y: element.rotation.y * 50,
          z: element.rotation.z * 50,
        });
        document.getElementById("anchor").appendChild(text);
      } else if (element.type === "Group") {
        carouselEntity.setAttribute("id", `ele${element.id.substring(0, 5)}`);
        carouselEntity.setAttribute("position", {
          x: element.position.x,
          y: -element.position.z,
          z: element.position.y - 0.25,
        });

        carouselEntity.setAttribute("scale", {
          x: element.scale.x + 0.5,
          y: element.scale.z + 0.5,
          z: element.scale.y,
        });

        // carouselEntity.setAttribute('rotation',{x:element.rotation.x, y:
        //   element.rotation.y, z:element.rotation.z})
        const planes = [];

        let planeCount = element.children.length;
        console.log(planeCount);
        console.log(element.children);

        let isAnimating = false; // Flag to track animation state

        for (let i = 0; i < planeCount; i++) {
          if (element.children[i].type1 === "regular") {
            const plane = document.createElement("a-image");
            plane.setAttribute("position", { x: 0, y: 0, z: 0.085 - i / 200 });
            plane.setAttribute("height", "0.5");
            plane.setAttribute("width", "1");
            plane.setAttribute("id", `plane${i + 1}`);
            plane.setAttribute("src", `${element.children[i].src}`);
            plane.setAttribute("visible", i === 1 ? "true" : "false");
            // plane.setAttribute("material","transparent:false;");
            carouselEntity.appendChild(plane);
            planes.push(plane);
          }
        }
        planeCount = planeCount - 1;
        let currentIndex = 0;

        function movePlanes(direction) {
          if (isAnimating) return; // If animation is in progress, ignore the click
          isAnimating = true; // Set the flag to true as animation starts

          const nextIndex = (currentIndex + 1) % planeCount;
          const prevIndex = (currentIndex - 1 + planeCount) % planeCount;

          if (direction === "left") {
            planes[currentIndex].setAttribute("animation", {
              property: "position",
              to: { x: 1.05, y: 0, z: 0.085 },
              dur: 1000,
              easing: "easeInOutQuad",
            });

            planes[prevIndex].setAttribute("position", "-1.05 0 0.085");
            planes[prevIndex].setAttribute("visible", "true");
            planes[prevIndex].setAttribute("animation", {
              property: "position",
              to: { x: 0, y: 0, z: 0.085 },
              dur: 1000,
              easing: "easeInOutQuad",
            });

            currentIndex = prevIndex;
          } else if (direction === "right") {
            planes[currentIndex].setAttribute("animation", {
              property: "position",
              to: { x: -1.05, y: 0, z: 0.085 },
              dur: 1000,
              easing: "easeInOutQuad",
            });

            planes[nextIndex].setAttribute("position", "1.05 0 0.085");
            planes[nextIndex].setAttribute("visible", "true");
            planes[nextIndex].setAttribute("animation", {
              property: "position",
              to: { x: 0, y: 0, z: 0.085 },
              dur: 1000,
              easing: "easeInOutQuad",
            });

            currentIndex = nextIndex;
          }

          setTimeout(() => {
            planes.forEach((plane, index) => {
              if (index !== currentIndex) {
                plane.setAttribute("visible", "false");
                if (
                  plane.object3D.position.x == 1 ||
                  plane.object3D.position.x == -1
                ) {
                  plane.setAttribute("position", {
                    x: 0,
                    y: 0,
                    z: 0.085 - currentIndex / 200,
                  });
                }
              }
            });
            isAnimating = false; // Reset the flag after animation completes
          }, 1100);
        }

        const carouselControls = document.createElement("a-entity");
        carouselControls.setAttribute("id", `${carouselEntity.id}Controls`);
        carouselControls.setAttribute("position", "0 0 0.105");

        const rightbtn = document.createElement("a-image");
        rightbtn.setAttribute("position", "0.58 0 0");
        rightbtn.setAttribute("height", "0.2");
        rightbtn.setAttribute("width", "0.2");
        rightbtn.setAttribute("rotation", "0 0 0");
        // rightbtn.setAttribute("color", "#fff00f");
        rightbtn.setAttribute("class", "clickable");
        rightbtn.setAttribute("src", Rightbutton);
        rightbtn.addEventListener("click", () => {
          movePlanes("right");
        });
        carouselControls.appendChild(rightbtn);

        const leftbtn = document.createElement("a-image");
        leftbtn.setAttribute("position", "-0.58 0 0");
        leftbtn.setAttribute("height", "0.2");
        leftbtn.setAttribute("width", "0.2");
        leftbtn.setAttribute("rotation", "0 0 0");
        // leftbtn.setAttribute("color", "#0ff0f0");
        leftbtn.setAttribute("class", "clickable");
        leftbtn.setAttribute("src", Leftbutton);
        leftbtn.addEventListener("click", () => {
          movePlanes("left");
        });
        carouselControls.appendChild(leftbtn);

        const leftInvisible = document.createElement("a-plane");
        leftInvisible.setAttribute("position", "-1.090 0 -0.01");
        leftInvisible.setAttribute("rotation", "0 0 0");
        leftInvisible.setAttribute("width", "1.150");
        leftInvisible.setAttribute("height", "0.6");
        leftInvisible.setAttribute("material", {
          blending: "additive",
          shader: "standard",
          side: "double",
          transparent: false,
          src: cover.toString(),
          // opacity: 0.0
        });
        // leftInvisible.setAttribute('opacity', '0');
        carouselControls.appendChild(leftInvisible);

        const rightInvisible = document.createElement("a-plane");
        rightInvisible.setAttribute("position", "1.090 0 -0.01");
        rightInvisible.setAttribute("rotation", "0 0 0");
        rightInvisible.setAttribute("width", "1.150");
        rightInvisible.setAttribute("height", "0.6");
        rightInvisible.setAttribute("material", {
          blending: "additive",
          shader: "standard",
          side: "double",
          transparent: false,
          src: cover.toString(),
          // opacity: 0.0
        });
        // leftInvisible.setAttribute('opacity', '0');
        carouselControls.appendChild(rightInvisible);

        carouselEntity.appendChild(carouselControls);
        document.getElementById("anchor").appendChild(carouselEntity);
      } else if (element.type === "icons") {
        // console.log(element);
        function checkExtension(url) {
          const extension = url.split(".").pop().toLowerCase();
          const support = ["gltf", "glb"];
          if (support.includes(extension)) {
            model.setAttribute("id", `ele${element.id.substring(0, 5)}`);
            model.setAttribute("src", element.src + "?not-from-cache-please");
            model.setAttribute("class", "clickable");
            model.setAttribute("model-relative-opacity", "");
            if (element.isAnimation) {
              model.setAttribute("animation__2", {
                property: "model-relative-opacity.opacity",
                from: 1,
                to: 0,
                dur: 1,
                loop: "once",
                easing: "linear",
              });
            }
            model.setAttribute("scale", {
              x: element.scale.x,
              y: element.scale.y + 0.1,
              z: element.scale.z,
            });
            model.setAttribute("position", {
              x: element.position.x,
              y: -element.position.z,
              z: element.position.y,
            });
            model.setAttribute("rotation", {
              x: (element.rotation.x - 3) * -5 + 90,
              y: element.rotation.y * -10,
              z: element.rotation.z * -10,
            });
            icoModel.push(String(model.attributes.id.value));
            if (element?.isvCard) {
              model.addEventListener("click", async function (evt) {
                const response = await axios.post(
                  "https://sandboxapi.immarsify.com/api/ar/createVCF",
                  { data: element?.vCardJson },
                  { responseType: "blob" }
                );
                const blob = new Blob([response?.data]);
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download = `${
                  element?.vCardJson?.firstName.trim() +
                  "_" +
                  element?.vCardJson?.lastName.trim()
                }.vcf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              });
            } else {
              element?.isLink &&
                model.addEventListener("click", function (evt) {
                  if (evt.detail.cursorEl.id === "cursor") {
                    let link = document.createElement("a");
                    window.document.body.appendChild(link);
                    link.href = element?.iconLink;
                    link.target = "_blank";
                    console.log(link);
                    link.click();
                    link.remove();
                  }
                  // window.open(element?.iconLink, "_blank");
                });
            }
            document.getElementById("anchor").appendChild(model);
          } else {
            photo.setAttribute("id", `ele${element.id.substring(0, 5)}`);
            photo.setAttribute("src", element.src + "?not-from-cache-please");
            photo.setAttribute("class", "clickable");
            photo.setAttribute("opacity", "0");
            photo.setAttribute("scale", {
              x: element.scale.x,
              y: element.scale.y,
              z: 1,
            });
            photo.setAttribute("position", {
              x: element.position.x,
              y: -element.position.z,
              z: element.position.y,
            });
            photo.setAttribute("rotation", {
              x: (element.rotation.x + 1.571) * 50,
              y: element.rotation.y * 50,
              z: element.rotation.z * 50,
            });
            if (element?.isvCard) {
              photo.addEventListener("click", async function (evt) {
                const response = await axios.post(
                  "https://sandboxapi.immarsify.com/api/ar/createVCF",
                  { data: element?.vCardJson },
                  { responseType: "blob" }
                );

                // console.log(response);
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const a = document.createElement("a");
                a.href = url;
                a.download = `${element?.vCardJson?.firstName}-${element?.vCardJson?.lastName}.vcf`; // Specify the default filename for download
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              });
            } else {
              element?.isLink &&
                photo.addEventListener("click", function (evt) {
                  if (evt.detail.cursorEl.id === "cursor") {
                    let link = document.createElement("a");
                    window.document.body.appendChild(link);
                    link.href = element?.iconLink;
                    link.target = "_blank";
                    console.log(link);
                    link.click();
                    link.remove();
                  }
                  // window.open(element?.iconLink, "_blank");
                });
            }
            document.getElementById("anchor").appendChild(photo);
          }
        }
        checkExtension(element.src);
      }

      //  else if (element.type === "video") {
      // }
      else if (element.type === "resume") {
        console.log("element: ", element);

        function trimText(text, limit) {
          if (text.length <= limit) {
            return text;
          }
          return text.substring(0, limit) + "...";
        }

        function trimAndUppercaseText(text, limit) {
          if (text.length <= limit) {
            return text.toUpperCase();
          }
          return text.substring(0, limit).toUpperCase() + "...";
        }

        const DESCRIPTION_LIMIT = 700; // Set the character limit for the description

        const IconsArray = FilterResumeData(element);
        console.log("IconsArray: ", IconsArray);

        // Create a transparent parent entity
        const parentEntity = document.createElement("a-entity");
        parentEntity.setAttribute("position", {
          x: element.position.x,
          y: element.position.y,
          z: element.position.z,
        });
        parentEntity.setAttribute("scale", {
          x: element.scale.x,
          y: element.scale.y,
          z: 1,
        });
        parentEntity.setAttribute("rotation", {
          x: (element.rotation.x + 1.571) * 50,
          y: element.rotation.y * 50,
          z: element.rotation.z * 50,
        });
        parentEntity.setAttribute("id", `ele${element.id.substring(0, 5)}`);
        // Create the main resume plane

        const testResume = document.createElement("a-plane");
        testResume.setAttribute("height", "0.5");
        testResume.setAttribute("width", "1.4");

        testResume.setAttribute("id", `resume_data`);
        // testResume.setAttribute('src', 'https://static.vecteezy.com/system/resources/previews/001/874/132/original/abstract-geometric-white-background-free-vector.jpg');
        // testResume.setAttribute('src', 'https://png.pngtree.com/thumb_back/fw800/back_our/20190620/ourmid/pngtree-men-s-promotional-geometric-simple-background-material-image_161335.jpg');
        // Create background for header
        const headerBgBackground = document.createElement("a-plane");
        headerBgBackground.setAttribute("height", "0.122"); // Adjust height to cover the headerBg
        headerBgBackground.setAttribute("width", "1.4"); // Adjust width to cover the headerBg
        headerBgBackground.setAttribute("color", "#1b3d4f"); // Background color
        headerBgBackground.setAttribute("position", "0 0.184 0.005"); // Slightly behind headerBg
        testResume.appendChild(headerBgBackground);

        // Create header background
        const headerBg = document.createElement("a-plane");
        headerBg.setAttribute("height", "0.12");
        headerBg.setAttribute("width", "1.4");
        headerBg.setAttribute("color", "white");
        headerBg.setAttribute("position", "0.0 0.188 0.01");
        testResume.appendChild(headerBg);

        // Create initial resume title
        const resumeTitle = document.createElement("a-text");
        resumeTitle.setAttribute("position", "-0.64 0.21 0.01");
        resumeTitle.setAttribute("rotation", "0 0 0");

        resumeTitle.setAttribute(
          "value",
          element?.resumeData
            ? trimAndUppercaseText(element?.resumeData[0]?.title, 35)
            : ""
        );
        resumeTitle.setAttribute("wrap-count", "45");
        resumeTitle.setAttribute(
          "font",
          "https://cdn.aframe.io/fonts/Aileron-Semibold.fnt"
        );
        resumeTitle.setAttribute("color", "#1b3d4f");
        resumeTitle.setAttribute("align", "left");
        resumeTitle.setAttribute("anchor", "left");
        resumeTitle.setAttribute("lineHeight", "11");
        resumeTitle.setAttribute("class", "clickable");
        resumeTitle.setAttribute("baseline", "top");
        resumeTitle.setAttribute("scale", "0.26 0.21 0.28");
        testResume.appendChild(resumeTitle);

        // Create initial resume description
        const resumeDescription = document.createElement("a-text");
        resumeDescription.setAttribute("position", "-0.64 0.09 0.01");
        resumeDescription.setAttribute("lineHeight", "30");

        resumeDescription.setAttribute("rotation", "0 0 0");
        resumeDescription.setAttribute(
          "value",

          element.resumeData
            ? trimText(element.resumeData[0].description, DESCRIPTION_LIMIT)
            : ""
        );
        resumeDescription.setAttribute("wrap-count", "69");
        // resumeDescription.setAttribute("font", "https://cdn.aframe.io/fonts/Aileron-Semibold.fnt");
        resumeDescription.setAttribute("color", "black");
        resumeDescription.setAttribute("align", "left");
        resumeDescription.setAttribute("anchor", "left");
        resumeDescription.setAttribute("baseline", "top");
        resumeDescription.setAttribute("scale", "0.25 0.21 0.1");
        testResume.appendChild(resumeDescription);

        // Create a plane for the icons
        const iconsPlane = document.createElement("a-plane");
        iconsPlane.setAttribute("width", "0.2");
        iconsPlane.setAttribute("height", "1");
        iconsPlane.setAttribute("material", {
          opacity: 0,
        });
        iconsPlane.setAttribute("position", "-0.79 -0.235 0");

        IconsArray.forEach((item, index) => {
          const iconBg = document.createElement("a-plane");
          let gapBetweenIcons = -0.08;
          iconBg.setAttribute("width", "0.15");
          iconBg.setAttribute("height", "0.07");
          iconBg.setAttribute("opacity", ` ${index === 0 ? "1" : "0.8"}`); // Change to the desired background color
          iconBg.setAttribute(
            "position",
            `0 ${0.45 + index * gapBetweenIcons} 0.005`
          );
          // iconBg.setAttribute("visible", "false"); // Initially hidden
          iconsPlane.appendChild(iconBg);

          const resumeIcon = document.createElement("a-image");
          resumeIcon.setAttribute("src", item.icon.src);

          resumeIcon.setAttribute(
            "position",
            `0 ${0.45 + index * gapBetweenIcons} 0.01`
          );
          resumeIcon.setAttribute("scale", "0.08 0.05 0.1");
          resumeIcon.setAttribute("class", "clickable");

          resumeIcon.addEventListener("click", (e) => {
            console.log("click: ", e);
            resumeTitle.setAttribute(
              "value",
              trimAndUppercaseText(item.title, 35)
            );
            resumeDescription.setAttribute(
              "value",
              trimText(item.description, DESCRIPTION_LIMIT)
            );

            // Set all icon backgrounds to hidden
            iconsPlane
              .querySelectorAll("a-plane")
              .forEach((bg) => bg.setAttribute("opacity", "0.8"));

            // Show the background for the clicked icon
            iconBg.setAttribute("opacity", "1");
          });

          iconsPlane.appendChild(resumeIcon);
        });

        const SocialIconPlane = document.createElement("a-plane");
        SocialIconPlane.setAttribute("width", "0.2");
        SocialIconPlane.setAttribute("height", "1");
        SocialIconPlane.setAttribute("material", {
          opacity: 0,
        });
        SocialIconPlane.setAttribute("position", "0.79 -0.235 0");
        const SocialIconsArray = [
          {
            icon: {
              src: "https://img.icons8.com/?size=100&id=118497&format=png&color=000000",
            },
          },
          {
            icon: {
              src: "https://img.icons8.com/?size=100&id=111057&format=png&color=000000",
            },
          },
          {
            icon: {
              src: "https://img.icons8.com/?size=100&id=13930&format=png&color=000000",
            },
          },
          {
            icon: {
              src: "https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000",
            },
          },
        ];

        SocialIconsArray.forEach((item, index) => {
          const iconBg = document.createElement("a-plane");
          let gapBetweenIcons = -0.08;
          iconBg.setAttribute("width", "0.15");
          iconBg.setAttribute("height", "0.07");
          iconBg.setAttribute("color", ` ${index === 0 ? "#fff" : "#fff"}`); // Change to the desired background color
          iconBg.setAttribute(
            "position",
            `0 ${0.45 + index * gapBetweenIcons} 0.005`
          );
          // iconBg.setAttribute("visible", "false"); // Initially hidden
          SocialIconPlane.appendChild(iconBg);

          const resumeIcon = document.createElement("a-image");
          resumeIcon.setAttribute("src", item.icon.src);

          resumeIcon.setAttribute(
            "position",
            `0 ${0.45 + index * gapBetweenIcons} 0.01`
          );
          resumeIcon.setAttribute("scale", "0.08 0.05 0.1");
          resumeIcon.setAttribute("class", "clickable");

          // resumeIcon.addEventListener("click", (e) => {
          //     console.log("click: ", e);
          //     resumeTitle.setAttribute("value", trimAndUppercaseText(item.title, 35));
          //     resumeDescription.setAttribute("value", trimText(item.description, DESCRIPTION_LIMIT));

          //     // Set all icon backgrounds to hidden
          //     iconsPlane.querySelectorAll("a-plane").forEach(bg => bg.setAttribute("color", "white"));

          //     // Show the background for the clicked icon
          //     iconBg.setAttribute("color", "#0073cf");
          // });

          SocialIconPlane.appendChild(resumeIcon);
        });

        // Append the resume and icons planes to the parent entity
        parentEntity.appendChild(testResume);
        parentEntity.appendChild(iconsPlane);
        // parentEntity.appendChild(SocialIconPlane);

        // Append the parent entity to the scene
        document.getElementById("anchor").appendChild(parentEntity);
      } else if (element.type === "video") {
        video.setAttribute("id", `ele${element.id.substring(0, 5)}`);
        video.setAttribute("src", element.src + "?not-from-cache-please");
        video.setAttribute("crossorigin", "anonymous");
        video.setAttribute("autoPlay", "false");
        video.setAttribute("preload", "true");
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.setAttribute("loop", "true");
        video.muted = element.vsettings.muted;
        document.getElementById("anchor").appendChild(video);
        if (element.vsettings.removeBg) {
          removeBG.push(String(video.attributes.id.value));
        }
        aVideo.setAttribute("id", `ele${element.id.substring(0, 5)}a_video`);
        aVideo.setAttribute("src", `#ele${element.id.substring(0, 5)}`);
        aVideo.setAttribute("opacity", "0");
        aVideo.setAttribute("class", "clickable");
        aVideo.setAttribute("position", {
          x: element.position.x,
          y: element.position.y,
          z: -element.position.z,
        });
        aVideo.setAttribute("scale", {
          x: element.scale.x,
          y: element.scale.y,
          z: 1,
        });
        aVideo.setAttribute("rotation", {
          x: (element.rotation.x + 1.571) * 50,
          y: element.rotation.y * 50,
          z: element.rotation.z * 50,
        });
        // const playButton = document.createElement("a-image");
        // playButton.setAttribute("id",`ele${element.id.substring(0, 5)}play`);
        // playButton.setAttribute("src",playIcon);
        // playButton.setAttribute("material"," transparent:true;opacity:0.9;blending:additive");
        // playButton.setAttribute("geometry",`primitive: circle; radius: 0.35`);
        // if(element.scale.x >= element.scale.y){
        //   playButton.setAttribute("scale",{
        //     x: (element.scale.x - element.scale.y)/2,
        //     y: element.scale.y/2,
        //     z: 1,
        //   });
        // }else{
        //   playButton.setAttribute("scale",{
        //     x: element.scale.x/2,
        //     y: (element.scale.y - element.scale.x)/2,
        //     z: 1,
        //   });
        // }
        // playButton.setAttribute("position","0 0 0.1");
        // aVideo.appendChild(playButton);

        // const pauseButton = document.createElement("a-image");
        // pauseButton.setAttribute("id",`ele${element.id.substring(0, 5)}pause`);
        // pauseButton.setAttribute("src",pauseIcon);
        // pauseButton.setAttribute("geometry",`primitive: circle; radius: 0.35`);
        // pauseButton.setAttribute("material"," transparent:true;opacity:0.9;blending:normal");
        // if(element.scale.x >= element.scale.y){
        //   pauseButton.setAttribute("scale",{
        //     x: (element.scale.x - element.scale.y)/2,
        //     y: element.scale.y/2,
        //     z: 1,
        //   });
        // }else{
        //   pauseButton.setAttribute("scale",{
        //     x: element.scale.x/2,
        //     y: (element.scale.y - element.scale.x)/2,
        //     z: 1,
        //   });
        // }
        // pauseButton.setAttribute("position","0 0 0.1");
        // aVideo.appendChild(pauseButton);

        //add play and pause icons as children with unique id
        document.getElementById("anchor").appendChild(aVideo);
      } else if (element.type === "Model3d") {
        function checkExtension(url) {
          const extension = url.split(".").pop().toLowerCase();
          const support = ["gltf", "glb"];
          if (support.includes(extension)) {
            model.setAttribute("id", `ele${element.id.substring(0, 5)}`);
            model.setAttribute("src", element.src + "?not-from-cache-please");
            model.setAttribute("class", "clickable");
            model.setAttribute("model-relative-opacity", "");
            if (element.isAnimation) {
              model.setAttribute("animation__2", {
                property: "model-relative-opacity.opacity",
                from: 1,
                to: 0,
                dur: 1,
                loop: "once",
                easing: "linear",
              });
            }
            model.setAttribute("scale", {
              x: element.scale.x,
              y: element.scale.y + 0.1,
              z: element.scale.z,
            });
            model.setAttribute("position", {
              x: element.position.x,
              y: -element.position.z,
              z: element.position.y,
            });
            model.object3D.rotation.set(
              element.rotation.x,
              element.rotation.z,
              -element.rotation.y
            );
            icoModel.push(String(model.attributes.id.value));
            document.getElementById("anchor").appendChild(model);
          }
        }
        checkExtension(element.src);
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
            y: -element.position.z,
            z: element.position.y,
          });
          circlePhoto.setAttribute("scale", {
            x: element.scale.x / 2,
            y: element.scale.y / 2,
            z: 1,
          });
          circlePhoto.setAttribute("rotation", {
            x: (element.rotation.x + 1.571) * 50,
            y: element.rotation.y * 50,
            z: element.rotation.z * 50,
          });
          document.getElementById("anchor").appendChild(circlePhoto);
        } else {
          photo.setAttribute("id", `ele${element.id.substring(0, 5)}`);
          photo.setAttribute("src", element.src + "?not-from-cache-please");
          photo.setAttribute("opacity", "0");
          photo.setAttribute("position", {
            x: element.position.x,
            y: -element.position.z,
            z: element.position.y,
          });
          photo.setAttribute("scale", {
            x: element.scale.x,
            y: element.scale.y,
            z: 1,
          });
          photo.setAttribute("rotation", {
            x: (element.rotation.x + 1.571) * 50,
            y: element.rotation.y * 50,
            z: element.rotation.z * 50,
          });
          document.getElementById("anchor").appendChild(photo);
        }
      }
    });

    if (data.targetImage.src) {
      photo.setAttribute("id", `target`);
      photo.setAttribute(
        "src",
        data.targetImage.src + "?not-from-cache-please"
      );
      document.getElementById("mainAssets").appendChild(photo);
    }

    sceneEl.addEventListener("renderstart", () => {
      arSystem.start();
    });
    // return () => {
    //   // if (arSystem) {
    //   //   arSystem.stop();
    //   // }
    // };
  }, []);

  const hideContent = () => {
    allData.forEach((element) => {
      console.log(element, "this is selement ");
      let currentDoc = document.querySelector(
        `#ele${element.id.substring(0, 5)}`
      );
      console.log(
        currentDoc,
        element.id.substring(0, 5),
        "this si current docuemnt "
      );

      console.log("currentDoc-->", currentDoc);
      currentDoc.setAttribute("opacity", "0");
      currentDoc.setAttribute("visible", "false");
      if (element.type === "video") {
        currentDoc.pause();
        currentDoc.currentTime = 0.1;
      }
    });
  };

  function showMenu() {
    // console.log("pressed menu");
    const menu = document.getElementById("menu");
    // console.log("pressed ", menu);
    if (menu.attributes.hidden) {
      // console.log(menu.attributes.hidden);
      menu.removeAttribute("hidden");
    } else {
      // console.log(menu.attributes.hidden);
      menu.setAttribute("hidden", "");
    }
  }
  function showEnquiry() {
    // console.log("pressed menu");
    document.getElementById("enquiryModal").style.display = "flex";
    // console.log("pressed ", menu);
  }

  function showShareTray() {
    // console.log("pressed menu");
    const sTray = document.getElementById("shareTray");
    // console.log("pressed ", menu);
    if (sTray.attributes.hidden) {
      // console.log(menu.attributes.hidden);
      sTray.removeAttribute("hidden");
    } else {
      // console.log(menu.attributes.hidden);
      sTray.setAttribute("hidden", "");
    }
  }

  const showCard = () => {
    const anchor = document.querySelector("#anchor");
    anchor.setAttribute("visible", "true");
    anchor.object3D.children.forEach((items) => {
      items.el.setAttribute("opacity", "0");
    });
    const hideTCard = data?.targetImage?.isHidden
      ? data.targetImage.isHidden
      : false;
    if (!hideTCard) {
      document.getElementById("card").setAttribute(`animation__2`, {
        property: "opacity",
        to: "1",
        from: "0",
        autoplay: "true",
        dur: 500,
        loop: "once",
        easing: "linear",
      });
    } else {
      document.getElementById("card").setAttribute("visible", "false");
    }
    allData.forEach((element, idx) => {
      let currentDoc = document.querySelector(
        `#ele${element.id.substring(0, 5)}`
      );

      if (element.type === "video") {
        setTimeout(() => {
          currentDoc.play();
          if (currentDoc.paused) {
            const playButton = document.createElement("a-image");
            playButton.setAttribute(
              "id",
              `ele${element.id.substring(0, 5)}play`
            );
            playButton.setAttribute("src", playIcon);
            playButton.setAttribute(
              "material",
              " transparent:true;opacity:0.9;blending:additive"
            );
            playButton.setAttribute(
              "geometry",
              `primitive: circle; radius: 0.35`
            );
            if (element.scale.x >= element.scale.y) {
              playButton.setAttribute("scale", {
                x: (element.scale.x - element.scale.y) / 2,
                y: element.scale.y / 2,
                z: 1,
              });
            } else {
              playButton.setAttribute("scale", {
                x: element.scale.x / 2,
                y: (element.scale.y - element.scale.x) / 2,
                z: 1,
              });
            }
            playButton.setAttribute("position", "0 0 0.1");
            avideo.appendChild(playButton);
          }
          currentDoc.setAttribute("visible", "true");
          currentDoc.setAttribute("loop", "");
          let avideo = document.querySelector(
            `#ele${element.id.substring(0, 5)}a_video`
          );
          avideo.addEventListener("click", function (evt) {
            const playButton = document.createElement("a-image");
            playButton.setAttribute(
              "id",
              `ele${element.id.substring(0, 5)}play`
            );
            playButton.setAttribute("src", playIcon);
            playButton.setAttribute(
              "material",
              " transparent:true;opacity:0.9;blending:additive"
            );
            playButton.setAttribute(
              "geometry",
              `primitive: circle; radius: 0.35`
            );
            if (element.scale.x >= element.scale.y) {
              playButton.setAttribute("scale", {
                x: (element.scale.x - element.scale.y) / 2,
                y: element.scale.y / 2,
                z: 1,
              });
            } else {
              playButton.setAttribute("scale", {
                x: element.scale.x / 2,
                y: (element.scale.y - element.scale.x) / 2,
                z: 1,
              });
            }
            playButton.setAttribute("position", "0 0 0.1");

            const pauseButton = document.createElement("a-image");
            pauseButton.setAttribute(
              "id",
              `ele${element.id.substring(0, 5)}pause`
            );
            pauseButton.setAttribute("src", pauseIcon);
            pauseButton.setAttribute(
              "material",
              " transparent:true;opacity:0.9;blending:additive"
            );
            pauseButton.setAttribute(
              "geometry",
              `primitive: circle; radius: 0.35`
            );
            if (element.scale.x >= element.scale.y) {
              pauseButton.setAttribute("scale", {
                x: (element.scale.x - element.scale.y) / 2,
                y: element.scale.y / 2,
                z: 1,
              });
            } else {
              pauseButton.setAttribute("scale", {
                x: element.scale.x / 2,
                y: (element.scale.y - element.scale.x) / 2,
                z: 1,
              });
            }
            pauseButton.setAttribute("position", "0 0 0.1");

            if (evt.detail.cursorEl.id === "cursor") {
              if (currentDoc.paused) {
                currentDoc.play();
                if (
                  document.getElementById(
                    `ele${element.id.substring(0, 5)}play`
                  )
                ) {
                  avideo.removeChild(
                    document.getElementById(
                      `ele${element.id.substring(0, 5)}play`
                    )
                  );
                }
                avideo.appendChild(pauseButton);
                setTimeout(() => {
                  avideo.removeChild(
                    document.getElementById(
                      `ele${element.id.substring(0, 5)}pause`
                    )
                  );
                }, 1500);
                //hide play icon
                //show pause icon for 1.5 sec then hide
              } else if (!currentDoc.paused) {
                currentDoc.pause();
                if (
                  document.getElementById(
                    `ele${element.id.substring(0, 5)}pause`
                  )
                ) {
                  avideo.removeChild(
                    document.getElementById(
                      `ele${element.id.substring(0, 5)}pause`
                    )
                  );
                }
                avideo.appendChild(playButton);
                //show play icon
              } else {
                currentDoc.play();
              }
            }
          });
          avideo.setAttribute(`animation`, {
            property: "position",
            to: {
              x: element.position.x,
              y: -element.position.z,
              z: element.position.y || -0.05,
            },
            from: {
              x:
                element?.animation?.direction === "leftToRight"
                  ? element.position.x - element.scale.y
                  : element?.animation?.direction === "rightToLeft"
                  ? element.position.x + element.scale.y
                  : element.position.x,
              y:
                element?.animation?.direction === "topToBottom"
                  ? -element.position.z + element.scale.y
                  : element?.animation?.direction === "bottomToTop"
                  ? -element.position.z - element.scale.y
                  : -element.position.z,
              z: element.position.y || -0.05,
            },
            autoplay: "true",
            dur: element?.animation?.duration,
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
        }, element?.animation?.delay);
      } else if (
        element.type === "icons" ||
        element.type === "documents" ||
        element.type === "Model3d"
      ) {
        // console.log(element);
        let node = document.getElementById(`ele${element.id.substring(0, 5)}`);
        // console.log("3D fade anim",node.object3D);
        if (node.tagName === "A-GLTF-MODEL") {
          node.setAttribute("visible", "true");
          node.setAttribute(`animation`, {
            property: "position",
            to: {
              x: element.position.x,
              y: -element.position.z,
              z: element.position.y || -0.05,
            },
            from: {
              x:
                element?.animation?.direction === "leftToRight"
                  ? element.position.x - element.scale.y
                  : element?.animation?.direction === "rightToLeft"
                  ? element.position.x + element.scale.y
                  : element.position.x,
              y:
                element?.animation?.direction === "topToBottom"
                  ? -element.position.z + element.scale.y
                  : element?.animation?.direction === "bottomToTop"
                  ? -element.position.z - element.scale.y
                  : -element.position.z,
              z: element.position.y || -0.05,
            },
            autoplay: "true",
            dur: element?.animation?.duration,
            delay: element?.animation?.delay,
            easing: "linear",
            loop: "once",
          });
          node.setAttribute("animation__02", {
            property: "model-relative-opacity.opacity",
            from: 0,
            to: 1,
            dur: element?.animation?.duration * 2,
            delay: element?.animation?.delay,
            loop: "once",
            easing: "linear",
          });
        }
        currentDoc.setAttribute("visible", "true");
        currentDoc.setAttribute(`animation`, {
          property: "position",
          to: {
            x: element.position.x,
            y: -element.position.z,
            z: element.position.y || -0.05,
          },
          from: {
            x:
              element?.animation?.direction === "leftToRight"
                ? element.position.x - element.scale.y
                : element?.animation?.direction === "rightToLeft"
                ? element.position.x + element.scale.y
                : element.position.x,
            y:
              element?.animation?.direction === "topToBottom"
                ? -element.position.z + element.scale.y
                : element?.animation?.direction === "bottomToTop"
                ? -element.position.z - element.scale.y
                : -element.position.z,
            z: element.position.y || -0.05,
          },
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
      } else if (element.isAnimation) {
        // console.log("element", element);
        currentDoc.setAttribute("visible", "true");
        currentDoc.setAttribute(`animation`, {
          property: "position",
          to: {
            x: element.position.x,
            y: -element.position.z,
            z: element.position.y || -0.05,
          },
          from: {
            x:
              element?.animation?.direction === "leftToRight"
                ? element.position.x - element.scale.y
                : element?.animation?.direction === "rightToLeft"
                ? element.position.x + element.scale.y
                : element.position.x,
            y:
              element?.animation?.direction === "topToBottom"
                ? -element.position.z + element.scale.y
                : element?.animation?.direction === "bottomToTop"
                ? -element.position.z - element.scale.y
                : -element.position.z,
            z: element.position.y || -0.05,
          },
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
      } else {
        currentDoc.setAttribute("visible", "true");
        currentDoc.setAttribute("opacity", 1);
      }
    });
  };

  const setPosition = (e) => {
    const anchor = document.querySelector("#anchor");
    const clickArea = document.getElementById("clickArea");
    // console.log("here", e);
    document
      .getElementsByTagName("a-camera")[0]
      .object3D.attach(clickArea.object3D);
    if (e.detail.intersection !== null) {
      // console.log("here", e.detail.intersection);
      const point = e.detail.intersection.point;
      // console.log(sceneCenter);
      if (sv === false) {
        anchor.object3D.position.set(0, 0, -1.875);
      } else if (sv === true) {
        anchor.object3D.position.set(0, 0, -24.43);
      }

      clickArea.object3D.rotation.set(0, 0, 0);
      if (sv === false) {
        anchor.setAttribute("scale", "0.25 0.25 0.3");
      } else if (sv === true) {
        anchor.setAttribute("scale", "3 3 3");
      }
    }
  };

  const showScene = () => {
    const message = document.getElementById("message-text");
    const anchor = document.querySelector("#anchor");
    message.innerHTML =
      "Tap on the video to toggle play/pause.<br>Tap on the buttons and icons to open links.<br>Tap on an empty area to move the scene.";

    hideContent();
    anchor.setAttribute("visible", "true");
    document.getElementById("card").setAttribute("src", "#target");
    // document.getElementById("card").setAttribute("height",`${document.getElementById("target").height /600}`);
    // document.getElementById("card").setAttribute("width",`${document.getElementById("target").width /600}`);
    showCard();
    setTimeout(() => {
      document
        .getElementsByTagName("a-camera")[0]
        .setAttribute("cursor", "fuse: false;");
      document
        .getElementsByTagName("a-camera")[0]
        .setAttribute("raycaster", "far: 999999; objects: .click-to-place;");
      document
        .getElementById("cursor")
        .setAttribute("raycaster", "far: 999999; objects: .clickable;");
      document
        .getElementById("cursor")
        .setAttribute("cursor", "fuse: false; rayOrigin: mouse;");
    }, 2000);
  };

  const gyroMove = () => {
    const anchor = document.querySelector("#anchor");
    const clickArea = document.getElementById("clickArea");
    window.removeEventListener("devicemotion", gRotation);
    const wPos = new THREE.Vector3();
    document
      .getElementsByTagName("a-camera")[0]
      .object3D.getWorldPosition(wPos);
    // console.log(wPos);
    anchor.object3D.lookAt(wPos);
    if (sv === false) {
      anchor.object3D.position.set(
        -sceneCenter.position.x / 4,
        sceneCenter.position.z / 4,
        -1.875
      );
      anchor.object3D.rotation.set(
        -sceneAngle.rotation.x * 50,
        sceneAngle.rotation.z * 50,
        sceneAngle.rotation.y * 50
      );
    } else if (sv === true) {
      anchor.object3D.position.set(
        -sceneCenter.position.x * 3,
        sceneCenter.position.z * 3,
        -24.43
      );
      anchor.object3D.rotation.set(
        -sceneAngle.rotation.x * 50,
        sceneAngle.rotation.z * 50,
        sceneAngle.rotation.y * 50
      );
    }

    window.addEventListener("devicemotion", gRotation);
  };

  const gRotation = (evt) => {
    const anchor = document.querySelector("#anchor");
    const clickArea = document.getElementById("clickArea");

    const aVelocity = {
      x: (evt.rotationRate.alpha * 57.3) / 1600,
      y: (evt.rotationRate.beta * 57.3) / 1600,
      z: (evt.rotationRate.gamma * 57.3) / 1600,
    };

    if (sv === false) {
      if (anchor.object3D.visible) {
        if (clickAreaActive === true) {
          // console.log(evt);

          if (aVelocity.x > 0.25 || aVelocity.x < -0.25) {
            // console.log(`Angular velocity along the X-axis ${aVelocity.x}`);
            anchor.object3D.position.set(
              anchor.object3D.position.x,
              anchor.object3D.position.y - aVelocity.x / 240,
              anchor.object3D.position.z
            );
            clickArea.object3D.rotation.set(
              clickArea.object3D.rotation.x - aVelocity.x / 240,
              clickArea.object3D.rotation.y,
              clickArea.object3D.rotation.z
            );
          }
          if (aVelocity.y > 0.25 || aVelocity.y < -0.25) {
            // console.log(`Angular velocity along the Y-axis ${aVelocity.y}`);
            anchor.object3D.position.set(
              anchor.object3D.position.x + aVelocity.y / 240,
              anchor.object3D.position.y,
              anchor.object3D.position.z
            );
            clickArea.object3D.rotation.set(
              clickArea.object3D.rotation.x,
              clickArea.object3D.rotation.y - aVelocity.y / 240,
              clickArea.object3D.rotation.z
            );
          }
          if (aVelocity.z > 0.25 || aVelocity.z < -0.25) {
            // console.log(`Angular velocity along the Z-axis ${aVelocity.z}`);
            anchor.object3D.position.set(
              anchor.object3D.position.x,
              anchor.object3D.position.y,
              anchor.object3D.position.z - aVelocity.z / 480
            );
            clickArea.object3D.rotation.set(
              clickArea.object3D.rotation.x,
              clickArea.object3D.rotation.y,
              clickArea.object3D.rotation.z - aVelocity.z / 480
            );
          }
        }
      }
    } else if (sv === true) {
      if (anchor.object3D.visible) {
        if (clickAreaActive === true) {
          // console.log(evt);

          if (aVelocity.x > 0.25 || aVelocity.x < -0.25) {
            // console.log(`Angular velocity along the X-axis ${aVelocity.x}`);
            anchor.object3D.position.set(
              anchor.object3D.position.x,
              anchor.object3D.position.y - aVelocity.x / 240,
              anchor.object3D.position.z
            );
            clickArea.object3D.rotation.set(
              clickArea.object3D.rotation.x - aVelocity.x / 240,
              clickArea.object3D.rotation.y,
              clickArea.object3D.rotation.z
            );
          }
          if (aVelocity.y > 0.25 || aVelocity.y < -0.25) {
            // console.log(`Angular velocity along the Y-axis ${aVelocity.y}`);
            anchor.object3D.position.set(
              anchor.object3D.position.x + aVelocity.y / 240,
              anchor.object3D.position.y,
              anchor.object3D.position.z
            );
            clickArea.object3D.rotation.set(
              clickArea.object3D.rotation.x,
              clickArea.object3D.rotation.y - aVelocity.y / 240,
              clickArea.object3D.rotation.z
            );
          }
          if (aVelocity.z > 0.25 || aVelocity.z < -0.25) {
            // console.log(`Angular velocity along the Z-axis ${aVelocity.z}`);
            anchor.object3D.position.set(
              anchor.object3D.position.x,
              anchor.object3D.position.y,
              anchor.object3D.position.z - aVelocity.z / 480
            );
            clickArea.object3D.rotation.set(
              clickArea.object3D.rotation.x,
              clickArea.object3D.rotation.y,
              clickArea.object3D.rotation.z - aVelocity.z / 480
            );
          }
        }
      }
    }
  };

  const removeVidBG = () => {
    removeBG.forEach((element) => {
      const videoMesh = document.getElementById(element);
      const texture = new THREE.VideoTexture(videoMesh);
      const video = createChromaMaterial(texture, 0x00ff00);
      const preview = document.getElementById(element + "a_video");
      const geometry = new THREE.PlaneGeometry();
      preview.setObject3D("mesh", new THREE.Mesh(geometry, video));
      vidBGRemoved = true;
    });
  };

  const displayErrorResolve = (n) => {
    if (document.getElementById("errorResolveBG")) {
      document.getElementById("errorResolveBG").remove();
    }
    const errorResolveBG = document.createElement("div");
    errorResolveBG.setAttribute("id", "errorResolveBG");
    errorResolveBG.setAttribute(
      "style",
      "position: absolute; top: 0%; left: 0%; right: 0%; bottom: 0%; background: rgba(0,0,0,70%);"
    );

    const errorResolve = document.createElement("div");
    errorResolve.setAttribute("id", "errorResolve");
    errorResolve.setAttribute(
      "style",
      "position: absolute; color: yellow; z-index: 9999; top: 30%; left: 10%; right: 10%; bottom: auto; display: flex; background: rgba(0,0,0,80%); border-radius: 10px; padding: 20px; font-family: monospace; font-size: medium; flex-direction: column; align-items: flex-start; overflow-y: scroll;"
    );

    const errorResolveClose = document.createElement("div");
    errorResolveClose.setAttribute(
      "style",
      "border: 2px solid #ffffff;border-radius: 3px;padding: 0.5px 4px 2px 4px;align-self: end;margin-bottom: 10px;color: #ffffff;"
    );
    errorResolveClose.innerHTML = "x";
    errorResolve.appendChild(errorResolveClose);

    errorResolveClose.addEventListener("mouseover", () => {
      errorResolveClose.setAttribute(
        "style",
        "border: 2px solid red;border-radius: 3px;padding: 0.5px 4px 2px 4px;align-self: end;margin-bottom: 10px;color: red;"
      );
    });
    errorResolveClose.addEventListener("mouseout", () => {
      errorResolveClose.setAttribute(
        "style",
        "border: 2px solid #ffffff;border-radius: 3px;padding: 0.5px 4px 2px 4px;align-self: end;margin-bottom: 10px;color: #ffffff;"
      );
    });
    errorResolveClose.addEventListener("click", () => {
      errorResolveBG.remove();
    });

    let resolveMessage = document.createElement("ul");
    resolveMessage.setAttribute(
      "style",
      "margin-top: 5px; margin-left: 15px; font-size: small;"
    );
    console.log(n.toString());
    switch (n.toString()) {
      case "NotFoundError: Requested device not found":
        resolveMessage.innerHTML =
          "<li>Kindly make sure that your webcam/camera is properly connected to the device</li>";
        break;

      case "NotAllowedError: Permission denied":
        resolveMessage.innerHTML =
          "<li>Kindly enable camera permission for this page and reload</li>";
        break;

      case "NotReadableError: Device in use":
        resolveMessage.innerHTML =
          "<li>Kindly make sure you are not using camera in any other page/application</li><li>In case any other page/application is using the camera; kindly close it and reload this page</li>";
        break;

      case "NotReadableError: Could not start video source":
        resolveMessage.innerHTML =
          "<li>Kindly make sure you are not using camera in any other page/application</li><li>In case any other page/application is using the camera; kindly close it and reload this page</li>";
        break;

      default:
        resolveMessage.innerHTML = "";
        break;
    }
    const errorResolveMessage = document.createElement("p");
    //condition to check which error it is;
    //modify the message accordingly or add new paragraph/div bellow it
    errorResolveMessage.innerHTML =
      'You seems to be facing <ins class="error">"' + n + '"</ins> error';

    setTimeout(() => {
      const errorResolveGuide = document.createElement("p");
      //add the condition to switch to current error
      errorResolveGuide.innerHTML =
        "<br>This issue can commonly be solved by following the bellow instructions:-";
      // const resolveSteps = document.createElement("ul");
      // resolveSteps.appendChild(resolveMessage);
      // errorResolveGuide.appendChild(resolveSteps);
      errorResolveGuide.appendChild(resolveMessage);
      errorResolve.appendChild(errorResolveGuide);

      setTimeout(() => {
        const errorResolveContact = document.createElement("p");
        errorResolveContact.innerHTML =
          '<br>In case the issue persists, you can contact us at <br>\t Email : <a herf:"mailto:" target:"_blank"> email@domain.com</a><br>\t Phone : <a herf:"tel:" target:"_blank"> +91 *****-*****</a>';
        errorResolve.appendChild(errorResolveContact);
      }, 10);
    }, 10);
    errorResolve.appendChild(errorResolveMessage);
    errorResolveBG.appendChild(errorResolve);
    document.body.appendChild(errorResolveBG);
  };

  if (!AFRAME.components["mytarget"]) {
    AFRAME.registerComponent("mytarget", {
      init: function () {
        document.getElementById("overlay_button").removeAttribute("class");
        let granted = false;
        if (!window.AFRAME.utils.device.isIOS()) {
          granted = true;
        }
        const sTrayClose = document.getElementById("shareTrayClose");
        // sTrayClose.setAttribute("style","border: 2px solid #ffffff;border-radius: 3px;padding: 0.5px 4px 2px 4px;align-self: end;margin-bottom: 10px;color: #ffffff;");
        sTrayClose.innerHTML = "x";

        sTrayClose.addEventListener("mouseover", () => {
          sTrayClose.setAttribute(
            "style",
            "border: 2px solid red;border-radius: 3px;position: absolute;top: 5%;right: 1.5%;padding: 0.5px 4px 3px 4px;font-size: x-small;align-self: end;margin-bottom: 10px;color: red;"
          );
        });
        sTrayClose.addEventListener("mouseout", () => {
          sTrayClose.setAttribute(
            "style",
            "border: 2px solid #ffffff;border-radius: 3px;position: absolute;top: 5%;right: 1.5%;padding: 0.5px 4px 3px 4px;font-size: x-small;align-self: end;margin-bottom: 10px;color: #ffffff;"
          );
        });
        sTrayClose.addEventListener("click", () => {
          document.getElementById("shareTray").setAttribute("hidden", "");
        });

        const clickArea = document.getElementById("clickArea");
        const anchor = document.querySelector("#anchor");
        // console.log(anchor.object3D);
        const card = document.querySelector("#card");
        const message = document.getElementById("message");

        const sceneEl = document.querySelector("a-scene");
        sceneEl.addEventListener("arReady", (event) => {
          // console.log("MindAR is ready");
          isArReady = true;
          message.removeAttribute("hidden");
          document.getElementById("uiScanning").removeAttribute("class");
          setTimeout(() => {
            clickArea.setAttribute("class", "click-to-place");
            const isVisibleOnLoad = data?.isVisibleOnLoad
              ? data.isVisibleOnLoad
              : false;
            if (isVisibleOnLoad) {
              document.getElementById("uiScanning")?.remove();
              if (vidBGRemoved === false) {
                removeVidBG();
              }
              showScene();
              gyroMove();
              anchor.object3D.position.set(
                -sceneCenter.position.x / 10,
                sceneCenter.position.z / 5,
                -0.1
              );
            }
          }, 1000);
        });
        sceneEl.addEventListener("arError", (event) => {
          console.log("MindAR failed to start", event);
          const uiError = document.getElementById("uiError");
          // uiError.removeAttribute("hidden");
          navigator.mediaDevices
            .getUserMedia({ audio: !1, video: { facingMode: "environment" } })
            // .then()
            .catch((n) => {
              console.log("getUserMedia error", n);
              uiError.innerHTML = "getUserMedia error" + n;
              displayErrorResolve(n);
            });
        });
        // console.log(anchor.attributes);
        card.setAttribute("opacity", "0");
        card.setAttribute("visible", "true");
        anchor.setAttribute("scale", {
          x: 0.1,
          y: 0.1,
          z: 0.1,
        });

        clickArea.addEventListener("mouseup", (e) => {
          // console.log(e);
          if (clickAreaActive && e.target.id !== "") {
            if (
              e.target.className === "click-to-place" &&
              e.detail.cursorEl.tagName === "A-CAMERA"
            ) {
              document.getElementById("uiScanning")?.remove();
              if (vidBGRemoved === false) {
                removeVidBG();
              }
              if (!anchor.object3D.visible) {
                if (granted === true) {
                  showScene();
                  setPosition(e);
                }
                if (granted !== true) {
                  DeviceMotionEvent.requestPermission().then(
                    (permissionState) => {
                      if (permissionState === "granted") {
                        granted = true;
                        setTimeout(() => {
                          showScene();
                        }, 100);
                      }
                    }
                  );
                  DeviceMotionEvent.requestPermission().catch(console.error);
                  // console.log("gyro permission asked");
                }
              }
              const zoom =
                anchor.object3D.position.z <= -0.3
                  ? anchor.object3D.position.z
                  : -1.875;
              setPosition(e);
              clickArea.object3D.position.set(0, 0, 1.921);
              clickArea.object3D.rotation.set(0, 0, 0);
              gyroMove();
              anchor.object3D.position.set(
                anchor.object3D.position.x,
                anchor.object3D.position.y,
                zoom
              );
            }
          }
        });

        this.el.addEventListener("targetFound", (event) => {
          // console.log("target found", event);
          clickAreaActive = false;
          document
            .getElementById("mainEntity")
            .object3D.attach(clickArea.object3D);

          window.removeEventListener("devicemotion", gRotation);
          document.getElementById("uiScanning")?.remove();

          clickArea.removeAttribute("class");
          clickArea.setAttribute("position", "0 0 0");
          clickArea.setAttribute("rotation", "0 0 0");
          clickArea.setAttribute("scale", "1 1 1");

          anchor.setAttribute("position", "0 0 0");
          if (AFRAME.utils.device.isIOS()) {
            anchor.setAttribute("position", "0 -0.25 0");
          }
          anchor.setAttribute("scale", "1 1 1");
          // console.log(sceneScale);
          if (sceneScale?.changeScale) {
            anchor.setAttribute("scale", "0.5 0.5 0.5");
          }
          anchor.setAttribute("rotation", "0 0 0");

          if (vidBGRemoved === false) {
            removeVidBG();
          }

          if (!anchor.object3D.visible) {
            if (window.AFRAME.utils.device.isIOS()) {
              DeviceMotionEvent.requestPermission().then((permissionState) => {
                if (permissionState === "granted") {
                  window.addEventListener("devicemotion", (evt) => {
                    granted = true;
                  });
                }
              });
              DeviceMotionEvent.requestPermission().catch(console.error);
              // console.log("granted gyro");
            }
            showScene();
          }
          document
            .getElementsByTagName("a-camera")[0]
            .setAttribute(
              "look-controls",
              "enabled:true; magicWindowTrackingEnabled: false; touchEnabled: false; mouseEnabled: false;"
            );
          document
            .getElementsByTagName("a-camera")[0]
            .setAttribute("rotation", "0 0 0");
          document
            .getElementsByTagName("a-camera")[0]
            .setAttribute("position", "0 0 0");
        });

        this.el.addEventListener("targetLost", (event) => {
          sv = true;
          clickAreaActive = true;

          document
            .getElementsByTagName("a-camera")[0]
            .object3D.attach(clickArea.object3D);

          clickArea.setAttribute("class", "click-to-place");
          clickArea.object3D.position.set(0, 0, -0.205);
          clickArea.object3D.rotation.set(0, 0, 0);
          clickArea.object3D.scale.set(1, 1, 1);
          anchor.object3D.scale.set(3.5, 3.5, 3.5);
          gyroMove();
          anchor.object3D.rotation.set(
            -sceneAngle.rotation.x * 50,
            sceneAngle.rotation.z * 50,
            sceneAngle.rotation.y * 50
          );

          document
            .getElementsByTagName("a-camera")[0]
            .setAttribute("look-controls", "enabled: false;");
          // console.log("target lost", event);
        });
      },

      update: function (preData, oldDistance) {
        const clickArea = document.getElementById("clickArea");
        const anchor = document.querySelector("#anchor");
        let newData = [];
        let newDistance;

        document.body.addEventListener("touchmove", (ev) => {
          if (ev.targetTouches.length === 2 && ev.changedTouches.length === 2) {
            // console.log(ev);
            // console.log(preData);
            if (clickArea.object3D.el.className === "click-to-place") {
              clickArea.removeAttribute("class");
            }
            const touch0s = {
              x: ev.targetTouches[0].clientX,
              y: ev.targetTouches[0].clientY,
            };
            const touch1s = {
              x: ev.targetTouches[1].clientX,
              y: ev.targetTouches[1].clientY,
            };
            // console.log(touch0s, touch1s);
            newData = [touch0s, touch1s];
            // console.log(newData);
            newDistance = Math.sqrt(
              Math.pow(newData[0].x - newData[1].x, 2) +
                Math.pow(newData[0].y - newData[1].y, 2)
            );
            if (preData[0] && oldDistance !== null) {
              // console.log(oldDistance);
              const diff = (newDistance - oldDistance) / 1000;
              // console.log(diff);
              if (sv === false) {
                if (
                  anchor.object3D.position.z + diff > -2.3 &&
                  anchor.object3D.position.z + diff < -0.3
                ) {
                  anchor.object3D.position.setZ(
                    anchor.object3D.position.z + diff * 6
                  );
                  if (anchor.object3D.position.z + diff <= -2.3) {
                    anchor.object3D.position.setZ(-2.3 + 0.001);
                  }
                  if (anchor.object3D.position.z + diff >= -0.3) {
                    anchor.object3D.position.setZ(-0.3 - 0.001);
                  }
                }
              }
              if (sv === true) {
                if (
                  anchor.object3D.position.z + diff > -26.86 &&
                  anchor.object3D.position.z + diff < -10.56
                ) {
                  anchor.object3D.position.setZ(
                    anchor.object3D.position.z + diff * 50
                  );
                  if (anchor.object3D.position.z + diff <= -26.86) {
                    anchor.object3D.position.setZ(-26.86 + 0.001);
                  }
                  if (anchor.object3D.position.z + diff >= -10.56) {
                    anchor.object3D.position.setZ(-10.86 - 0.001);
                  }
                }
              }
            }
            //for the next Itration
            preData = newData;
            oldDistance = newDistance;
          }
        });

        document.body.addEventListener("touchend", (ev) => {
          // console.log("click area 2");
          if (isArReady) {
            clickArea.setAttribute("class", "click-to-place");
          }
          preData = [];
          oldDistance = null;
        });
      },
    });
  }

  if (!AFRAME.components["model-relative-opacity"]) {
    AFRAME.registerComponent("model-relative-opacity", {
      schema: { opacity: { default: 1.0 } },
      init: function () {
        this.nodeMap = {};
        this.prepareMap.bind(this);
        this.traverseMesh.bind(this);

        this.el.addEventListener("model-loaded", (e) => {
          this.prepareMap();
          this.update();
        });
      },
      prepareMap: function () {
        this.traverseMesh((node) => {
          this.nodeMap[node.uuid] = node.material.opacity;
        });
      },
      update: function () {
        this.traverseMesh((node) => {
          node.material.opacity = this.nodeMap[node.uuid] * this.data.opacity;
          node.material.transparent = node.material.opacity < 1.0;
          node.material.needsUpdate = true;
        });
      },
      remove: function () {
        this.traverseMesh((node) => {
          node.material.opacity = this.nodeMap[node.uuid];
          node.material.transparent = node.material.opacity < 1.0;
          node.material.needsUpdate = true;
        });
      },
      traverseMesh: function (func) {
        var mesh = this.el.getObject3D("mesh");
        if (!mesh) {
          return;
        }
        mesh.traverse((node) => {
          if (node.isMesh) {
            func(node);
          }
        });
      },
    });
  }

  return (
    <>
      <div>
        <img
          id="splashScreen"
          className="hidden"
          src={loadingScreen ? loadingScreen : SplashScreen}
          alt="Splash Screen"
        ></img>
      </div>

      <div id="uiError" hidden>
        <strong>Oops!</strong> Their seems to be some Error!!
        {/* <span className="closebtn" onclick="this.parentElement.parentElement.style.display='none';" onmouseover="this.style.color='black';">&times;</span> */}
      </div>

      <div id="uiScanning" className="hidden">
        <div className="inner">
          <img id="scanIco" src={scanIco} />
          <img id="scanLogo" src={scanLogo} />
          <strong id="uiScanningText">
            Scan the marker <br />
            or
            <br /> Tap the screen
          </strong>
          <div className="scanline"></div>
        </div>
      </div>

      <a-scene
        id="aScene"
        ref={sceneRef}
        mindar-image={`imageTargetSrc: ${
          data.mind.src + "?not-from-cache-please"
        };
          uiLoading: ${loadingScreen ? "#splashScreen" : "yes"};
          uiError: yes;
          uiScanning: yes;
          filterMinCF: 0.0000000000008602;
          filterBeta: 0.15;
          warmupTolerance: 1;
          missTolerance: 3;
          stayVisible: true;
          stayVisibleScale: 1;`}
        loading-screen="enabled:false"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        xr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        <a-assets id="mainAssets">
          <img
            id="target"
            src={data.targetImage.src + "?not-from-cache-please"}
            crossOrigin="anonymous"
          />
        </a-assets>
        <a-camera
          position="0 0 0"
          look-controls="enabled: false;"
          cursor="fuse: false;"
          raycaster="far: 999999; objects: #clickArea"
        >
          <a-entity id="cursor" position="0 0 -0.0001"></a-entity>
        </a-camera>

        <a-entity
          id="mainEntity"
          position="0 0 0"
          mytarget
          mindar-image-target="targetIndex: 0"
        >
          <a-sphere
            id="clickArea"
            position="0 0.00056 4.9703"
            rotation="0 0 0"
            radius="10"
            material="side: back;"
            opacity="0"
          >
            <a-entity
              id="anchor"
              position="0 0 0.6"
              scale="1 1 1"
              visible="false"
            >
              <a-plane
                id="card"
                scale={`${data?.targetImage?.scale?.x ?? 1} ${
                  data?.targetImage?.scale?.y ?? 1
                } ${data?.targetImage?.scale?.z ?? 1}`}
                position="0 0 -0.01"
                src="#target"
                opacity="1"
                material="transparent: true; blending: additive;"
                visible="false"
              ></a-plane>
            </a-entity>
          </a-sphere>
        </a-entity>
      </a-scene>
      <div id="overlay">
        <span id="message" hidden>
          <p id="message-text">Scan the marker or Tap the screen</p>
        </span>
      </div>
      {brandLogo && (
        <div className="hidden" id="overlay_branding">
          <img height={40} src={brandLogo} alt="Branding Logo"></img>
        </div>
      )}
      <div
        className="hidden"
        id="overlay_button"
        onClick={(e) => {
          e.stopPropagation();
          window.location.reload(true);
        }}
      >
        <TfiReload size={20} />
      </div>
      {/*  <div
        className="hidden"
        id="overlay_help"
        onClick={showMenu}
      >
        <IoIosHelpCircleOutline size={25} />
      </div> */}
      <div className="hidden" id="overlay_help" onClick={showMenu}>
        {helperLogo ? (
          <img className="helperLogo" src={helperLogo} />
        ) : (
          <TbHelpCircle size={25} />
        )}
      </div>

      {data?.setEnquiry && (
        <div
          className="hidden"
          id="overlay_help_enquiry"
          style={{
            borderRadius: "50px",
            height: "50px",
            width: "50px",
          }}
        >
          <BiSupport size={20} color="white" onClick={showEnquiry} />
        </div>
      )}

      <EnquiryFormModal open={isQueryModalOpen} cardData={data} />
      <div id="menu" hidden>
        <HelpBox showMenu={showMenu} />
      </div>

      <div className="hidden" id="overlay_share" onClick={showShareTray}>
        <FaShareAlt size={20} />
      </div>

      <div id="shareTray" hidden>
        <ShareTray showShareTray={showShareTray} />
      </div>
    </>
  );
}
