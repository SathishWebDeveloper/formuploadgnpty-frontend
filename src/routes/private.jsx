import React from "react";
import { Routes, Route } from "react-router-dom";
import UploadPage from "../pages/dashboard/upload";
import Navbar from "../components/navbar";
import GalleryPage from "../pages/dashboard/gallery";
import ViewPage from "../pages/dashboard/view";
import GeneratePage from "../pages/dashboard/generate";

const PrivatePage = () => {
  return (
    <>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/view" element={<ViewPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Route>
      </Routes>
    </>
  );
};
export default PrivatePage;
