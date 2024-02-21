const express = require("express");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
     
        type User{
            id: ID!
            name: String!
            usernaame: String!
            email: String!
            phone: String!
            website: String!
        }
           type ToDo {
            id: ID!
            title: String!
            completed: Boolean
            user:User
        }
        type Query {
            getTodos: [ToDo]
            getUsers:[User]
            getUser(id:ID!):User
        }
        `,
    resolvers: {
      ToDo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.id}`
            )
          ).data,
      },
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUser: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
      },
    },
  });

  app.use(bodyParser.json({}));
  app.use(cors());
  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(3000, () => {
    console.log("Server is Running on Port :- 3000");
  });
}

startServer();
