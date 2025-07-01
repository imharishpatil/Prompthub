import { gql } from "@apollo/client";

export const PROMPT_DETAILS_QUERY = gql`
  query Prompt($id: ID!) {
    prompt(id: $id) {
      id
      title
      content
      tags
      createdAt
      remixCount
      author {
        id
        name
        avatarUrl
      }
      feedbacks {
        id
        comment
        rating
        createdAt
        user {
          id
          name
          avatarUrl
        }
      }
    }
  }
`;