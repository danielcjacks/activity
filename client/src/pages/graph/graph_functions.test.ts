import { describe, test } from 'mocha';
import { get_behaviour_size, get_motivator_color } from './graph_functions';
import {expect} from 'chai'


describe('graph_functions', () => {
    describe(get_behaviour_size.name, () => {
        test('correctly applies tanh function', () => {
            const result = Math.round(get_behaviour_size(7, 10) * 1000) / 1000
            expect(result).to.equal(0.794)
        })
        test('handles 0 max behaviours', () => {
            const result = get_behaviour_size(0, 0)
            expect(result).to.equal(0)
        })
    })
    describe(get_motivator_color.name, () => {
        test('correctly interpolates between colours', () => {
            const result = get_motivator_color(7, 0, 10)
            expect(result).to.equal('#7e91ad')
        })
        test('clamps out of bounds positivity', () => {
            const result = get_motivator_color(15, 0, 10)
            expect(result).to.equal('#64b5f6')
        })
    })
})