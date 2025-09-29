// src/components/Page.jsx
import React from "react";

export default function Page({ children }) {
  return (
    <div className="sr-page">
      {children}
    </div>
  );
}
