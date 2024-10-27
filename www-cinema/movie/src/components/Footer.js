import "../Mystyles/Footer.css";
import React from "react";

import { LocalPhone, Email } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <div className="footer">
      <div className="larger-icon">
        <a href="/">
          <FontAwesomeIcon icon={faFilm} className="icon-white" />
        </a>
      </div>

      <div className="footer_center">
        <h3>Useful Links</h3>
        <ul>
          <li>About Us</li>
          <li>Terms and Conditions</li>
          <li>Return and Refund Policy</li>
        </ul>
      </div>

      <div className="footer_right">
        <h3>Contact</h3>
        <div className="footer_right_info">
          <LocalPhone />
          <p>(+30) 210 7223378</p>
        </div>
        <div className="footer_right_info">
          <Email />
          <p>ArTzi@support.com</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
