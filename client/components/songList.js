import React from 'react';
import { useQuery, NetworkStatus, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

import { GET_SONGS } from '../queries/get-songs';
import { DELETE_SONG } from '../queries/delete-song';

export const SontList = () => {
  const { error, data: { songs } = {}, loading, refetch, networkStatus } = useQuery(GET_SONGS, {
    notifyOnNetworkStatusChange: true,
    // fetchPolicy: 'cache-and-network',
  });
  const [deleteSong] = useMutation(DELETE_SONG, {
    // refetchQueries: [{ query: GET_SONGS }]
  });

  const isFetching = networkStatus !== NetworkStatus.ready;

  // if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  // console.log('networkStatus', networkStatus);
  // console.log('loading', loading);
  // console.log('songs to render', songs);

  return (
    <div style={{ transition: 'all .3s', opacity: isFetching ? 0.5 : 1}}>
      <ul className="collection">
        {songs && !!songs.length && songs.map((song) => (
          <li className="collection-item" key={song.id}> 
            <Link to={`/songs/${song.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>{song.title}
              <button className="btn-floating red" onClick={(e) => {
                e.preventDefault();
                deleteSong({
                  variables: { id: song.id },
                  optimisticResponse: {
                    __typename: 'Mutation',
                    deleteSong: {
                      id: song.id,
                      __typename: 'SongType',
                    },
                  },
                  update(cache, { data: { deleteSong } }) {
                    // console.log('deleteSong', deleteSong);
                    const data = cache.readQuery({ query: GET_SONGS });
                    
                    // console.log('data', data)
                    // console.log('data.songs', data.songs)
                    // console.log('result', data.songs.filter(song => song.id !== deleteSong.id));
                    const result = Object.assign({}, { songs: data.songs.filter(song => song.id !== deleteSong.id) }  )
                    // console.log('data to cache', result);
                    cache.writeQuery({ query: GET_SONGS, data: result});
                  },
                })
              }}>
                  <i className="large material-icons">delete</i>
                </button>
              </Link>
          </li>
        ))}
      </ul>
      <button disabled={loading} onClick={() => refetch()}>Refetch!</button>
    </div>
  )
}