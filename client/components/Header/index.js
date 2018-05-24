import React from 'react';
import { Link } from 'react-router-dom';

import './index.css';

export default function Header() {
  return (
    <div className='header'>
      <Link
        className='name'
        to='/'
      >
      FasTodos
      </Link>
    </div>
  );
}
