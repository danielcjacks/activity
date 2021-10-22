import chroma from 'chroma-js'
import { invlerp } from '../../utils/math_utils'


/**
 * @returns a value between 0 and 1
 */
export const get_behaviour_size = (behaviour_events_count, max_behaviour_events) => {
    // Tanh was chosen since it is a strictly increasing function that increases faster near 0. This means that
    // users can still see the difference between behaviours with smaller numbers of behaviour events, even if some other
    // behaviour has alot more events (kind of like how a logarothmic scale makes it easier to see differences in numbers when
    // there is a lot of variation between them).
    // The *1.313 is just a normalizing constant. Basically it makes the range of the function (0, 1) instaed of (0, 0.762)
    // without changing the overall shape.

    if (max_behaviour_events === 0) {
        return 0
    }
    
    const size = Math.tanh(behaviour_events_count / max_behaviour_events) * 1.313
    return size
}

export const get_motivator_color = (
    positivity,
    min_positivity: number,
    max_positivity: number
) => {
    const scale = chroma.bezier(['#F5A47D', '#666', '#64B5F6']).scale()
    const percent = invlerp(min_positivity, max_positivity, positivity)
    const color = scale(percent).hex()
    return color
}