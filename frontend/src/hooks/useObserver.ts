import { Observer } from "@/Observer";

const observers: Record<string, Observer> = {}

export const useObserver = (id: string) => {
    if (!observers[id]) observers[id] = new Observer()
    return observers[id]
}