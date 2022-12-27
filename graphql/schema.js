const { buildSchema } = require("graphql");
module.exports = buildSchema(`

input userInputData{
    email:String!
    password: String!
    name: String!
}
type Post{
    _id: ID!
    title:String!
    content: String!
    imageUrl : String!
    creator: User!
    createdAt : String!
    updatedAt : String!

}
type User{
    _id :ID!
    name:String!
    email:String!
    password:String!
    post:[Post!]!

}
type rootMutation{
    createUser(userInput: userInputData) : User!
}
type loginData{
    token: String!
    userId : String!
}
type rootQuery{
    login(email:String, password:String): loginData
}
schema {
    mutation: rootMutation
    query: rootQuery
}
`);
