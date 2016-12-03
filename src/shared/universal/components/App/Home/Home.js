/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import { GoogleMap } from 'react-google-maps';
import ScriptjsLoader from 'react-google-maps/lib/async/ScriptjsLoader';

function Home() {
  const containerElement = (
    <div
      {...this.props}
      style={{
        height: '200px',
      }}
    />
  );

  const googleMapElement = (
    <GoogleMap
      defaultZoom={3}
      defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
      onClick={this.handleMapClick}
    />
  );

  return (
    <article>
      <Helmet title="Home" />

      <ScriptjsLoader
        hostname={'maps.googleapis.com'}
        pathname={'/maps/api/js'}
        query={{ v: '3.0' }}
        loadingElement={
          <div />
        }
        containerElement={containerElement}
        googleMapElement={googleMapElement}
      />
    </article>
  );
}

export default Home;
