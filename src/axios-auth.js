import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://fir-ex-bfd10.firebaseio.com'
})

instance.defaults.headers.common['SOMETHING'] = 'something'

export default instance
