import React from "react";
import "../../Styles/Content.css";
import ContentHeader from "../ContentHeader/ContentHeader";
import ContentMid from "./ContentMid";

function Content() {
  return (
    <div className="layout-content">
      <ContentHeader />
      <ContentMid />
    </div>
  );
}

export default Content;