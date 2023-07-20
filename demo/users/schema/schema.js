const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLList,
} = graphql;

const users = [
    {id: '23', firstName: 'Bill', age: 20},
    {id: '47', firstName: 'Samantha', age: 21},
    {id: '12', firstName: 'Alex', age: 22},
    {id: '89', firstName: 'Alex', age: 23},
]

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id:{type: graphql.GraphQLString},
        name:{type: graphql.GraphQLString},
        description:{type: graphql.GraphQLString},
        users: {
            type: new graphql.GraphQLList(UserType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(res => res.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id:{type: graphql.GraphQLString},
        firstName:{type: graphql.GraphQLString},
        age:{type: graphql.GraphQLInt},
        company: {type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(resp => resp.data)}
            }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: graphql.GraphQLString}},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data)
            }
        },
        company: {
            type: CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(resp => resp.data)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addUser: {
            type: UserType,
            args: {
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId:{type: GraphQLString}
            },
            resolve(parentValue, {firstName, age}){
                return axios.post('http://localhost:3000/users', {firstName, age})
                .then(res => res.data)
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, {id}){
                return axios.delete(`http://localhost:3000/users/${id}`)
                .then(res => res.data)
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                firstName: {type: GraphQLString},
                lastName: {type: GraphQLString},
                age: {type: GraphQLInt},
                companyId: {type: GraphQLString}
            },
            async resolve(parentValue, args){
                const res = await axios.patch(`http://localhost:3000/users/${args.id}`, args)
                //console.log("the data", res.data)
                return res.data

            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})

