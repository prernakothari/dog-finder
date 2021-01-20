import { render } from "@testing-library/react";
import { Component } from "react";
import { connect } from "react-redux";
import { Map, Set } from "immutable";
import store from "./store";
import { SET_URL_LIST } from "./actionTypes";
import "./viewer.css"
const mapStateToProps = (state) => {
  return { urlList: state.urlList.toJS() };
};

class Viewer extends Component {
  constructor(props) {
    super(props)
    let desiredWidth = window.innerWidth * 0.95
    this.state = {
      rowMap: Map(),
      desiredWidth: desiredWidth,
      maxNumberOfImagesInRow: Math.min(Math.floor(desiredWidth / 200), 5)
    }
  }

  reset = () => {
    this.setState({ rowMap: Map() })
  }

  resize = (e) => {
    e.preventDefault();
    let desiredWidth = window.innerWidth * 0.95
    let oldRowMap = this.state.rowMap
    let state = {
      rowMap: Map(),
      desiredWidth: desiredWidth,
      maxNumberOfImagesInRow: Math.min(Math.floor(desiredWidth / 200), 5)
    }
    for (let i = 0; i < this.props.urlList.length; i++) {
      let rowIndex = Math.floor(i / state.maxNumberOfImagesInRow);

      let numberOfImagesInRow = state.maxNumberOfImagesInRow
      if (rowIndex === Math.floor((this.props.urlList.length - 1) / state.maxNumberOfImagesInRow)) {
        numberOfImagesInRow = this.props.urlList.length - state.maxNumberOfImagesInRow * rowIndex
      }

      state = this.addWidthToMap(document.getElementById(`image${i}`), rowIndex, i, oldRowMap.getIn([rowIndex, "height"]), numberOfImagesInRow, state)
    }

    this.setState({ ...state })
  }

  componentDidMount() {
    fetch(`https://dog.ceo/api/breed/pug/images/random/10`)
      .then((response) => response.json())
      .then((result) =>
        store.dispatch({ type: SET_URL_LIST, urlList: result.message })
      );
    window.addEventListener("resize", this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize)
  }


  addWidthToMap = (imageElement, rowIndex, index, height, numberOfImagesInRow, stateRef = undefined) => {
    let state = stateRef ? stateRef : this.state
    let rowMap = state.rowMap
    if (!rowMap.has(rowIndex)) {
      rowMap = rowMap.set(rowIndex, { width: 0 })
    }
    let indicesLoaded = rowMap.getIn([rowIndex, "indicesLoaded"], Set([]))

    if (!indicesLoaded.has(index)) {
      rowMap = rowMap.updateIn([rowIndex, "width"], w => w + imageElement.clientWidth)
      rowMap = rowMap.setIn([rowIndex, "indicesLoaded"], indicesLoaded.add(index))

      if (rowMap.getIn([rowIndex, "indicesLoaded"]).size === numberOfImagesInRow) {
        let newHeight = imageElement.clientHeight / window.innerWidth * 100 * (state.desiredWidth / rowMap.getIn([rowIndex, "width"]))
        rowMap = rowMap.setIn([rowIndex, "height"], newHeight)
      }
      if (stateRef === undefined)
        this.setState({ rowMap: rowMap })
      else
        return { ...state, rowMap: rowMap }
    }
  }

  componentDidUpdate() {

  }

  render() {
    let imageList = []


    for (let i = 0; i < this.props.urlList.length; i++) {
      let rowIndex = Math.floor(i / this.state.maxNumberOfImagesInRow);
      let height = 30;

      let numberOfImagesInRow = this.state.maxNumberOfImagesInRow
      if (rowIndex === Math.floor((this.props.urlList.length - 1) / this.state.maxNumberOfImagesInRow)) {
        numberOfImagesInRow = this.props.urlList.length - this.state.maxNumberOfImagesInRow * rowIndex
      }

      if (this.state.rowMap.hasIn([rowIndex, "height"])) {
        height = this.state.rowMap.getIn([rowIndex, "height"])
      }

      imageList.push(<img id={`image${i}`} src={this.props.urlList[i]} style={{ height: `${height}vw`, padding: "0.2%" }} onLoad={(e) => this.addWidthToMap(e.target, rowIndex, i, height, numberOfImagesInRow)}
      />)
    }

    return (
      <div className="flex-container">
        {imageList}
      </div>
    );
  }
}
export default connect(mapStateToProps, null)(Viewer);
