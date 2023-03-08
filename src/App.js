import "./App.css";
import React from "react";
import moment from "moment";

class App extends React.Component {
  api = {
    key: "ae9b251a76e602b86e7af4d97dfce97f",
    base: "https://api.openweathermap.org/data/2.5/",
  };
  state = {
    userPosition: {
      latitude: {},
      longitude: {},
    },
    is_enabled: false,
    city: null,
    weather: [],
    weather_main: [],
    weather_sys:[],
    data: [],
    dailyData: [],
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  search = () => {
    fetch(
      `${this.api.base}weather?q=${this.state.city}&appid=${this.api.key}&units=metric`
    )
      .then((res) => res.json())
      .then((result) => {
        this.setState({ weather: result, weather_main: result.main,weather_sys:result.sys });
      });
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.setState({ is_enabled: true });
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&%20exclude=minutely&appid=128944992833eb85f19eeebe5415027c`
        )
          .then((response) => response.json())
          .then((data) => {
            this.setState({ data: data, dailyData: data.daily });
          });
      });
    }
  }
  render() {
    const card = {
      margin: "10px",
      padding: "10px",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
    };
    const location = this.state.data.timezone;
    const dailyData = this.state.dailyData.map(
      ({ dt, temp: { day }, weather: [{ description }] }) => (
        <ul>
          <li>{moment(dt * 1000).format("dddd")}</li>
          <li>{moment(dt * 1000).format("MMMM Do, h:mm a")}</li>
          <li>{Math.round(day - 273.15)}°C</li>
          <li>{description}</li>
        </ul>
      )
    );
    return (
      <div className="App">
        {!this.state.is_enabled ? (
          <>
            <h1>Please accept Location Access! or enter city name</h1>
            <input
             style={{width:"400px",padding:"10px",borderRadius:"10px",marginRight:"4px"}}
              name="city"
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <button style={{padding:"10px",borderRadius:"10px",backgroundColor:"#5b6cc7",color:"white"}} onClick={this.search}>Search</button>
            <div style={card}>
              <ul>
                <li>{this.state.weather.name}</li>
                <li>{Math.round(this.state.weather_main.temp_min)}°c - {Math.round(this.state.weather_main.temp_max)}°c</li>
                <li>{new Date().getDay()}/{new Date().getMonth()}/{new Date().getFullYear()}</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <h1>{location}</h1>
            <div style={card}>{dailyData}</div>
          </>
        )}
      </div>
    );
  }
}

export default App;
