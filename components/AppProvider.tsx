"use client";

import { auth } from "@/lib/auth";
import {
  isServer,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
import { SessionContext } from "../context/SessionContext";
import { Provider } from "jotai";

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000
      }
    }
  });
};

let browserQueryClient: QueryClient | null = null;

const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
};

type AppProviderProps = {
  children: ReactNode;
  sessionPromise: Promise<typeof auth.$Infer.Session | null>;
};

export default function AppProvider({
  children,
  sessionPromise
}: AppProviderProps) {
  const queryClient = getQueryClient();

  return (
    <SessionContext.Provider value={sessionPromise}>
      <NuqsAdapter>
        <Provider>
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
          </QueryClientProvider>
        </Provider>
      </NuqsAdapter>
    </SessionContext.Provider>
  );
}
