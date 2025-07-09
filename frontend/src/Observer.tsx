export class Observer {
    private subscribers: any[] = []

    subscribe(func: any) {
        this.subscribers.push(func)
    }

    unsubscribe(func: any) {
        this.subscribers.splice(this.subscribers.indexOf(func), 1)
    }

    notify(data: any) {
        this.subscribers.forEach(subscriber => subscriber(data))
    }
}