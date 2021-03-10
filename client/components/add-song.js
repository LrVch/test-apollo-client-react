import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { ADD_SONG } from '../queries/add-song';
import { GET_SONGS } from '../queries/get-songs';

export const AddSong = () => {
  const [ value, setValue ] = useState('');
  const history = useHistory();
  const [addSong, loading] = useMutation(ADD_SONG, {
    // onCompleted() {
    //   history.push('/');
    // },
    // refetchQueries: [{ query: GET_SONGS }]
  });

  return (
    <div>
      <label>Song Title :
        <input value={value} onChange= {e => setValue(e.target.value)} type="text" />
      </label>
      <button disabled={!value} onClick={() => { 
        addSong({
          variables: { title: value },
          optimisticResponse: {
            __typename: "Mutation",
            addSong: {
              __typename: "SongType",
              title: value,
              id: null,
              lyrics: [],
            }
          },
          update: (proxy, { data: { addSong } }) => {
            console.log('addSong', addSong)
            const data = proxy.readQuery({ query: GET_SONGS });
            console.log('data', data);

            proxy.writeQuery({ query: GET_SONGS, data: Object.assign({}, data,
              { 
                songs: [...data.songs, addSong]
              }
            )});
          }
        });
        setValue('');
        history.push('/');
        }}>Add song</button>
    </div>
  )
}