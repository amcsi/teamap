/* @flow */

import React from 'react';
import { Match, Miss } from 'react-router';
import Helmet from 'react-helmet';
import { CodeSplit } from 'code-split-component';
import 'normalize.css/normalize.css';
import './DemoApp/globals.css';
import Error404 from './DemoApp/Error404';
import Header from './DemoApp/Header';
import Map from './Map/Map';
import { latLon } from '../types/map';

const defaultCenter : latLon = { lat: 47.514266, lng: 19.0383387 };

function App() {
  return (
    <div style={{ height: '100%' }}>

      <Map
        spanFullPage
        defaultCenter={defaultCenter}
      />

      <div style={{ position: 'relative', zIndex: 10, padding: '10px' }}>
        {/*
         All of the following will be injected into our page header.
         @see https://github.com/nfl/react-helmet
         */}
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          titleTemplate={`Teamap - %s`}
          defaultTitle="Teamap"
          meta={[
            { name: 'description', content: 'Teamap - Team coordination map app' },
            // Default content encoding.
            { name: 'charset', content: 'utf-8' },
            // @see http://bit.ly/2f8IaqJ
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
            // This is important to signify your application is mobile responsive!
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            // Providing a theme color is good if you are doing a progressive
            // web application.
            { name: 'theme-color', content: '#2b2b2b' },
          ]}
          link={[
            // When building a progressive web application you need to supply
            // a manifest.json as well as a variety of icon types. This can be
            // tricky. Luckily there is a service to help you with this.
            // http://realfavicongenerator.net/
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
            { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
            { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
            { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#00a9d9' },
            // Make sure you update your manifest.json to match your application.
            { rel: 'manifest', href: '/manifest.json' },
          ]}
          script={[]}
        />

        <Header />

        <Match
          exactly
          pattern="/"
          render={routerProps =>
            <CodeSplit chunkName="home" modules={{ Home: require('./DemoApp/Home') }}>
              { ({ Home }) => Home && <Home {...routerProps} /> }
            </CodeSplit>
          }
        />

        <Match
          pattern="/posts"
          render={routerProps =>
            <CodeSplit chunkName="posts" modules={{ Posts: require('./DemoApp/Posts') }}>
              { ({ Posts }) => Posts && <Posts {...routerProps} /> }
            </CodeSplit>
          }
        />

        <Match
          pattern="/about"
          render={routerProps =>
            <CodeSplit chunkName="about" modules={{ About: require('./DemoApp/About') }}>
              { ({ About }) => About && <About {...routerProps} /> }
            </CodeSplit>
          }
        />

        <Miss component={Error404} />
      </div>
    </div>
  );
}

export default App;
