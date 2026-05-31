import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage';

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage /> }/>
        <Route path="/Homepage" element={<HomePage /> }/>
        <Route path="/quiz" element={<QuizPage /> }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
