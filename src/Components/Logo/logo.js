import React from "react";
import Tilt from "react-tilt";
import './logo.css';
import brain from './brain.png';

const Logo = () => {
  return (
    <div className="ma3 mto">
      <Tilt
        className="Tilt br1 shadow-2" 
        options={{ max: 25 }}
        style={{ height: 100, width: 100 }}
      >
        <div className="Tilt-inner pa3">
          <img style={{ paddingTop: "1px" }} alt="logo" src={brain} />
        </div>
      </Tilt> 
    </div>
  );
};

export default Logo;
