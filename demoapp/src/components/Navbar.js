import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
        <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Helper4U</a>
   
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to="/">AdminPanel</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to="/candidateportal">CandidatePanel</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to="/chatbot">ChatBot</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to="/search-jobs">DummyBot</Link>
        </li>
       
      </ul>
      
    </div>
  </div>
</nav>
      
    </div>
  )
}

export default Navbar
