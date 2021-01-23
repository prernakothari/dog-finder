import { Modal } from "react-bootstrap";
import { Component } from "react";
import { connect } from "react-redux";
import { Map, Set } from "immutable";
import store from "./store";
import { SET_ROW_MAP } from "./actionTypes";
import "./view.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { getMoreRandomImages, getRandomImages } from "./apiHelper";
import { RANDOM_SAMPLE_SIZE } from "./constants";

const mapStateToProps = (state) => {
  return {
    urlList: state.urlList.toJS(),
    rowMap: state.rowMap,
    currentBreed: state.activeBreedData.breed,
    currentSubBreed: state.activeBreedData.subBreed,
    hasMoreImages: state.hasMoreImages,
    reformatting: state.reformatting,
  };
};

const getDesiredWidth = () => {
  return window.innerWidth * 0.985;
};

const getMaxNumberOfImagesInRow = () => {
  return Math.min(Math.floor(getDesiredWidth() / 200), 5);
};

export const setRowMap = (rowMap) => {
  store.dispatch({ type: SET_ROW_MAP, rowMap: rowMap });
};

class View extends Component {
  /* Gallery Viewer Component
     Arranges Images into a justified grid
  */
  constructor(props) {
    super(props);
    this.state = {
      showImageModal: false,
      selectedImageId: null,
    };
  }

  reformat = (
    e,
    incremental = false,
    rowIndex_ = undefined,
    index_ = undefined,
    numberOfImagesInRow_ = undefined
  ) => {
    /* Code for Justifying the grid
       Cumulative width of each image row should be same
       defined by getDesiredWidth()
    */
    e.preventDefault();
    let oldRowMap = this.props.rowMap;
    let rowMap;
    if (incremental) {
      rowMap = oldRowMap;
      let indicesList = oldRowMap
        .getIn([rowIndex_, "indicesLoaded"], Set([]))
        .add(index_);
      rowMap = rowMap.delete(rowIndex_);
      indicesList.forEach((i) => {
        rowMap = this.addWidthToMap(
          document.getElementById(`image${i}`),
          rowIndex_.toString(),
          i,
          numberOfImagesInRow_,
          rowMap
        );
      });
    } else {
      rowMap = Map();
      for (let i = 0; i < this.props.urlList.length; i++) {
        let maxNumberOfImagesInRow = getMaxNumberOfImagesInRow();
        let rowIndex = Math.floor(i / maxNumberOfImagesInRow);

        let numberOfImagesInRow = maxNumberOfImagesInRow;
        if (
          rowIndex ===
          Math.floor((this.props.urlList.length - 1) / maxNumberOfImagesInRow)
        ) {
          numberOfImagesInRow =
            this.props.urlList.length - maxNumberOfImagesInRow * rowIndex;
        }

        rowMap = this.addWidthToMap(
          document.getElementById(`image${i}`),
          rowIndex.toString(),
          i,
          numberOfImagesInRow,
          rowMap
        );
      }
    }

    setRowMap(rowMap);
  };

  loadMoreImages = () => {
    getMoreRandomImages(
      RANDOM_SAMPLE_SIZE,
      this.props.currentBreed,
      this.props.currentSubBreed
    );
  };

  componentDidMount() {
    getRandomImages(
      RANDOM_SAMPLE_SIZE,
      this.props.currentBreed,
      this.props.currentSubBreed
    );
    window.addEventListener("resize", this.reformat);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.reformat);
  }

  addWidthToMap = (
    imageElement,
    rowIndex,
    index,
    numberOfImagesInRow,
    rowMapRef = undefined
  ) => {
    let rowMap = rowMapRef ? rowMapRef : this.props.rowMap;
    if (!rowMap.has(rowIndex)) {
      rowMap = rowMap.set(rowIndex, { width: 0 });
    }
    let indicesLoaded = rowMap.getIn([rowIndex, "indicesLoaded"], Set([]));

    if (!indicesLoaded.has(index)) {
      rowMap = rowMap.updateIn(
        [rowIndex, "width"],
        (w) => w + imageElement.clientWidth
      );
      rowMap = rowMap.setIn(
        [rowIndex, "indicesLoaded"],
        indicesLoaded.add(index)
      );

      if (
        rowMap.getIn([rowIndex, "indicesLoaded"]).size === numberOfImagesInRow
      ) {
        let newHeight =
          (imageElement.clientHeight / window.innerWidth) *
          100 *
          (getDesiredWidth() / rowMap.getIn([rowIndex, "width"]));
        rowMap = rowMap.setIn([rowIndex, "height"], newHeight);
      }
      if (rowMapRef === undefined) setRowMap(rowMap);
      else return rowMap;
    }
  };

  render() {
    const handleClose = () => this.setState({ showImageModal: false });
    const handleShow = () => this.setState({ showImageModal: true });
    let imageList = [];

    for (let i = 0; i < this.props.urlList.length; i++) {
      let rowIndex = Math.floor(i / getMaxNumberOfImagesInRow());
      let height = 30;

      let maxNumberOfImagesInRow = getMaxNumberOfImagesInRow();
      let numberOfImagesInRow = maxNumberOfImagesInRow;
      if (
        rowIndex ===
        Math.floor((this.props.urlList.length - 1) / maxNumberOfImagesInRow)
      ) {
        numberOfImagesInRow =
          this.props.urlList.length - maxNumberOfImagesInRow * rowIndex;
      }

      if (this.props.rowMap.hasIn([rowIndex.toString(), "height"])) {
        height = this.props.rowMap.getIn([rowIndex.toString(), "height"]);
      }
      imageList.push(
        <img
          key={`image${i}`}
          id={`image${i}`}
          src={this.props.urlList[i]}
          onClick={() => {
            this.setState({ selectedImageId: i });
            handleShow();
          }}
          style={{ height: `${height}vw`, padding: "0.2%", cursor: "pointer" }}
          onLoad={(e) =>
            this.reformat(e, true, rowIndex.toString(), i, numberOfImagesInRow)
          }
        />
      );
    }

    return (
      <div>
        <div className='flex-container'>
          <InfiniteScroll
            dataLength={this.props.urlList.length} //This is important field to render the next data
            next={this.loadMoreImages}
            hasMore={this.props.hasMoreImages}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>You have seen them all!</b>
              </p>
            }
          >
            {imageList}
          </InfiniteScroll>
        </div>
        <Modal show={this.state.showImageModal} onHide={handleClose}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <img
              src={this.props.urlList[this.state.selectedImageId]}
              style={{ width: "100%" }}
            />
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, null)(View);
