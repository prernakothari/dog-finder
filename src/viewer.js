import { render } from "@testing-library/react";
import { Component } from "react";
import { connect } from "react-redux";
import store from "./store";
import { SET_URL_LIST } from "./actionTypes";
const mapStateToProps = (state) => {
  return { urlList: state.urlList };
};

class Viewer extends Component {
  componentDidMount() {
    fetch(`https://dog.ceo/api/breed/pug/images/random/10`)
      .then((response) => response.json())
      .then((result) =>
        store.dispatch({ type: SET_URL_LIST, urlList: result.message })
      );
  }
  render() {
    return (
      <div>
        {this.props.urlList.map((url) => (
          <img src={url} />
        ))}
      </div>
    );
  }
}
export default connect(mapStateToProps, null)(Viewer);
