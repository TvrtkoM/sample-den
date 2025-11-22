import { QueryClient, dehydrate } from "@tanstack/react-query"

export function getServerQueryClient() {
  return new QueryClient()
}

export function getDehydratedState(queryClient: QueryClient) {
  return dehydrate(queryClient)
}