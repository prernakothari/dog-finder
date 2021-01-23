import {
  SET_URL_LIST,
  SET_BREED_DATA,
  SET_ROW_MAP,
  APPEND_URL_LIST,
  SET_CURRENT_BREED,
} from "./actionTypes";

import { OrderedSet, Map } from "immutable";

let initialState = {
  urlList: OrderedSet([]), // Ordered Set of image urls (Avoids Duplicate URLs)
  breedData: {}, // object containing all breeds and subbreed
  rowMap: Map(), // Immutable Map ( key: rowIndex, value: Object), data structure used in formatting algorithm for justified image grid
  activeBreedData: { breed: "pug", subBreed: null }, // selected breed information
  hasMoreImages: true, // if more unique images are present
};

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case SET_URL_LIST: {
      return { ...state, urlList: OrderedSet(action.urlList) };
    }
    case APPEND_URL_LIST: {
      let newUrlList = state.urlList.union(action.urlList);
      let hasMoreImages = newUrlList.size > state.urlList.size;
      return { ...state, urlList: newUrlList, hasMoreImages: hasMoreImages };
    }
    case SET_BREED_DATA: {
      return { ...state, breedData: action.breedData };
    }
    case SET_ROW_MAP: {
      return { ...state, rowMap: action.rowMap };
    }
    case SET_CURRENT_BREED: {
      return {
        ...state,
        activeBreedData: { breed: action.breed, subBreed: action.subBreed },
      };
    }
  }

  return initialState;
}
