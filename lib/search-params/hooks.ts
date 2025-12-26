import "client-only";
import { Options, useQueryStates } from "nuqs";
import { samplesSearchParams } from "./models";

export const useSamplesSearchParams = (options?: Options) => useQueryStates(samplesSearchParams, options)
