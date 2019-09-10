import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import StarRatings from "react-star-ratings";

class Store extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    let me = this;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:5000/getBizs");
    xhr.send();
    xhr.onload = function() {
      if (xhr.status !== 200) {
        alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
      } else {
        me.setState({ data: JSON.parse(xhr.response) });
      }
    };
    xhr.onerror = function() {
      alert(
        "API Server not started. Please execute 'node index.js' in './api' folder "
      );
    };
  }
  render() {
    return this.state.data.length === 0 ? (
      <App />
    ) : (
      <React.Fragment>
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1 className="display-4">Top 5 Ice Cream Stores</h1>
            <p className="lead">
              This is a list of top 5 Ice Cream Stores based on ratings in
              Alpharetta GA City
            </p>
          </div>
        </div>
        <div className="container">
          <NumberList data={this.state.data} />
        </div>
      </React.Fragment>
    );
  }
}

function NumberList(props) {
  const bizs = props.data;
  const outLets = Object.keys(bizs).map(number => (
    <Outlet
      key={bizs[number].id}
      value={bizs[number]}
      number={parseInt(number) + 1}
    />
  ));
  return <React.Fragment>{outLets}</React.Fragment>;
}

function Outlet(props) {
  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card mb-3">
          <Banner url={props.value.image_url} />
          <Details data={props.value} number={props.number} />
        </div>
      </div>
    </div>
  );
}

function Details(props) {
  let data = props.data;
  return (
    <div className="card-body outlet-body">
      <div className="row">
        <div className="col-md-6">
          <h5 className="card-title">
            {props.number}.{" " + data.name}
          </h5>

          <Categories value={data.categories} />
          <StarRatings
            name="outlet-rating"
            numberOfStars={5}
            rating={data.rating}
            isSelectable={false}
            starDimension="20px"
            starRatedColor="rgb(255, 180, 0)"
          />
          <span>{data.rating}</span>
        </div>
        <Address
          value={data.location.display_address}
          phone={data.display_phone}
        />
      </div>
      <Reviews value={data.reviews} />
      <Footer value={data.is_closed} />
    </div>
  );
}

function Categories(props) {
  const listItems = props.value.map(item => {
    return <small key={item.title}>{" " + item.title}</small>;
  });
  //   return <p className="text-left">Ice Cream, Food</p>;
  return <React.Fragment>{listItems}</React.Fragment>;
}

function Address(props) {
  return (
    <div className="col-md-6">
      <p className="text-right">{props.phone}</p>
      <p className="text-right">
        <small>{props.value[0] || ""}</small>
      </p>
    </div>
  );
}

function Reviews(props) {
  const listItems = props.value.map(item => {
    return (
      <div key={item.id} className="card mb-3 review-block">
        <div className="row no-gutters">
          <div className="col-md-2 review-bg-image">
            <img src={item.user.image_url} className="card-img" alt="..." />
          </div>
          <div className="col-md-10">
            <div className="card-body review-user">
              <h5 className="card-title review-user-name">{item.user.name}</h5>
              <StarRatings
                name="review-rating"
                numberOfStars={5}
                rating={item.rating}
                isSelectable={false}
                starDimension="20px"
                starRatedColor="rgb(255, 180, 0)"
                style={{ display: "block" }}
              />

              <p className="card-text">{item.text}</p>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  });
  return (
    <React.Fragment>
      <h6>Reviews</h6>
      {listItems}
    </React.Fragment>
  );
}

function Banner(props) {
  return (
    <div className="outlet-bg-image">
      <img src={props.url} className="card-img-top" alt="..." />
    </div>
  );
}

function Footer(props) {
  return (
    <p className="card-text">
      <small className="text-muted">
        This shop is {props.value ? "Closed" : "Open"} Now.
      </small>
    </p>
  );
}

ReactDOM.render(<Store />, document.getElementById("root"));
