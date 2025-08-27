import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
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


const authLink = setContext((_, { headers }) => {
  // leer token desde localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});


const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

// export default new ApolloClient({
//   link,
//   cache: new InMemoryCache(),
// });

export default client;