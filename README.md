# graphql-apolloserver

crear un proyecto:
```
npm init -y
```

instalar dependencias ApolloServer y graphql
```
npm install apollo-server graphql
```

arrancar node
```
node index.js
```

instalamos el paquete uuid para al momento agregar una persona AddPerson
se nos genere un uuid automáticamente
```
npm install uuid
```

todas las querys y las mutations van a un mismo endpoint (localhost:4000 en este caso)
no necesito 1 url para cada acción

```
curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:4000/ \
    --data '{"query":"mutation Mutation($name: String!, $street: String!, $city: String!, $phone: String) {\n  addPerson(name: $name, street: $street, city: $city, phone: $phone) {\n    name\n    phone\n    address {\n      street\n      city\n    }\n    id\n  }\n}","variables":{"name":"Damian","street":"Carrer","city":"Barcelona","phone":"111222333"}}'
```
