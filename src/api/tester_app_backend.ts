import axios from "axios"

const url : string = process.env.BACKEND_URL || "http://localhost:8000"

const api = axios.create({
    baseURL: url
})

export default api