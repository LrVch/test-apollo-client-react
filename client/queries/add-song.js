import { gql } from '@apollo/client';

export const ADD_SONG = gql`
  mutation addSong($title: String!) {
    addSong(title: $title) {
      id,
      title,
      # lyrics {
      #   id
      #   likes
      #   content
      # }
    }
  }
`;