import { v4 } from 'uuid';

export function mapDto<T>(values: Partial<T>, ctor: new () => T): T {
    const instance = new ctor();

    return Object.keys(instance).reduce((acc, key) => {
        acc[key] = values[key];
        return acc;
    }, {}) as T;
}

export function getId(): string {
    return v4();
}