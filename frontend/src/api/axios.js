import axios from 'axios'

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

const api = axios.create ({
    baseURL : `${BACKEND_BASE_URL}/api`
})

export default api