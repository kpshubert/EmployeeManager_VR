import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

// Ensure the container element exists
const container = document.getElementById('root');

// Use the non-null assertion operator (!) to satisfy TypeScript if you are certain the element exists
const root = createRoot(container!);

// Render the App component into the container
root.render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);