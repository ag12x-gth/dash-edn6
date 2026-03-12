import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UnificadoDashboard from './UnificadoDashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UnificadoDashboard />
  </StrictMode>,
)
