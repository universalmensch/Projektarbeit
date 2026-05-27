import type {SolverEvent} from "../types/SolverEvent.ts";


class EventBus<Events extends Record<string, any>> {
    private listeners = new Map<keyof Events, ((e: any) => void)[]>();

    on<K extends keyof Events>(type: K, handler: (event: Events[K]) => void) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type)!.push(handler);
    }

    emit<K extends keyof Events>(event: Events[K]) {
        const handlers = this.listeners.get(event.type);
        if (!handlers) return;
        handlers.forEach(h => h(event));
    }
}

type EventMap = {
    [E in SolverEvent as E["type"]]: E
}

export const eventBus = new EventBus<EventMap>();