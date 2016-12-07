/* @flow */

import React from 'react';
import Menu from './Menu';
import { WEBSITE_TITLE } from '../../../constants';

function Header() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <h1>{ WEBSITE_TITLE }</h1>

      <Menu />
    </div>
  );
}

export default Header;
