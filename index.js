// crear un proyecto: -> npm init -y
// instalar dependencias ApolloServer y graphql -> npm install apollo-server graphql
// arrancar node: -> node index.js

// instalamos el paquete uuid para al momento agregar una persona AddPerson
// se nos genere un uuid automáticamente
// npm install uuid

// todas las querys y las mutations van a un mismo endpoint (localhost:4000 en este caso)
// no necesito 1 url para cada acción
/*
curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:4000/ \
    --data '{"query":"mutation Mutation($name: String!, $street: String!, $city: String!, $phone: String) {\n  addPerson(name: $name, street: $street, city: $city, phone: $phone) {\n    name\n    phone\n    address {\n      street\n      city\n    }\n    id\n  }\n}","variables":{"name":"Damian","street":"Carrer Occident","city":"Barcelona","phone":"692200794"}}'
*/

import { ApolloServer, UserInputError, gql } from 'apollo-server'
import { v1 as uuid } from 'uuid'

const persons = [{
    name: "German",
    phone: "111-111-111",
    street: "Calle",
    city: "Barcelona",
    id: "d3a2ee8d-3ec7-41ae-8070-bc5b8b564941"
}, {
    name: "Magela",
    phone: "222-222-222",
    street: "Avenida",
    city: "Madrid",
    id: "5a33e1fd-815b-4211-b3a2-574b67bb994f"
}, {
    name: "Damian",
    street: "Carrer",
    city: "Madrid",
    id: "3b237426-4d88-469f-b5c6-33991da24feb"
}]

// puedo tener elementos que no están en la base de datos tal como address y check
// pero se tienen que agregar también en la definición del objeto
// antes tenía city y street en Person, pero creo una nueva definición de tipo Address
const typeDefs = gql `
    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        address: Address!
        id: ID!
    }

    type Query {
        personCount: Int!
        allPersons: [Person]!
        findPerson(name: String!): Person
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person
    }
`

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => {
            const { name } = args
            return persons.find(person => person.name === name)
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            if (persons.find(p => p.name === args.name)) {
                throw new UserInputError('Name must be unique', {
                    invalidArgs: args.name
                })
            }
            // ...args (es un spreed, contiene todos los valores de un array, para luego agregarle nuevos valores)
            const person = {...args, id: uuid() }
            persons.push(person) // update database with new person
            return person
        }
    },
    // luego de la última query podemos acceder al resultado mediante root
    //Person: {
    // podemos agregar nuevos atributos al resultado
    //address: (root) => `${root.street}, ${root.city}`,
    //}
    // para poder recuperar la definición Address en el campo persona tengo que definirla dentro de Person
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})