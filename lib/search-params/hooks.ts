import "client-only";
import { Options, parseAsBoolean, useQueryState, useQueryStates } from "nuqs";
import { samplesSearchParams } from "./models";

export const useSamplesSearchParams = (options?: Options) => useQueryStates(samplesSearchParams, options)

export const useCartDrawerOpen = () => useQueryState("cart", parseAsBoolean.withDefault(false));
