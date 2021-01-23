import { Component } from "react";
import { connect } from "react-redux";
import { SET_CURRENT_BREED } from "./actionTypes";
import { RANDOM_SAMPLE_SIZE } from "./constants";
import CustomDropdown from "./customDropdown";
import { Navbar, Nav } from "react-bootstrap";
import { getListOfBreeds, getRandomImages } from "./apiHelper";

const mapStateToProps = (state) => {
  return {
    breed: state.activeBreedData.breed,
    subBreed: state.activeBreedData.subBreed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentBreed: () => {
      getRandomImages(RANDOM_SAMPLE_SIZE, null, null);
      dispatch({ type: SET_CURRENT_BREED, breed: null, subBreed: null });
    },
  };
};

class ViewController extends Component {
  // renders top navigation bar
  componentDidMount() {
    getListOfBreeds();
  }

  render() {
    let title = `${this.props.subBreed ? this.props.subBreed + " " : ""}${
      this.props.breed ? this.props.breed : "All Breeds"
    }`.CapitalizeEachWord();
    return (
      <div>
        <Navbar bg='light' expand='lg' collapseOnSelect={true}>
          <Nav className='mr-auto'>
            <Navbar.Brand href='#home'>Dog Finder</Navbar.Brand>
          </Nav>
          <Nav className='mr-auto'>
            <Navbar.Text size='lg'> {title} </Navbar.Text>
          </Nav>
          <Nav>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <CustomDropdown />
              <Nav.Link onClick={this.props.setCurrentBreed}> Random </Nav.Link>
              <Nav.Link
                id='githubLink'
                href={"https://github.com/prernakothari/dog-finder"}
                target={"_blank"}
              >
                {" "}
                &nbsp;{" "}
              </Nav.Link>
            </Navbar.Collapse>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewController);
