import { parseAsInteger, parseAsString } from "nuqs";

export const samplesSearchParams = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault("")
};