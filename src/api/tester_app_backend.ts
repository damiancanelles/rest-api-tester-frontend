import axios from "axios"

const url : string = "http://localhost:8000"

const api = axios.create({
    baseURL: url
})

export default api