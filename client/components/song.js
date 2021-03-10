import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';

import { GET_SONG } from '../queries/get-song';
import { ADD_LYRIC } from '../queries/add-lyric';
import { LIKE_LYRIC } from '../queries/like-lyric';

const Row = ({ lyric, id }) => {
  const [likeLyric, { loading: loading }] = useMutation(LIKE_LYRIC);

  return (
    <li className="collection-item">
      <div>{lyric.content}</div>
      <button /* disabled={loading} */ className="btn-floating red" onClick={(e) => {
        likeLyric({
          variables: { id: lyric.id },
          optimisticResponse: {
            __typename: "Mutation",
            likeLyric: {
              id: lyric.id,
              __typename: "LyricType",
              likes: lyric.likes + 1,
            }
          }
        })
      }}>
          <i className="large material-icons">thumb_up</i>
        </button><span>{lyric.likes}</span>
    </li>
  );
}

export const Song = () => {
  const [value, setValue] = useState('');
  const { id } = useParams();
  const { error, data: { song } = {}, loading: loadingSong } = useQuery(GET_SONG, {
    variables: { id },
    notifyOnNetworkStatusChange: true,
  });
  const [addLyric, { loading }] = useMutation(ADD_LYRIC);
  
  // console.log('loading', loading);

  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <h1>Song details</h1>
      {loadingSong && <div>
        'Loading...';
      </div>}
      {song && <div>
        <h2>{song.title}</h2>

        <ul className="collection">
          {song.lyrics.map((elem, index) => (
            <Row lyric={elem} id={id} key={index} />
          ))}
        </ul>

        <label>Add lyrics :
          <input value={value} onChange= {e => setValue(e.target.value)} type="text" />
        </label>
        <button disabled={!value} onClick={() => { 
          addLyric({
            variables: { content: value, songId: id },
            optimisticResponse: {
              __typename: "Mutation",
              addLyricToSong: {
                __typename: "LyricType",
                content: value,
                likes: 0,
                id: null
              }
            },
            update: (proxy, { data: { addLyricToSong } }) => {
              console.log('addLyricToSong', addLyricToSong)
              const data = proxy.readQuery({ query: GET_SONG, variables: { id }, });
              console.log('data', data);

              proxy.writeQuery({ query: GET_SONG, variables: { id }, data: Object.assign({}, data,
                { 
                  song: Object.assign({}, data.song, {
                    lyrics: [...data.song.lyrics, addLyricToSong]
                  })
                }
              )});
            }
          })
          setValue('');
        }}>Add lyrics</button> {loading && <span>loading...</span> }
      </div>}
      
    </div>
  )
}