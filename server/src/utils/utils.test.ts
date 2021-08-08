import { expect } from 'chai';
import { last } from 'lodash';
import { describe, test } from 'mocha';
import { deep_map } from './utils';


describe('utils.ts', () => {
    describe(deep_map.name, () => {
        test('maps over an object', () => {
            const obj = {
                key1: {
                    key2: true
                }
            }

            const result = deep_map(obj, (value, path) => {
                if (last(path) === 'key2') {
                    return false
                }

                if (last(path) === 'key1') {
                    return [value]
                }

                return value
            })

            expect(result).to.deep.equal({
                key1: [{
                    key2: false
                }]
            })
        })
        test('maps over arrays', () => {
            const arr = [1, 2]
            const result = deep_map(arr, (value, path) => {
                return typeof value === 'number' ? value * 2 : value
            })

            expect(result).to.deep.equal([2, 4])
        })
    })
})