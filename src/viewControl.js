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
import { getListOfBreeds } from "./apiHelper";
const mapStateToProps = (state) => {
  return {};
};

class ViewControl extends Component {
  componentDidMount() {
    getListOfBreeds()
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
