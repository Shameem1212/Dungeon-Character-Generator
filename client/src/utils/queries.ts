import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      thoughts {
        _id
        thoughtText
        createdAt
      }
    }
  }
`;

export const QUERY_THOUGHTS = gql`
  query getThoughts {
    thoughts {
      _id
      thoughtText
      thoughtAuthor
      createdAt
    }
  }
`;
export const GET_CHARACTERS = gql`
  query GetCharacters {
    getCharacters {
      _id
      name
      class
      race
      subrace
      level
      proficiencies
      equipment
      spells
      notes
      stats {
        strength
        dexterity
        constitution
        intelligence
        wisdom
        charisma
        health
      }
    }
  }
`;



export const QUERY_SINGLE_THOUGHT = gql`
  query getSingleThought($thoughtId: ID!) {
    thought(thoughtId: $thoughtId) {
      _id
      thoughtText
      thoughtAuthor
      createdAt
      comments {
        _id
        commentText
        commentAuthor
        createdAt
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      thoughts {
        _id
        thoughtText
        thoughtAuthor
        createdAt
      }
    }
  }
`;
export const GET_RACES = gql`
  query GetRaces {
    getRaces {
      index
      name
      url
    }
  }
`;
export const GET_CLASSES = gql`
  query GetClasses {
    getClasses {
      index
      name
      url
    }
  }
`;
export const GET_SUBRACES = gql`
  query GetSubraces($raceIndex: String!) {
    getSubraces(raceIndex: $raceIndex) {
      name
      index
    }
  }
`;


export const GET_PROFICIENCIES = gql`
  query GetProficiencies($classIndex: String!, $raceIndex: String!) {
    getProficiencies(classIndex: $classIndex, raceIndex: $raceIndex) {
      static {
        index
        name
        url
      }
      optional {
        index
        name
        url
      }
      chooseAmount
    }
  }
`;
export const DELETE_CHARACTER = gql`
  mutation DeleteCharacter($id: ID!) {
    deleteCharacter(id: $id)
  }
`;
