import { SET_URL_LIST, SET_BREED_DATA, SET_ROW_MAP, APPEND_URL_LIST } from "./actionTypes"

import { OrderedSet, Map } from "immutable"

let initialState = { urlList: OrderedSet([]), breedData: {}, rowMap: Map(), activeBreedData: { breed: "pug", subBreed: null }, hasMoreImages: true }

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case SET_URL_LIST: {
            return { ...state, urlList: OrderedSet(action.urlList) }
        }
        case APPEND_URL_LIST: {
            let newUrlList = state.urlList.union(action.urlList)
            let hasMoreImages = newUrlList.size > state.urlList.size
            return { ...state, urlList: newUrlList, hasMoreImages: hasMoreImages }
        }
        case SET_BREED_DATA: {
            return { ...state, breedData: action.breedData }
        }
        case SET_ROW_MAP: {
            return { ...state, rowMap: action.rowMap }
        }
    }

    return initialState;
}