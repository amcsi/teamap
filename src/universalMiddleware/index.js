/* @flow */

import type { $Request, $Response, Middleware } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerRouter, createServerRenderContext } from 'react-router';
import { Provider } from 'react-redux';
import { CodeSplitProvider, createRenderContext } from 'code-split-component';
import Helmet from 'react-helmet';
import render from './render';
import runTasksForLocation from '../shared/universal/routeTasks/runTasksForLocation';
import App from '../shared/universal/components/App';
import configureStore from '../shared/universal/redux/configureStore';

/**
 * An express middleware that is capabable of doing React server side rendering.
 */
function universalReactAppMiddleware(request: $Request, response: $Response) {
  // We should have had a nonce provided to us.  See the server/index.js for
  // more information on what this is.
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = response.locals.nonce;

  // It's possible to disable SSR, which can be useful in development mode.
  // In this case traditional client side only rendering will occur.
  if (process.env.DISABLE_SSR === 'true') {
    if (process.env.NODE_ENV === 'development') {
      console.log('==> Handling react route without SSR');  // eslint-disable-line no-console
    }
    // SSR is disabled so we will just return an empty html page and will
    // rely on the client to initialize and render the react application.
    const html = render({
      // Nonce which allows us to safely declare inline scripts.
      nonce,
    });
    response.status(200).send(html);
    return;
  }

  // Create the redux store.
  const store = configureStore();
  const { dispatch, getState } = store;

  // Set up a function we can call to render the app and return the result via
  // the response.
  const renderApp = () => {
    // First create a context for <ServerRouter>, which will allow us to
    // query for the results of the render.
    const reactRouterContext = createServerRenderContext();

    // We also create a context for our <CodeSplitProvider> which will allow us
    // to query which chunks/modules were used during the render process.
    const codeSplitContext = createRenderContext();

    // Create our application and render it into a string.
    const app = renderToString(
      <CodeSplitProvider context={codeSplitContext}>
        <ServerRouter
          location={request.url}
          context={reactRouterContext}
        >
          <Provider store={store}>
            <App />
          </Provider>
        </ServerRouter>
      </CodeSplitProvider>
    );

    // Generate the html response.
    const html = render({
      // Provide the full app react element.
      app,
      // Provide the redux store state, this will be bound to the window.APP_STATE
      // so that we can rehydrate the state on the client.
      initialState: getState(),
      // Nonce which allows us to safely declare inline scripts.
      nonce,
      // Running this gets all the helmet properties (e.g. headers/scripts/title etc)
      // that need to be included within our html.  It's based on the rendered app.
      // @see https://github.com/nfl/react-helmet
      helmet: Helmet.rewind(),
      // We provide our code split state so that it can be included within the
      // html, and then the client bundle can use this data to know which chunks/
      // modules need to be rehydrated prior to the application being rendered.
      codeSplitState: codeSplitContext.getState(),
    });

    // Get the render result from the server render context.
    const renderResult = reactRouterContext.getResult();

    // Check if the render result contains a redirect, if so we need to set
    // the specific status and redirect header and end the response.
    if (renderResult.redirect) {
      response.status(301).setHeader('Location', renderResult.redirect.pathname);
      response.end();
      return;
    }

    response
      .status(
        renderResult.missed
          // If the renderResult contains a "missed" match then we set a 404 code.
          // Our App component will handle the rendering of an Error404 view.
          ? 404
          // Otherwise everything is all good and we send a 200 OK status.
          : 200
      )
      .send(html);
  };

  // Execute any 'prefetchData' tasks that get matched for the request location.
  const executingTasks = runTasksForLocation(
    { pathname: request.originalUrl }, ['prefetchData'], { dispatch }
  );

  if (executingTasks) {
    // Some tasks are executing so we will chain the promise, waiting for them
    // to complete before we render the application.
    executingTasks.then(({ routes }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Finished route tasks', routes); // eslint-disable-line no-console,max-len
      }

      // The tasks are complete! Our redux state will probably contain some
      // data now. :)

      // Lets render the app and return the response.
      renderApp();
    });
  } else {
    // No tasks are being executed so we can render and return the response.
    renderApp();
  }
}

export default (universalReactAppMiddleware : Middleware);
