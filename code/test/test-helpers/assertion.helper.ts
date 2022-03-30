import {expect} from "chai";

let isArray = function (a) {
    return (!!a) && (a.constructor === Array);
}

let isObject = function (a) {
    return (!!a) && (a.constructor === Object);
}

export const assertIsSubset = (subset: Record<string, any>, superset: Record<string, any>) => {
    Object.keys(subset).forEach(key => {
        if (isObject(subset[key])) {
            assertIsSubset(subset[key], superset[key]);
        } else if (isArray(subset[key])) {
            expect(subset[key]).to.equal(superset[key]);
        } else {
            expect(Object.keys(subset)).to.contain(key);
            expect(Object.keys(superset)).to.contain(key);
            expect(subset[key]).to.equal(superset[key]);
        }
    });
}


export const assertIsEqualObject = <ACTUAL, EXPECTED>(actual: ACTUAL, expected: EXPECTED, keys, mappedKeys?: Record<string, (actual: ACTUAL, expected: EXPECTED) => Array<any>>) => {
    for (const key of keys) {
        expect(actual[key]).to.equal(expected[key]);
    }

    if (!mappedKeys) {
        return;
    }
    Object.keys(mappedKeys).forEach((key) => {
        const [actualValue, expectedValue] = mappedKeys[key](actual, expected);
        expect(actualValue).to.equal(expectedValue, `values for key: ${key} are not equal`);

    });
}

export const assertIsEqualArrayOfObjects = <ACTUAL, EXPECTED>(actualItems: Array<ACTUAL>, expectedItems: Array<EXPECTED>, primaryKey: string = 'id', keys: string[], mappedKeys?: Record<string, (actual: ACTUAL, expected: EXPECTED) => Array<any>>) => {
    for (const ai of actualItems) {
        const correspondingExpectedItem = expectedItems.filter(ei => ei[primaryKey] == ai[primaryKey]).pop();
        expect(correspondingExpectedItem, `expectedItem with ${primaryKey}=${ai[primaryKey]} does not exist`).not.undefined;
        if (correspondingExpectedItem) {
            assertIsEqualObject(ai, correspondingExpectedItem, keys, mappedKeys)
        }
    }
}
