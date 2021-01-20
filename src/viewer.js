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
      loadedImages: 0,
      maxNumberOfImagesInRow: Math.min(Math.floor(desiredWidth / 200), 5)
    }
  }

  reset = () => {
    this.setState({ rowMap: Map() })
  }

  resize = () => {
    let desiredWidth = window.innerWidth * 0.95
    let rowMap = this.state.rowMap
    rowMap.forEach((value, rowIndex) => {
      rowMap = rowMap.updateIn([rowIndex, "indicesLoaded"], set => set.clear())
      rowMap = rowMap.setIn([rowIndex, "width"], 0)
      rowMap = rowMap.deleteIn([rowIndex, "finalHeight"])
    })
    let state = {
      rowMap: rowMap,
      desiredWidth: desiredWidth,
      maxNumberOfImagesInRow: Math.min(Math.floor(desiredWidth / 150), 4)
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


  addWidthToMap = (imageElement, rowIndex, index, numberOfImagesInRow) => {
    let rowMap = this.state.rowMap
    if (!rowMap.has(rowIndex)) {
      rowMap = rowMap.set(rowIndex, { height: 30, width: 0 })
    }
    let indicesLoaded = rowMap.getIn([rowIndex, "indicesLoaded"])
    if (indicesLoaded === undefined) {
      indicesLoaded = Set([])
    }
    let loadedImages = this.state.loadedImages
    if (!indicesLoaded.has(index)) {
      rowMap = rowMap.updateIn([rowIndex, "width"], w => w + imageElement.clientWidth)
      rowMap = rowMap.setIn([rowIndex, "indicesLoaded"], indicesLoaded.add(index))

      if (loadedImages !== this.props.urlList.length) {
        loadedImages++
      }

      if (rowMap.getIn([rowIndex, "indicesLoaded"]).size === numberOfImagesInRow) {
        let newHeight = rowMap.getIn([rowIndex, "height"]) * (this.state.desiredWidth / rowMap.getIn([rowIndex, "width"]))
        console.log(`Height ${newHeight} for row : ${rowIndex}`);
        rowMap = rowMap.setIn([rowIndex, "finalHeight"], newHeight)
      }
      this.setState({ rowMap: rowMap, loadedImages: loadedImages })
    }
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

      if (this.state.rowMap.hasIn([rowIndex, "finalHeight"])) {
        height = this.state.rowMap.getIn([rowIndex, "finalHeight"])
      } else if (this.state.loadedImages === this.props.urlList.length) {
        this.addWidthToMap(document.getElementById(`image${i}`), rowIndex, i, numberOfImagesInRow)
      }

      imageList.push(<img id={`image${i}`} src={this.props.urlList[i]} style={{ height: `${height}vw`, padding: "0.2%" }} onLoad={(e) => this.addWidthToMap(e.target, rowIndex, i, numberOfImagesInRow)}
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
