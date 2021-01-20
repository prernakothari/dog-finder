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
  constructor(props){
    super(props)
    this.state = {
      rowMap: Map(),
      maxNumberOfImagesInRow: 4,
      loadedImages: 0,
    }
    this.onResize = this.onResize.bind(this)
  }

  onResize(){
    console.log("resize")
    this.setState({rowMap: Map()}) 
  }

  componentDidMount() {
    fetch(`https://dog.ceo/api/breed/pug/images/random/10`)
      .then((response) => response.json())
      .then((result) =>
        store.dispatch({ type: SET_URL_LIST, urlList: result.message })
      );

    window.addEventListener("resize", this.onResize)
  }

  componentWillUnmount(){
    window.removeEventListener("resize", this.onResize);
  }

  addWidthToMap = (imageElement, rowIndex, index, numberOfImagesInRow) => {
    //console.log(index, rowIndex)
    let indicesLoaded = this.state.rowMap.getIn([rowIndex, "indicesLoaded"])
    if (!indicesLoaded.has(index)){
      let rowMap = this.state.rowMap.updateIn([rowIndex, "width"], w => w + imageElement.clientWidth)
      rowMap = rowMap.updateIn([rowIndex, "indicesLoaded"], set => set.add(index))
      this.setState({rowMap: rowMap, loadedImages: this.state.loadedImages + 1}, () => {
        if (rowMap.getIn([rowIndex, "indicesLoaded"]).size === numberOfImagesInRow){
          let newHeight = this.state.rowMap.getIn([rowIndex, "height"])* ( this.props.desiredWidth / this.state.rowMap.getIn([rowIndex, "width"]))
          console.log(`Height ${newHeight} for row : ${rowIndex}`);
          this.setState({rowMap: this.state.rowMap.setIn([rowIndex, "finalHeight"], newHeight)})
        }
      })
    }
  }

  render() {
    let imageList = []


    for (let i=0; i < this.props.urlList.length; i++){
      let rowIndex = Math.floor(i/this.state.maxNumberOfImagesInRow);
      let height = 100;

      let numberOfImagesInRow = this.state.maxNumberOfImagesInRow
      if (i === this.props.urlList.length-1){
        numberOfImagesInRow = i % this.state.maxNumberOfImagesInRow + 1
      }

      if (!this.state.rowMap.has(rowIndex)){
        this.setState({rowMap: this.state.rowMap.set(rowIndex, {height: height, width: 0, indicesLoaded: Set([])})})
      } else if (this.state.rowMap.hasIn([rowIndex, "finalHeight"])){
        height = this.state.rowMap.getIn([rowIndex, "finalHeight"])
      }
      

      // if (this.state.loadedImages === this.props.urlList.length){
      //   addWidthToMap(document.getElementById(`image${i}`), rowIndex, i, numberOfImagesInRow)
      // }
      
      imageList.push(<img id={`image${i}`} src={this.props.urlList[i]} style={{height:`${height}px`, padding: "3px"}} onLoad={(e)=>this.addWidthToMap(e.target, rowIndex, i, numberOfImagesInRow)}/>)
    }

    return (
      <div className = "flex-container">
        {imageList}
      </div>
    );
  }
}
export default connect(mapStateToProps, null)(Viewer);
