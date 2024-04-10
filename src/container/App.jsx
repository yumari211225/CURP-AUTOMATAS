import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import FirstForm from '../pages/FirstForm';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FirstForm/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
