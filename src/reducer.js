import {SET_URL_LIST, SET_BREED_DATA} from "./actionTypes"
import {Set, Map} from "immutable"
let initialState = {urlList:Set([]), breedData:{}}

export default function Reducer(state = initialState, action){
    switch(action.type) {
        case SET_URL_LIST:{
            return {...state, urlList: Set(action.urlList)}
        }
        case SET_BREED_DATA:{
            return {...state, breedData: action.breedData}
        }
    }

    return initialState;
}