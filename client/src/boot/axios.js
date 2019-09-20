import Vue from 'vue'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com'
})

Vue.prototype.$axios = axiosInstance

export {
  axiosInstance
}
