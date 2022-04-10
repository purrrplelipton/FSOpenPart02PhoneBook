import axios from "axios"

const baseURL = 'http://localhost:3000/persons'

function getAll() {
  const request = axios.get(baseURL)
  return request.then(response => response.data)
}

function create(newObject) {
  const request = axios.post(baseURL, newObject)
  return request.then(response => response.data)
}

function update(id, newObject) {
  const request = axios.put(`${baseURL}/${id}`, newObject)
  return request.then(response => response.data)
}

function remove(id) {
  const request = axios.delete(`${baseURL}/${id}`)
  return request.then(response => response.data)
}

const personsService = {getAll, create, update, remove};

export default personsService;