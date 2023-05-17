import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App.tsx'
import './styles/index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { tagLabels } from './utils.ts'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>

          <Route path='/' element={<App />} />
          {tagLabels.map((tagLabel) => (
            <Route key={tagLabel.id} path={`/${tagLabel.tag}`} element={<App />} />))}
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
)
