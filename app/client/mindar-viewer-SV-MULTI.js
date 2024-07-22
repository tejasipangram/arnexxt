"use client";
import React, { useEffect, useRef, useState } from "react";
import AFRAME from "aframe";
import SplashScreen from "./assets/splash.gif";
import { TfiReload } from "react-icons/tfi";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import Screen from "./assets/svg/Splash-screen.svg";
import playIcon from "./assets/playIcon.svg";
import pauseIcon from "./assets/pauseIcon.svg";
import scanIco from "./assets/svg/scanIco.svg";
import scanLogo from "./assets/svg/scanLogo.svg";
import SiteSettings from "./assets/jpg/SiteSettings.jpg";
import SiteSettingsCamera from "./assets/jpg/SiteSettingsCamera.jpg";
import { createChromaMaterial } from "./assets/chroma-video.js";
import HelpBox from "./components/Help.jsx";
import ShareTray from "./components/share.jsx";
import axios from "axios";
const THREE = window.THREE;
const removeBG = [];
const icoModel = [];
let vidBGRemoved = false;
let index;

export default function Test({ multiScene }) {
  let isArReady = false;
  let clickAreaActive = true;
  // console.log("21",multiScene);
  const sceneRef = useRef(null);
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
    let index;
    multiScene?.experiences?.map((data, key) => {
      const allData = [
        ...(multiScene?.experiences[key]?.photos ?? []),
        ...(multiScene?.experiences[key]?.images ?? []),
        ...(multiScene?.experiences[key]?.icons ?? []),
        ...(multiScene?.experiences[key]?.documents ?? []),
        ...(multiScene?.experiences[key]?.videos ?? []),
        ...(multiScene?.experiences[key]?.text ?? []),
        ...(multiScene?.experiences[key]?.resume ?? []),
      ];
      allData.forEach((element) => {
        let photo = document.createElement("a-image");
        let text = document.createElement("a-text");
        let model = document.createElement("a-gltf-model");
        let video = document.createElement("video");
        let aVideo = document.createElement("a-video");
        let circlePhoto = document.createElement("a-circle");
        let resume = document.createElement("a-plane");
        index = key;
        if (element.type === "text") {
          text.setAttribute("id", `ele${element.id.substring(0, 5)}${key}`);
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
          document.getElementById(`anchor${key}`).appendChild(text);
        } else if (element.type === "icons") {
          // console.log(element);
          function checkExtension(url) {
            const extension = url.split(".").pop().toLowerCase();
            const support = ["gltf", "glb"];
            if (support.includes(extension)) {
              model.setAttribute(
                "id",
                `ele${element.id.substring(0, 5)}${key}`
              );
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
              document.getElementById(`anchor${key}`).appendChild(model);
            } else {
              photo.setAttribute(
                "id",
                `ele${element.id.substring(0, 5)}${key}`
              );
              photo.setAttribute("src", element.src + "?not-from-cache-please");
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
              document.getElementById(`anchor${key}`).appendChild(photo);
            }
          }
          checkExtension(element.src);
        } else if (element.type === "resume") {
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
            trimAndUppercaseText(element.resumeData[0].title, 35)
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
            trimText(element.resumeData[0].description, DESCRIPTION_LIMIT)
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
            iconBg.setAttribute(
              "color",
              ` ${index === 0 ? "#b1ddf1" : "#fff"}`
            ); // Change to the desired background color
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
                .forEach((bg) => bg.setAttribute("color", "white"));

              // Show the background for the clicked icon
              iconBg.setAttribute("color", "#b1ddf1");
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
        } else if (element.type === "documents") {
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
              document.getElementById("anchor").appendChild(model);
            } else {
              photo.setAttribute("id", `ele${element.id.substring(0, 5)}`);
              photo.setAttribute("src", element.src + "?not-from-cache-please");
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
              photo.setAttribute("rotation", {
                x: (element.rotation.x + 1.571) * 50,
                y: element.rotation.y * 50,
                z: element.rotation.z * 50,
              });
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
              document.getElementById("anchor").appendChild(photo);
            }
          }
          checkExtension(element.src);
        } else if (element.type === "video") {
          video.setAttribute("id", `ele${element.id.substring(0, 5)}${key}`);
          video.setAttribute("src", element.src + "?not-from-cache-please");
          video.setAttribute("crossorigin", "anonymous");
          video.setAttribute("autoPlay", "false");
          video.setAttribute("preload", "true");
          video.setAttribute("playsinline", "");
          video.setAttribute("webkit-playsinline", "");
          video.setAttribute("loop", "true");
          video.muted = element.vsettings.muted;
          document.getElementById(`anchor${key}`).appendChild(video);
          // if (element.vsettings.removeBg) {
          //   removeBG.push(String(video.attributes.id.value));
          // }
          aVideo.setAttribute(
            "id",
            `ele${element.id.substring(0, 5)}a_video${key}`
          );
          aVideo.setAttribute("src", `#ele${element.id.substring(0, 5)}${key}`);
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
          if (element.vsettings.removeBg) {
            removeBG.push(String(aVideo.attributes.id.value));
          }
          //add play and pause icons as children with unique id
          document.getElementById(`anchor${key}`).appendChild(aVideo);
        } else if (element.type === "Model3d") {
          function checkExtension(url) {
            const extension = url.split(".").pop().toLowerCase();
            const support = ["gltf", "glb"];
            if (support.includes(extension)) {
              model.setAttribute(
                "id",
                `ele${element.id.substring(0, 5)}${key}`
              );
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
              document.getElementById(`anchor${key}`).appendChild(model);
            }
          }
          checkExtension(element.src);
        } else {
          if (element?.geometry === "Circle") {
            circlePhoto.setAttribute(
              "id",
              `ele${element.id.substring(0, 5)}${key}`
            );
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
              z: 0,
            });
            circlePhoto.setAttribute("rotation", {
              x: (element.rotation.x + 1.571) * 50,
              y: element.rotation.y * 50,
              z: element.rotation.z * 50,
            });
            document.getElementById(`anchor${key}`).appendChild(circlePhoto);
          } else {
            photo.setAttribute("id", `ele${element.id.substring(0, 5)}${key}`);
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
              z: 0,
            });
            photo.setAttribute("rotation", {
              x: (element.rotation.x + 1.571) * 50,
              y: element.rotation.y * 50,
              z: element.rotation.z * 50,
            });
            document.getElementById(`anchor${key}`).appendChild(photo);
          }
        }
      });
      // sceneCenter[key] = (multiScene.experiences[key].centerPosition?.position) ? multiScene.experiences[key].centerPosition : {'position':{'x':0,'y':0,'z':0}};
      // console.log(sceneCenter[key]);
      // });
    });

    if (multiScene.experiences[index].targetImage.src) {
      photo.setAttribute("id", `target${index}`);
      photo.setAttribute(
        "src",
        multiScene.experiences[index].targetImage.src + "?not-from-cache-please"
      );
      document.getElementById(`mainAssets`).appendChild(photo);
    }

    sceneEl.addEventListener("renderstart", () => {
      arSystem.start();
    });
    return () => {
      arSystem.stop();
    };
  }, []);

  const hideContent = (key) => {
    const targetData = multiScene?.experiences[key];
    const allData = [
      ...(targetData?.photos ?? []),
      ...(targetData?.images ?? []),
      ...(targetData?.icons ?? []),
      ...(targetData?.videos ?? []),
      ...(targetData?.text ?? []),
    ];
    allData.forEach((element) => {
      let currentDoc = document.querySelector(
        `#ele${element.id.substring(0, 5)}${key}`
      );
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

  const showCard = (key) => {
    const targetData = multiScene?.experiences[key];
    const allData = [
      ...(targetData?.photos ?? []),
      ...(targetData?.images ?? []),
      ...(targetData?.icons ?? []),
      ...(targetData?.documents ?? []),
      ...(targetData?.videos ?? []),
      ...(targetData?.text ?? []),
    ];
    console.log("show key", key);
    const anchor = document.querySelector(`#anchor${key}`);
    const hideTCard = multiScene?.experiences[key]?.targetImage?.isHidden
      ? multiScene.experiences[key].targetImage.isHidden
      : false;
    if (!hideTCard) {
      document.getElementById(`card${key}`).setAttribute(`animation__2`, {
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
    console.log(anchor);
    anchor.setAttribute("visible", "true");
    anchor.object3D.children.forEach((items) => {
      items.el.setAttribute("opacity", "0");
    });
    document.getElementById(`card${key}`).setAttribute(`animation__2`, {
      property: "opacity",
      to: "1",
      from: "0",
      autoplay: "true",
      dur: 500,
      loop: "once",
      easing: "linear",
    });
    allData.forEach((element, idx) => {
      let currentDoc = document.querySelector(
        `#ele${element.id.substring(0, 5)}${key}`
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
          let avideo = document.querySelector(
            `#ele${element.id.substring(0, 5)}a_video${key}`
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
            if (evt.detail.cursorEl.id == "cursor") {
              console.log(currentDoc);
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
        let node = document.getElementById(
          `ele${element.id.substring(0, 5)}${key}`
        );
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

  const showScene = (key) => {
    // console.log("key", key);
    const message = document.getElementById("message-text");
    const anchor = document.querySelector(`#anchor${key}`);
    message.innerHTML =
      "<Tap on the video to toggle play/pause.<br>Tap on the buttons and icons to open links.<br>Tap on an empty area to move the scene.";

    hideContent();
    anchor.setAttribute("visible", "true");
    showCard(key);
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

  const removeVidBG = () => {
    removeBG.forEach((element) => {
      const videoMesh = document.getElementById(
        document.getElementById(element).object3D.children[0].el.components
          .material.data.src.id
      );
      const texture = new THREE.VideoTexture(videoMesh);
      const video = createChromaMaterial(texture, 0x00ff00);
      const preview = document.getElementById(element);
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
      "position: absolute; color: yellow; z-index: 9999; top: 30%; left: 10%; right: 10%; bottom: auto; display: flex; background: rgba(0,0,0,80%); border-radius: 10px; padding: 20px; font-family: monospace; font-size: medium; flex-direction: column; align-items: flex-start;"
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
    console.log(SiteSettings);
    switch (n.toString()) {
      case "NotFoundError: Requested device not found":
        resolveMessage.innerHTML =
          "<li>Kindly make sure that your webcam/camera is properly connected to the device</li>";
        break;

      case "NotAllowedError: Permission denied":
        resolveMessage.innerHTML =
          `<li>
        Find the site settings options on the left hand side of the Address bar :\t
        <img src=\"` +
          SiteSettings.toString() +
          `\" alt=\"Site permission Icon\" style=\" width: 20px; margin-bottom: -7px; margin-left: -4px; border-radius: 50%;\" data-mime-type=\"image/jpeg\"/>
        </li>
        <li>
        Find the Camera option and click the button on it's right to toggle the camera permission :\t
        <img src=\"` +
          SiteSettingsCamera.toString() +
          `\" alt=\"Camera permission Button\" style=\" width: 155px; margin-bottom: -7px; margin-left: -4px; border-radius: 7px;\" data-mime-type=\"image/jpeg\"/>
        </li>`;
        break;

      case "NotReadableError: Device in use":
        resolveMessage.innerHTML = `<li>Kindly make sure you are not using camera in any other page/application</li>
        <li>In case any other page/application is using the camera; kindly close it and reload this page</li>`;
        break;

      case "NotReadableError: Could not start video source":
        resolveMessage.innerHTML = `<li>Kindly make sure you are not using camera in any other page/application</li>
        <li>In case any other page/application is using the camera; kindly close it and reload this page</li>`;
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
          '<br>In case the issue persists, you can contact us at <br>\t Email : <a herf:"mailto:Hello@immarsify.com" target:"_blank"> Hello@immarsify.com</a><br>\t Phone : <a herf:"tel:+916357311281" target:"_blank"> +91-63573-11281</a>';
        errorResolve.appendChild(errorResolveContact);
      }, 10);
    }, 10);
    errorResolve.appendChild(errorResolveMessage);
    errorResolveBG.appendChild(errorResolve);
    document.body.appendChild(errorResolveBG);
  };

  AFRAME.registerComponent("mytarget", {
    schema: {
      message: { type: "number", default: 0 },
    },

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
      const message = document.getElementById("message");
      const sceneEl = document.querySelector("a-scene");
      sceneEl.addEventListener("arReady", (event) => {
        // console.log("MindAR is ready");
        isArReady = true;
        message.removeAttribute("hidden");

        document.getElementById("uiScanning").removeAttribute("class");
        // setTimeout(() => {
        //   clickArea.setAttribute("class", "click-to-place");
        // }, 1000);
      });
      sceneEl.addEventListener("arError", (event) => {
        console.log("MindAR failed to start", event);
        const uiError = document.getElementById("uiError");
        uiError.removeAttribute("hidden");
        navigator.mediaDevices
          .getUserMedia({ audio: !1, video: { facingMode: "environment" } })
          // .then()
          .catch((n) => {
            console.log("getUserMedia error", n);
            uiError.innerHTML = "getUserMedia error" + n;
            displayErrorResolve(n);
          });
      });

      multiScene?.experiences?.map((list, key) => {
        const clickArea = document.getElementById(`clickArea${key}`);
        const anchor = document.querySelector(`#anchor${key}`);
        const card = document.querySelector(`#card${key}`);

        // console.log(anchor.attributes);
        card.setAttribute("opacity", "0");
        card.setAttribute("visible", "true");
        anchor.setAttribute("scale", {
          x: 0.1,
          y: 0.1,
          z: 0.1,
        });

        // clickArea.addEventListener("mouseup", (e) => {
        //   // console.log(e);
        //   if (clickAreaActive && e.target.id !== "") {
        //     if (
        //       e.target.className == "click-to-place" &&
        //       e.detail.cursorEl.tagName == "A-CAMERA"
        //     ) {
        //       if (vidBGRemoved == false) {
        //         removeVidBG();
        //       }
        //       if (!anchor.object3D.visible) {
        //         if (granted == true) {
        //           showScene();
        //           setPosition(e);
        //         }
        //         if (granted != true) {
        //           DeviceMotionEvent.requestPermission().then(
        //             (permissionState) => {
        //               if (permissionState === "granted") {
        //                 granted = true;
        //                 setTimeout(() => {
        //                   showScene();
        //                 }, 100);
        //               }
        //             }
        //           );
        //           DeviceMotionEvent.requestPermission().catch(console.error);
        //           // console.log("gyro permission asked");
        //         }
        //       }
        //       setPosition(e);
        //       clickArea.object3D.position.set(0, 0, 1.921);
        //       clickArea.object3D.rotation.set(0, 0, 0);
        //       gyroMove();
        //     }
        //   }
      });

      this.el.addEventListener("targetFound", (event) => {
        let key = this.el.object3D.el.components.mytarget.data.message;
        console.log("target found", key);
        const clickArea = document.getElementById(`clickArea${key}`);
        const anchor = document.querySelector(`#anchor${key}`);

        clickAreaActive = false;
        document
          .getElementById(`mainEntity${key}`)
          .object3D.attach(clickArea.object3D);

        // window.removeEventListener("devicemotion", gRotation);
        document
          .getElementById("uiScanning")
          ?.setAttribute("className", "hidden");

        clickArea.removeAttribute("class");
        clickArea.setAttribute("position", "0 0 0");
        clickArea.setAttribute("rotation", "0 0 0");
        clickArea.setAttribute("scale", "1 1 1");

        anchor.setAttribute("position", "0 0 -0.1");
        anchor.setAttribute("scale", "1 1 1");
        anchor.setAttribute("rotation", "0 0 0");

        if (vidBGRemoved == false) {
          removeVidBG();
        }

        if (!anchor.object3D.visible) {
          // if (window.AFRAME.utils.device.isIOS()) {
          //   DeviceMotionEvent.requestPermission().then((permissionState) => {
          //     if (permissionState === "granted") {
          //       window.addEventListener("devicemotion", (evt) => {
          //         granted = true;
          //       });
          //     }
          //   });
          //   DeviceMotionEvent.requestPermission().catch(console.error);
          //   // console.log("granted gyro");
          // }
          hideContent(key);
          showScene(key);
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
        let key = this.el.object3D.el.components.mytarget.data.message;
        console.log("target lost", key);

        const anchor = document.querySelector(`#anchor${key}`);
        anchor.setAttribute("visible", "false");

        document.getElementById("uiScanning").removeAttribute("class");
      });
    },
  });

  if (!AFRAME.components['model-relative-opacity']) {
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
          // src={loadingScreen ? loadingScreen : SplashScreen}
          src={SplashScreen}
          alt="Splash Screen"
        ></img>
      </div>

      <div id="uiError" hidden>
        <strong>Oops!</strong> Their seems to be some Error!!
        {/* <span className="closebtn" onclick="this.parentElement.parentElement.style.display='none';" onmouseover="this.style.color='black';">&times;</span> */}
      </div>

      <div id="uiScanning" className="hidden">
        <div class="inner">
          <img id="scanIco" src={scanIco} />
          <img id="scanLogo" src={scanLogo} />
          <strong id="uiScanningText">
            Scan the marker <br />
            or
            <br /> Tap the screen
          </strong>
          <div class="scanline"></div>
        </div>
      </div>
      {/* showStats: true; */}
      <a-scene
        id="aScene"
        ref={sceneRef}
        // uiLoading: ${loadingScreen ? "#splashScreen" : "yes"};
        mindar-image={`imageTargetSrc: ${
          multiScene.mind.url + "?not-from-cache-please"
        };
          maxTrack:  ${multiScene.experiences.length};
          uiLoading: #splashScreen;
          uiError: yes;
          uiScanning: yes;
        
          filterMinCF: 0.0000000000008602;
          filterBeta: 0.15;
          warmupTolerance: 1;
          missTolerance: 3;`}
        loading-screen="enabled:false"
        renderer="colorManagement: true, physicallyCorrectLights"
        xr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        <a-assets id="mainAssets">
          {multiScene?.experiences?.map((multi, key) => (
            <img
              key={`${key}`}
              id={`target${key}`}
              src={multi.targetImage.src}
            />
          ))}
        </a-assets>
        <a-camera
          position="0 0 0"
          look-controls="enabled: false;"
          cursor="fuse: false;"
          raycaster="far: 999999; objects: .click-to-place"
        >
          <a-entity id="cursor" position="0 0 -0.0001"></a-entity>
        </a-camera>

        {multiScene?.experiences?.map((multi, key) => (
          <a-entity
            key={`${key}`}
            id={`mainEntity${key}`}
            position="0 0 0"
            mytarget={`message:${key}`}
            mindar-image-target={`targetIndex: ${key}`}
          >
            <a-entity
              key={`${key}`}
              id={`clickArea${key}`}
              position="0 0.00056 4.9703"
              rotation="0 0 0"
              radius="10"
              // material="side: back;"
              opacity="0"
            >
              <a-entity
                key={`${key}`}
                id={`anchor${key}`}
                position="0 0 0.6"
                scale="1 1 1"
                visible="false"
              >
                <a-plane
                  key={`${key}`}
                  id={`card${key}`}
                  scale={`${multi?.targetImage?.scale?.x ?? 1} ${
                    multi?.targetImage?.scale?.y ?? 1
                  } ${multi?.targetImage?.scale?.z ?? 1}`}
                  position="0 0 -0.01"
                  src={`#target${key}`}
                  opacity="1"
                  material="blending: additive;"
                  visible="false"
                ></a-plane>
              </a-entity>
            </a-entity>
          </a-entity>
        ))}
      </a-scene>
      <div id="overlay">
        <span id="message" hidden>
          <p id="message-text">Scan the marker</p>
        </span>
      </div>
      {/* {brandLogo && (
        <div className="hidden" id="overlay_branding">
          <img height={40} src={brandLogo} alt="Branding Logo"></img>
        </div>
      )} */}
      <div
        className="hidden"
        id="overlay_button"
        onClick={(e) => {
          e.stopPropagation();
          window.location.reload(false);
        }}
      >
        <TfiReload size={25} />
      </div>
      {/*  <div
        className="hidden"
        id="overlay_help"
        onClick={showMenu}
      >
        <IoIosHelpCircleOutline size={25} />
      </div> */}
      {/* <div className="hidden" id="overlay_help" onClick={showMenu}>
        {helperLogo ? <img className="helperLogo" src={helperLogo} /> : <p className="text_helper">Help</p>}
      </div> */}

      <div id="menu" hidden>
        <HelpBox showMenu={showMenu} />
      </div>

      <div className="hidden" id="overlay_share" onClick={showShareTray}>
        <p className="text_helper">Share</p>
      </div>

      <div id="shareTray" hidden>
        <ShareTray showShareTray={showShareTray} />
      </div>
    </>
  );
}
