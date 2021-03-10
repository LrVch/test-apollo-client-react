import { gql } from '@apollo/client';

export const DELETE_SONG = gql`
  mutation deleteSong($id: ID!) {
    deleteSong(id: $id) {
      id
      __typename
    }
  }
`;