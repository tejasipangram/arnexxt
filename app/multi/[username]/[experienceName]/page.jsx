"use client";
import React, { useEffect, useState } from "react";
import "@/app/client/App.css";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

import { Helmet } from "react-helmet";
// import logo from "./assets/svg/immarsify_logo.svg";

import mindarViewerSVMULTI from "@/app/client/mindar-viewer-SV-MULTI";
// import MindarViewerSVMULTI from "@/app/client/mindar-viewer-SV-MULTI";
// import MindarViewerSVMULTI from "./mindar-viewer-SV-MULTI2.js";
mindarViewerSVMULTI;
function MultiScene() {
  const [selectedCard, setSelectedCard] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { username, experienceName } = useParams();
  const [started, setStarted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadArData = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(
        `https://sandboxapi.immarsify.com/api/multi/get_multiscene/${username}/${experienceName}`
      );
      if (response.status === 200) {
        setLoading(false);
        setStarted(response.data.data);
        console.log("response", response.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError(true);
    }
  };

  console.log("started", started);

  useEffect(() => {
    if (username && experienceName) {
      loadArData();
    }
  }, [username, experienceName]);

  return (
    <div className="App">
      <Helmet>
        <title>{started?.name ?? ""}</title>
        <meta
          name="description"
          content={`${started?.userName ?? ""} Experience`}
        />
      </Helmet>
      {started && (
        <div className="container_wrapper">
          <mindarViewerSVMULTI multiScene={started} />
        </div>
      )}
      {error && (
        <div className="wrapper">
          <h2>No Immarsify experience found</h2>
          <h3>Please check URL</h3>
        </div>
      )}
    </div>
  );
}

export default MultiScene;
