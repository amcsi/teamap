/* @flow */

import React from 'react';
import Menu from './Menu';

function Header() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <h1>Teamap</h1>

      <Menu />
    </div>
  );
}

export default Header;
