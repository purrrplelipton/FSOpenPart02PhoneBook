import axios from "axios"

const baseURL = `http://localhost:3001/api/persons`

function getAll() {
  const req = axios.get(baseURL)
  return req.then(res => res.data)
}

function create(newObject) {
  const req = axios.post(baseURL, newObject)
  return req.then(res => res.data)
}

function update(id, newObject) {
  const req = axios.put(`${baseURL}/${id}`, newObject)
  return req.then(res => res.data)
}

function remove(id) {
  const req = axios.delete(`${baseURL}/${id}`)
  return req.then(res => res.data)
}

const personsService = {getAll, create, update, remove};

export default personsService;