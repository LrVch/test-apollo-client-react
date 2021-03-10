import { gql } from '@apollo/client';

export const ADD_LYRIC = gql`
  mutation addLyricToSong($content: String, $songId: ID!) {
    addLyricToSong(content: $content, songId: $songId) {
      id
      content
      likes
    }
  }
`;