import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

 import './index.css'
// import './Theme/light.css'
// import './Theme/dark.css'
 import './Theme/main.css'
// import './Theme/EmeraldTheme.css'
// import './Theme/OceanTheme.css'
// import './Theme/purpleTheme.css'
// import './Theme/sunsetTheme.css'

import './Theme/theam.css'


import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'



createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>


)
