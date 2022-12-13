const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type testData {
    text: String! 
    num : Int!
}
type rootQuery {
    hello : testData!
}
 schema {
    query: rootQuery
 }
`);
