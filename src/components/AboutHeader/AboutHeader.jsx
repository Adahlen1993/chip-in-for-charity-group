import React from "react";
import "./AboutHeader.css";
import aboutUsImage from "/_CCND Logo.png"; // Adjust path as needed

function AboutHeader() {
  return (
    <header className="about-header">
      <a
        href="https://www.catholiccharitiesnd.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={aboutUsImage} alt="About Us" className="header-image" />
      </a>
      <p>
        <strong>Helping people. Changing lives.</strong>
      </p>
    </header>
  );
}

export default AboutHeader;
