import React, { Component } from "react";
import "tachyons";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/logo";
import ImageLinkForm from "./Components/ImageLinkForm/imageLinkForm";
import FaceRecognition from "./Components/FaceRecognition/faceRecognition";
import Rank from "./Components/Rank/rank";
import SignIn from "./Components/Signin/signin.js";
import Register from "./Components/Register/register.js";
import "./App.css";

const app = new Clarifai.App({
  apiKey: "2f4f44f3b38e42ceb157a81015a81e0a"
});

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: " ",
      imageUrl: " ",
      box: {},
      route: "signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: " ",
        entries: 0 ,
        joined: new Date()
      }
    };
  }

  loadUser = (data) =>{
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries ,
        joined: data.joined
    }})
  }

  calculateFaceLocation = data => {
    const clarifaiFace =
    data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log("initial", clarifaiFace);
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    this.setState({ box: box });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
    console.log(event.target.value);
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response =>{
        if (response){
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({
              id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries : count })) 
        })
     }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      .catch(err => console.log(err));
  }

  onRouteChange = route => {
    if (route === 'signout'){
      this.setState({isSignedIn : false})
    }else if(route === 'home'){
      this.setState({isSignedIn : true})
    }
    this.setState({ route: route });
  }; 

  render() { 
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={box}
              imageUrl={imageUrl}
            />
          </div>
        ) : this.state.route === "signin" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
