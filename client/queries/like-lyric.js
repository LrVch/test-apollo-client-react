import { gql } from '@apollo/client';

export const LIKE_LYRIC = gql`
  mutation likeLyric($id: ID!) {
    likeLyric(id: $id) {
      id
      likes
    }
  }
`;