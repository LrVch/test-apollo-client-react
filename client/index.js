import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { SontList } from './components/songList';
import { AddSong } from './components/add-song';
import { Song } from './components/song';

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          songs: {
            merge(existing = [], incoming) {
              console.log('existing', existing);
              console.log('incoming', incoming);
              return incoming;
            },
          },
          // lyrics: {
          //   merge(existing = [], incoming) {
          //     console.log('existing', existing);
          //     console.log('incoming', incoming);
          //     return incoming;
          //   },
          // }
        },
      },
      SongType: {
        fields: {
          lyrics: {
            merge(existing = [], incoming) {
              console.log('existing', existing);
              console.log('incoming', incoming);
              return incoming;
            },
          }
        },
      }
    },
  }),
  uri: 'http://localhost:4000/graphql',
});

const Root = () => (
  <Router>
    <ApolloProvider client={client}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/songs/new">Add song</Link>
        </li>
      </ul>
      <Switch>
        <Route exact path="/">
          <SontList/>
          {/* <br/>
          <br/>
          <SontList/> */}
        </Route>
        <Route exact path="/songs/new">
          <AddSong />
        </Route>
        <Route exact path="/songs/:id">
          <Song />
        </Route>
      </Switch>
    </ApolloProvider>
  </Router>
);

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
