#! /usr/bin/env node
export function empty(value: any) {
    return (
        typeof value === 'undefined'
        || value === ''
        || value === null
    ) ? false : true;
}

export function isSetButNotValid(value: any) {
    return (
        typeof value !== 'undefined'
        && (
            value === ''
            || value === null
        )
    ) ? false : true;
}
