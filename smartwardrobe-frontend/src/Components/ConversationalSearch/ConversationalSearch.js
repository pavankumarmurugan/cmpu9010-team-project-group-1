import React from "react";
import { useLocation } from "react-router-dom";

function ConversationalSearch() {
    const location = useLocation();
    let { state } = location;
  return (
    <div>
      <h1>Conversational Search</h1>
    </div>
  );
}

export default ConversationalSearch;