import { render } from "@testing-library/react";
import { Component } from "react";
import { connect } from "react-redux";
import { Map, Set } from "immutable";
import store from "./store";
import { SET_ROW_MAP } from "./actionTypes";
import "./viewer.css"
import InfiniteScroll from 'react-infinite-scroll-component';
import { getMoreRandomImages, getRandomImages } from "./apiHelper";

const mapStateToProps = (state) => {
  return {
    urlList: state.urlList.toJS(), rowMap: state.rowMap, currentBreed: state.activeBreedData.breed, currentSubBreed: state.activeBreedData.subBreed,
    hasMoreImages: state.hasMoreImages, needsFormatting: state.needsFormatting
  };
};

const getDesiredWidth = () => {
  return window.innerWidth * 0.95
}

const getMaxNumberOfImagesInRow = () => {
  return Math.min(Math.floor(getDesiredWidth() / 200), 5)
}

export const setRowMap = (rowMap) => {
  store.dispatch({ type: SET_ROW_MAP, rowMap: rowMap })
}

class Viewer extends Component {
  reset = () => {
    this.setState({ rowMap: Map() })
  }

  reformat = (e, incremental = false) => {
    e.preventDefault()
    let oldRowMap = this.props.rowMap
    let rowMap = Map()
    for (let i = 0; i < this.props.urlList.length; i++) {
      let maxNumberOfImagesInRow = getMaxNumberOfImagesInRow()
      let rowIndex = Math.floor(i / maxNumberOfImagesInRow);

      let numberOfImagesInRow = maxNumberOfImagesInRow;
      if (rowIndex === Math.floor((this.props.urlList.length - 1) / maxNumberOfImagesInRow)) {
        numberOfImagesInRow = this.props.urlList.length - maxNumberOfImagesInRow * rowIndex
      }

      rowMap = this.addWidthToMap(document.getElementById(`image${i}`), rowIndex.toString(), i, oldRowMap.getIn([rowIndex, "height"]), numberOfImagesInRow, rowMap)
    }

    setRowMap(rowMap);
  }

  loadMoreImages = () => {
    getMoreRandomImages(2, this.props.currentBreed, this.props.currentSubBreed)
  }

  componentDidMount() {
    getRandomImages(10, this.props.currentBreed, this.props.currentSubBreed)
    window.addEventListener("resize", this.reformat)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.reformat)
  }


  addWidthToMap = (imageElement, rowIndex, index, height, numberOfImagesInRow, rowMapRef = undefined) => {
    let rowMap = rowMapRef ? rowMapRef : this.props.rowMap
    if (!rowMap.has(rowIndex)) {
      rowMap = rowMap.set(rowIndex, { width: 0 })
    }
    let indicesLoaded = rowMap.getIn([rowIndex, "indicesLoaded"], Set([]))

    if (!indicesLoaded.has(index)) {
      rowMap = rowMap.updateIn([rowIndex, "width"], w => w + imageElement.clientWidth)
      rowMap = rowMap.setIn([rowIndex, "indicesLoaded"], indicesLoaded.add(index))

      if (rowMap.getIn([rowIndex, "indicesLoaded"]).size === numberOfImagesInRow) {
        let newHeight = imageElement.clientHeight / window.innerWidth * 100 * (getDesiredWidth() / rowMap.getIn([rowIndex, "width"]))
        rowMap = rowMap.setIn([rowIndex, "height"], newHeight)
      }
      if (rowMapRef === undefined)
        setRowMap(rowMap);
      else
        return rowMap
    }
  }

  render() {
    let imageList = []

    for (let i = 0; i < this.props.urlList.length; i++) {
      let rowIndex = Math.floor(i / getMaxNumberOfImagesInRow());
      let height = 30;

      let maxNumberOfImagesInRow = getMaxNumberOfImagesInRow()
      let numberOfImagesInRow = maxNumberOfImagesInRow
      if (rowIndex === Math.floor((this.props.urlList.length - 1) / maxNumberOfImagesInRow)) {
        numberOfImagesInRow = this.props.urlList.length - maxNumberOfImagesInRow * rowIndex
      }

      if (this.props.rowMap.hasIn([rowIndex.toString(), "height"])) {
        height = this.props.rowMap.getIn([rowIndex.toString(), "height"])
      }
      imageList.push(<img key={`image${i}`} id={`image${i}`} src={this.props.urlList[i]} style={{ height: `${height}vw`, padding: "0.2%" }} onLoad={(e) => this.reformat(e, true)}
      />)
    }

    return (

      <div className="flex-container">
        <InfiniteScroll
          dataLength={this.props.urlList.length} //This is important field to render the next data
          next={this.loadMoreImages}
          hasMore={this.props.hasMoreImages}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        // below props only if you need pull down functionality
        // refreshFunction={this.refresh}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        // }
        >
          {imageList}
        </InfiniteScroll>
      </div>
    );
  }
}
export default connect(mapStateToProps, null)(Viewer);
