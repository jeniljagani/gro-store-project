import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Ensure production environment strictly uses embedded serverless /api routes
axios.defaults.baseURL = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || '') : '';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
