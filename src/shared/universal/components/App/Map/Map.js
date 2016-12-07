/* @flow */
import React from 'react';
import { GoogleMap } from 'react-google-maps';
import ScriptjsLoader from 'react-google-maps/lib/async/ScriptjsLoader';
import { latLon } from '../../../types/map';

type Props = {
  spanFullPage: ?boolean,
  defaultCenter: latLon,
};

/** @class Map */
function Map(props : Props) {
  const containerElement = (
    <div
      style={{
        height: '200px',
        ...(props.spanFullPage ? { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, height: '100%', width: '100%' } : {}),
      }}
    />
  );

  const googleMapElement = (
    <GoogleMap
      defaultZoom={15}
      defaultCenter={props.defaultCenter}
    />
  );

  return (
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
  );
}

export default Map;
