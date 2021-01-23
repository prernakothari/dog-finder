import React, { useState } from "react";
import { NavDropdown, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import { SET_CURRENT_BREED } from "./actionTypes";
import { setRowMap } from "./view";
import { Map as iMap } from "immutable";
import { getRandomImages, getRandomImagesAPI } from "./apiHelper";
import { RANDOM_SAMPLE_SIZE } from "./constants";
import "./customDropdown.css";

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

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentBreed: (breed, subBreed) =>
      dispatch({ type: SET_CURRENT_BREED, breed: breed, subBreed: subBreed }),
  };
};

const CustomDropdown = (props) => {
  // Custom DropDown Selection Menu that facilitates filtering based on query

  const [value, setValue] = useState("");
  let mapIndexToBreedData = new Map();
  const onSelect = (eventKey) => {
    setValue("");
    let breedData = mapIndexToBreedData.get(eventKey);
    setRowMap(iMap());
    props.setCurrentBreed(breedData.breed, breedData.subBreed);
    getRandomImages(RANDOM_SAMPLE_SIZE, breedData.breed, breedData.subBreed);
  };

  let itemList = [];
  for (const breed in props.breedData) {
    if (props.breedData[breed].length === 0) {
      let eventKey = `${breed}`.CapitalizeEachWord();
      mapIndexToBreedData.set(eventKey, { breed: breed, subBreed: null });
      itemList.push(
        <NavDropdown.Item
          key={eventKey}
          eventKey={eventKey}
          onSelect={onSelect}
          onClick={() => {
            setValue(eventKey);
          }}
        >
          {eventKey}
        </NavDropdown.Item>
      );
    } else {
      props.breedData[breed].forEach((subBreed) => {
        let eventKey = `${breed}`.CapitalizeEachWord();
        if (!mapIndexToBreedData.has(eventKey)) {
          mapIndexToBreedData.set(eventKey, { breed: breed, subBreed: null });
          itemList.push(
            <NavDropdown.Item
              key={eventKey}
              eventKey={eventKey}
              onSelect={onSelect}
              onClick={() => {
                setValue(eventKey);
              }}
            >
              {eventKey}
            </NavDropdown.Item>
          );
        }

        eventKey = `${subBreed} ${breed}`.CapitalizeEachWord();
        mapIndexToBreedData.set(eventKey, { breed: breed, subBreed: subBreed });
        itemList.push(
          <NavDropdown.Item
            key={eventKey}
            eventKey={eventKey}
            onSelect={onSelect}
            onClick={() => {
              setValue(eventKey);
            }}
          >
            {eventKey}
          </NavDropdown.Item>
        );
      });
    }
  }

  itemList = itemList.filter(
    (child) =>
      !value || child.props.children.toLowerCase().includes(value.toLowerCase())
  );
  if (itemList.length === 0) {
    itemList.push(<NavDropdown.Item>No Results </NavDropdown.Item>);
  }

  return (
    <NavDropdown title={"Select Breed"} value={value}>
      <FormControl
        autoFocus
        className='mx-2 my-2 w-auto'
        placeholder='Filter by Breed'
        onChange={(e) => setValue(e.target.value)}
        value={value}
      ></FormControl>
      {itemList}
    </NavDropdown>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomDropdown);
