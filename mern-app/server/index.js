// mongo db
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test5');

// db schema
const Todo = mongoose.model('Todo', {
    text: String,
    complete: Boolean
});

// graph ql server start up
const { GraphQLServer } = require('graphql-yoga');

//db schemas
// first update the db schema and then the implementations
const typeDefs = `
    type Query {
        hello(name: String): String !
        todos: [Todo]
    }
    type Todo {
        id: ID!
        text: String!
        complete: Boolean!
    }
    type Mutation {
        createTodo(text:String!) : Todo
        updateTodo(id: ID!, complete: Boolean!) : Boolean
        removeTodo(id: ID!): Boolean
    }
`

// like a function call for queries
const resolvers = {
    // '_' is the resolver which passes to the parent
    Query: {
        hello: (_, { name }) => `Hello ${name || 'World'}`,
        // return all todo
        todos: () => Todo.find()
    },
    Mutation: {
        createTodo: async (_, { text }) => {
            const todo = new Todo({ text, complete: false });
            todo.save();
            return todo;
        },
        updateTodo: async (_, { id, complete }) => {
            // the { } indicates the field to be updated
            await Todo.findByIdAndUpdate(id, { complete });
            return true;
        },
        removeTodo: async (_, { id }) => {
            // no { } required because we are removing the entire field
            await Todo.findByIdAndRemove(id);
            return true;
        }

    }
}

const server = new GraphQLServer({ typeDefs, resolvers })
mongoose.connection.once('open', () => {
    server.start(() => console.log('Server is running on localhost: 4000'));
})