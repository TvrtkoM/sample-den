import "server-only";
import { createLoader } from "nuqs/server";
import { samplesSearchParams } from "./models";

export const loadSamplesSearchParams = createLoader(samplesSearchParams)
