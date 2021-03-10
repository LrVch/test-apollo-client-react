import { gql } from '@apollo/client';

export const GET_SONGS = gql`
  {
    songs {
      title
      id
    }
  }
`;