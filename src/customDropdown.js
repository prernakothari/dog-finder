// The forwardRef is important!!
import React, { useState } from "react";
import { Dropdown, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import store from "./store";
import { SET_URL_LIST } from "./actionTypes";
String.prototype.CapitalizeEachWord = function () {
  let text = this.toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
  return text;
};

const mapStateToProps = (state) => {
  return { breedData: state.breedData };
};
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=''
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className='mx-3 my-2 w-auto'
          placeholder='Type to filter...'
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className='list-unstyled'>
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);

class CustomDropdown extends React.Component {
  render() {
    let mapIndexToBreedData = new Map();
    const onSelect = (eventKey) => {
      console.log(eventKey);
      console.log(mapIndexToBreedData);
      let breedData = mapIndexToBreedData.get(eventKey);
      let api = `https://dog.ceo/api/breed/${breedData.breed}/${
        breedData.subBreed === null ? "" : `${breedData.subBreed}/`
      }images`;
      console.log(api);
      fetch(api)
        .then((response) => response.json())
        .then((result) =>
          store.dispatch({
            type: SET_URL_LIST,
            urlList: result.message,
          })
        );
    };

    let itemList = [];
    let i = 1;
    for (const breed in this.props.breedData) {
      if (this.props.breedData[breed].length === 0) {
        mapIndexToBreedData.set(`${i}`, { breed: breed, subBreed: null });
        itemList.push(
          <Dropdown.Item eventKey={i} onSelect={onSelect}>
            {`${breed}`.CapitalizeEachWord()}
          </Dropdown.Item>
        );
        i++;
      } else {
        this.props.breedData[breed].forEach((subBreed) => {
          mapIndexToBreedData.set(`${i}`, { breed: breed, subBreed: subBreed });
          itemList.push(
            <Dropdown.Item eventKey={i} onSelect={onSelect}>
              {`${subBreed} ${breed}`.CapitalizeEachWord()}
            </Dropdown.Item>
          );
          i++;
        });
      }
    }
    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id='dropdown-custom-components'>
          Select Breed
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>{itemList}</Dropdown.Menu>
      </Dropdown>
    );
  }
}
export default connect(mapStateToProps, null)(CustomDropdown);
