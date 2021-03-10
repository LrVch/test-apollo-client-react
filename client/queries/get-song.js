import { gql } from '@apollo/client';

export const GET_SONG = gql`
  query getSong($id: ID!) {
    song(id: $id) {
      id
      title
      lyrics {
        likes
        content,
        id
      }
    }
  }
`;