import { atom, useAtomValue, useSetAtom } from 'jotai'
import { TopMessageData } from '../types'

const topMessagesAtom = atom<Record<string, TopMessageData>>({})

/**
 * Returns a callback that adds or replaces a top message in the store.
 *
 * @returns A function that accepts {@link TopMessageData} and a unique string `id`,
 * inserting the message under that key (overwriting any existing entry with the same id).
 */
export function useAddTopMessage() {
  const setTopMessages = useSetAtom(topMessagesAtom)

  return (data: TopMessageData, id: string) => {
    setTopMessages((messages) => {
      return {
        ...messages,
        [id]: data,
      }
    })
  }
}

/**
 * Returns a callback that removes a top message from the store by id.
 *
 * @returns A function that accepts a string `id` and deletes the corresponding
 * message entry, leaving all other messages intact.
 */
export function useDismissTopMessage() {
  const setTopMessages = useSetAtom(topMessagesAtom)
  return (id: string) => {
    setTopMessages((messages) => {
      const clone = { ...messages }
      delete clone[id]
      return clone
    })
  }
}

/**
 * Returns the current map of all active top messages.
 *
 * @returns A `Record` keyed by message id, where each value is a {@link TopMessageData} object.
 */
export function useTopMessages() {
  return useAtomValue(topMessagesAtom)
}
