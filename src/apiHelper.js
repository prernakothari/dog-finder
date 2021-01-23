import { APPEND_URL_LIST, SET_URL_LIST, SET_BREED_DATA } from "./actionTypes"
import store from "./store"

const getAllImagesAPI = (breed, subBreed = null) => {
    return `https://dog.ceo/api/breed/${breed}/${subBreed === null ? "" : `${subBreed}/`}images/`
}

const getRandomImagesAPI = (number, breed, subBreed = null) => {
    if (breed !== null)
        return `https://dog.ceo/api/breed/${breed}/${subBreed === null ? "" : `${subBreed}/`}images/random/${number}`
    else
        return `https://dog.ceo/api/breeds/image/random/${number}`
}

const getListOfBreedsAPI = () => {
    return `https://dog.ceo/api/breeds/list/all`
}

export const getMoreRandomImages = (number, breed, subBreed = null) => {
    fetch(getRandomImagesAPI(number, breed, subBreed))
        .then((response) => response.json())
        .then((result) =>
            store.dispatch({ type: APPEND_URL_LIST, urlList: result.message })
        );
}

export const getRandomImages = (number, breed, subBreed = null) => {
    fetch(getRandomImagesAPI(number, breed, subBreed))
        .then((response) => response.json())
        .then((result) =>
            store.dispatch({ type: SET_URL_LIST, urlList: result.message })
        );
}

export const getListOfBreeds = () => {
    fetch(getListOfBreedsAPI())
        .then((response) => response.json())
        .then((result) =>
            store.dispatch({ type: SET_BREED_DATA, breedData: result.message })
        );
}