// The forwardRef is important!!
import React, { useState } from "react";
import { Dropdown, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import store from "./store";
import { SET_URL_LIST } from "./actionTypes";
import { setRowMap } from "./viewer";
import { Map as iMap } from "immutable"
import { getRandomImages, getRandomImagesAPI } from "./apiHelper";

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
const CustomToggle = React.forwardRef(({ children, onClick, setValue, value }, ref) => {
  return (
    <FormControl
      autoFocus
      className='mx-3 my-2 w-auto'
      placeholder='Filter by Breed'
      onChange={(e) => setValue(e.target.value)}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      value={value}
    ></FormControl>
  );
})

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, value, "aria-labelledby": labeledBy }, ref) => {

    let optionList = React.Children.toArray(children).filter(
      (child) =>
        !value || child.props.children.toLowerCase().includes(value.toLowerCase())
    )
    if (optionList.length == 0) {
      optionList.push(<Dropdown.Item>No Results </Dropdown.Item>)
    }
    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <ul className='list-unstyled' >
          {optionList}
        </ul>
      </div>
    );
  }
);

const CustomDropdown = (props) => {
  const [value, setValue] = useState("")
  let mapIndexToBreedData = new Map();
  const onSelect = (eventKey) => {
    setRowMap(iMap())
    let breedData = mapIndexToBreedData.get(eventKey);
    getRandomImages(9, breedData.breed, breedData.subBreed)
  };

  let itemList = [];
  for (const breed in props.breedData) {
    if (props.breedData[breed].length === 0) {
      let eventKey = `${breed}`.CapitalizeEachWord()
      mapIndexToBreedData.set(eventKey, { breed: breed, subBreed: null });
      itemList.push(
        <Dropdown.Item key={eventKey} eventKey={eventKey} onSelect={onSelect} onClick={() => { setValue(eventKey) }}>
          {eventKey}
        </Dropdown.Item>
      );
    } else {
      props.breedData[breed].forEach((subBreed) => {
        let eventKey = `${breed}`.CapitalizeEachWord()
        if (!mapIndexToBreedData.has(eventKey)) {
          mapIndexToBreedData.set(eventKey, { breed: breed, subBreed: null });
          itemList.push(
            <Dropdown.Item key={eventKey} eventKey={eventKey} onSelect={onSelect} onClick={() => { setValue(eventKey) }}>
              {eventKey}
            </Dropdown.Item>
          );
        }

        eventKey = `${subBreed} ${breed}`.CapitalizeEachWord()
        mapIndexToBreedData.set(eventKey, { breed: breed, subBreed: subBreed });
        itemList.push(
          <Dropdown.Item key={eventKey} eventKey={eventKey} onSelect={onSelect} onClick={() => { setValue(eventKey) }}>
            {eventKey}
          </Dropdown.Item>
        );

      });
    }
  }
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} setValue={setValue} value={value} id='dropdown-custom-components'>
        Select Breed
        </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu} value={value}>{itemList}</Dropdown.Menu>
    </Dropdown>
  );
}

export default connect(mapStateToProps, null)(CustomDropdown);
