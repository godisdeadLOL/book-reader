import { Observer } from "@/Observer";

const observer = new Observer()
export const useChapterObserver = () => {
    return {
        subscribe: (func: any) => observer.subscribe(func),
        unsubscribe: (func: any) => observer.unsubscribe(func),
        notify: (data: any) => observer.notify(data)
    }
}