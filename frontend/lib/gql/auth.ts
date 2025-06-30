import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
        avatarUrl
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        avatarUrl
      }
    }
  }
`;

export const GOOGLE_AUTH_MUTATION = gql`
  mutation GoogleAuth($token: String!) {
    googleAuth(token: $token) {
      token
      user {
        id
        email
        name
        avatarUrl
      }
    }
  }
`;