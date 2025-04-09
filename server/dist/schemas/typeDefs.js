const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    thoughts: [Thought]!
  }

  type Thought {
    _id: ID
    thoughtText: String
    thoughtAuthor: String
    createdAt: String
    comments: [Comment]!
  }

  type Comment {
    _id: ID
    commentText: String
    createdAt: String
  }

  input ThoughtInput {
    thoughtText: String!
    thoughtAuthor: String!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Race {
    index: String!
    name: String!
    url: String!
  }

  type Class {
    index: String!
    name: String!
    url: String!
  }

  type Subrace {
    index: String
    name: String
    url: String
  }

  input CharacterInput {
    name: String!
    class: String!
    race: String!
    subrace: String
    level: Int!
    stats: StatsInput
    proficiencies: [String]
    equipment: [String]
    spells: [String]
    notes: String
  }

  input StatsInput {
    strength: Int
    dexterity: Int
    constitution: Int
    intelligence: Int
    wisdom: Int
    charisma: Int
    health: Int
  }

  type Character {
    _id: ID!
    name: String!
    class: String!
    race: String!
    subrace: String
    level: Int!
    owner: ID
    stats: Stats
    proficiencies: [String]
    equipment: [String]
    spells: [String]
    notes: String
  }

  type Stats {
    strength: Int
    dexterity: Int
    constitution: Int
    intelligence: Int
    wisdom: Int
    charisma: Int
    health: Int
  }

  type Proficiency {
    index: String
    name: String
    url: String
  }

  type ProficiencyResult {
    static: [Proficiency]
    optional: [Proficiency]
    chooseAmount: Int
  }

  type Query {
    users: [User]
    user(username: String!): User
    thoughts: [Thought]!
    thought(thoughtId: ID!): Thought
    me: User
    getRaces: [Race]
    getSubraces(raceIndex: String!): [Subrace]
    getClasses: [Class]
    getProficiencies(classIndex: String!, raceIndex: String!): ProficiencyResult
    getCharacters: [Character]
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    addThought(input: ThoughtInput!): Thought
    addComment(thoughtId: ID!, commentText: String!): Thought
    removeThought(thoughtId: ID!): Thought
    removeComment(thoughtId: ID!, commentId: ID!): Thought
    createCharacter(input: CharacterInput!): Character
    deleteCharacter(id: ID!): Boolean
    updateCharacter(id: ID!, input: CharacterInput!): Character
  }
`;
export default typeDefs;
