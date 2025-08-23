import { useState } from "react";
import LogoSpainRoom from "../components/LogoSpainRoom.jsx"; // nuevo import

// dentro de <section className="sr-hero__content">:
{!useFallback ? (
  <img
    src="/logo.png"
    alt="Logo SpainRoom"
    className="sr-hero__logo"
    width="260"
    height="auto"
    onError={() => setUseFallback(true)}
  />
) : (
  <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
    <LogoSpainRoom size={220} />
  </div>
)}
