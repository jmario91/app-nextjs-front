import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// const client = new ApolloClient({
//   //uri: 'http://localhost:4000/graphql', // backend GraphQL
//  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL!,
//   cache: new InMemoryCache(),
// });

// export default client;
const link = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:4000/graphql',
  credentials: 'include', // si usas cookies; si no, puedes quitarlo
  fetchOptions: { mode: 'cors' },
});

export default new ApolloClient({
  link,
  cache: new InMemoryCache(),
});