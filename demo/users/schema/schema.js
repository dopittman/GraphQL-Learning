const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

const users = [
    {id: '23', firstName: 'Bill', age: 20},
    {id: '47', firstName: 'Samantha', age: 21},
    {id: '12', firstName: 'Alex', age: 22},
    {id: '89', firstName: 'Alex', age: 23},
]

const userType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id:{type: graphql.GraphQLString},
        firstName:{type: graphql.GraphQLString},
        age:{type: graphql.GraphQLInt},
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: userType,
            args: {id: {type: graphql.GraphQLString}},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})

