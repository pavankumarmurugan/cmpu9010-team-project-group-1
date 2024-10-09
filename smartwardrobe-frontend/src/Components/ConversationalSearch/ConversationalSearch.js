import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import ConversationalScreenContent from "../ConversationalScreenContent/ConversationalScreenContent";
import "../../App.css";

function ConversationalSearch() {
    const location = useLocation();
    let { state } = location;
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout--content">
        <ConversationalScreenContent input={state} />
      </div>
    </div>
  );
}

export default ConversationalSearch;