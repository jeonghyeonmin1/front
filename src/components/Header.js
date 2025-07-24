import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <Link to="/" style={{color: '#fff', textDecoration: 'none'}}>
        <h1 style={{margin: 0, fontSize: '1.7rem', fontWeight: 700, letterSpacing: '-1px'}}>LLM 면접 서비스</h1>
      </Link>
    </header>
  );
}

export default Header;
