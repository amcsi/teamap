/* @flow */
import React from 'react';
import { GoogleMap } from 'react-google-maps';
import ScriptjsLoader from 'react-google-maps/lib/async/ScriptjsLoader';
import { latLon } from '../../../types/map';

type Props = {
  defaultCenter: latLon,
};

/** @class Map */
function Map(props : Props) {
  const containerElement = (
    <div
      style={{
        height: '200px',
      }}
    />
  );

  const googleMapElement = (
    <GoogleMap
      defaultZoom={3}
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

Map.propTypes = {};

export default (Map);
