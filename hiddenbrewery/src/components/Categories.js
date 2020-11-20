import React from "react";
import USStates from "./Info/States&Cities.json";
import MyMapComponent from "./Map";
import Geocode from "react-geocode";
import GoogleKey from "../key"; 

Geocode.setApiKey(GoogleKey);


class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      USInfo: USStates,
      states: [],
      cities: [],
      selectedState: "--Choose State--",
      selectedCity: "--Choose City--",
      breweries: [],
      coordinatesLat: 0,
      coordinatesLng: 0,
    };
    this.changeState = this.changeState.bind(this);
    this.changeCity = this.changeCity.bind(this);
  }

  
  


getGeocode(place){
  Geocode.fromAddress(place)
.then(
    response => {
       this.props.onUpdateCoordinates(response.results[0].geometry.location)
       console.log("geocode", response.results[0].geometry.location);
       },
    error => {
       console.log("oops", error);
       })
}


  changeState(event) {
    this.setState({ selectedState: event.target.value }, () => {
      console.log("selectedState", this.state.selectedState);
      this.fetchState(this.state.selectedState);
    });
    this.setState({ states: Object.keys(this.state.USInfo) }, () => {
      console.log("states", this.state.states);
    });
    this.getGeocode(event.target.value)
  }

  changeCity(event) {
    this.setState({ selectedCity: event.target.value }, () => {
      console.log("selectedCity", this.state.selectedCity);
      this.fetchCity(this.state.selectedCity);
    });
    this.setState(
      { cities: this.state.USInfo[this.state.selectedState] },
      () => {
        console.log("cities", this.state.cities);
      }
    );
    this.getGeocode(event.target.value)

  }

  fetchState(state) {
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}`)
      .then((resp) => resp.json())
      .then((data) => this.setState({ breweries: data }));
  }

  fetchCity(city) {
    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}`)
      .then((resp) => resp.json())
      .then((data) => this.setState({ breweries: data }));
  }

  render() {
    return (
      <div>
        <label>State</label>
        <br />
        <select
          placeholder="state"
          value={this.state.selectedState}
          onChange={this.changeState}
        >
          <option>--Choose State--</option>
          {Object.keys(this.state.USInfo).map((state, index) => {
            return <option key={index}>{state}</option>;
          })}
        </select>
        <br />
        <div>
          <label>City</label>
          <br />
          <select
            placeholder="city"
            value={this.state.selectedCity}
            onChange={this.changeCity}
          >
            <option>--Choose City--</option>
            {/* {this.state.selectedState !== "--Choose City--" &&
             <MyMapComponent centerLat={this.state.coordinatesLat} centerLng={this.state.coordinatesLng} markerIsShown places={this.state.breweries} /> } */}
          </select>
          <ul>
            {this.state.breweries.map((brewery) => {
              return <li>{brewery.name}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  } 
}


export default Categories;
