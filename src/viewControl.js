import { render } from "@testing-library/react";
import { Component } from "react";
import { connect } from "react-redux";
import store from "./store";
import { SET_BREED_DATA } from "./actionTypes";
import CustomDropdown from "./customDropdown";
import {
  Dropdown,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
const mapStateToProps = (state) => {
  return {};
};

class ViewControl extends Component {
  componentDidMount() {
    fetch(`https://dog.ceo/api/breeds/list/all`)
      .then((response) => response.json())
      .then((result) =>
        store.dispatch({ type: SET_BREED_DATA, breedData: result.message })
      );
  }
  render() {
    return (
      <div>
        <Navbar bg='light' expand='lg'>
          <Nav className='mr-auto'>
            <CustomDropdown />
          </Nav>
        </Navbar>
      </div>
    );
  }
}
export default connect(mapStateToProps, null)(ViewControl);
