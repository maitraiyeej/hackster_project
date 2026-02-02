import { Children, StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider, useSelector } from 'react-redux'
import { store } from './app/store.js'
import { ToastContainer } from 'react-toastify'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <App />
        <ToastContainer/>
    </Provider>
  </StrictMode>,
)
