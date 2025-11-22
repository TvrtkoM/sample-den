import { GraphQLClient } from "graphql-request";

if (!process.env.NEXT_PUBLIC_SANITY_GRAPHQL_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_SANITY_GRAPHQL_ENDPOINT is not set')
}

export const graphqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_SANITY_GRAPHQL_ENDPOINT!);