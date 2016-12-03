/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import Map from '../Map/Map';
import { latLon } from '../../../types/map';

function Home() {
  const defaultCenter : latLon = { lat: 47.514266, lng: 19.0383387 };

  return (
    <article>
      <Helmet title="Home" />

      <Map
        defaultCenter={defaultCenter}
      />
    </article>
  );
}

export default Home;
