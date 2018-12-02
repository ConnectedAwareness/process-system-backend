import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';

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

@Injectable()
export class BooleanPipe implements PipeTransform<string, boolean> {
    transform(value: string, metadata: ArgumentMetadata): boolean {
        if (!value) return false;

        return value.toLowerCase() === 'true' ? true : false;
    }
}

@Injectable()
export class NumberPipe implements PipeTransform<string, number> {
    transform(value: string, metadata: ArgumentMetadata): number {
        if (!value) return null;

        return Number(value);
    }
}