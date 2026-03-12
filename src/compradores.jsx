import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CompradoresDashboard from './CompradoresDashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CompradoresDashboard />
  </StrictMode>,
)
