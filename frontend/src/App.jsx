import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Articles from './components/Articles';
import ArticleEditor from './components/ArticleEditor';
import ViewArticle from './components/ViewArticle';
import Login from './components/Login';
import SignUp from './components/SignUp';

const App = () => {
    return(
        <div>
        <BrowserRouter>
        <Navbar />
        <Routes>
        <Route path="/" element={<Articles />}></Route>
        <Route path='/createarticle' element={<ArticleEditor />}></Route>
        <Route path='/viewarticle/:id' element={<ViewArticle/>}></Route>
        <Route path='/signin' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        </Routes>
        </BrowserRouter>
        </div>
    )
}
export default App;
