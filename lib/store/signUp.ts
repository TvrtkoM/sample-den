import { useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// Fallback storage for SSR
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const signUpVerificationAtom = atomWithStorage(
  "verification",
  false,
  createJSONStorage(() => typeof window !== 'undefined' ? sessionStorage : noopStorage),
  { getOnInit: true }
);

export const useSignUpVerification = () => {
  return useAtomValue(signUpVerificationAtom)
}

export const useSetSignUpVerification = () => {
  return useSetAtom(signUpVerificationAtom);
}