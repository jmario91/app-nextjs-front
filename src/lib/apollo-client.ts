import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  //uri: 'http://localhost:4000/graphql', // backend GraphQL
 uri: process.env.NEXT_PUBLIC_GRAPHQL_URL!,
  cache: new InMemoryCache(),
});

export default client;