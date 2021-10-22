/* eslint-disable import/first */

import { JSDOM } from 'jsdom'
import Storage from 'dom-storage'
import fetch from 'node-fetch'
import { toJS } from 'mobx'
const { window } = new JSDOM('', { url: 'http://localhost:3000/'});

// @ts-ignore
process.env.NODE_ENV = 'development';

(global as any).window = window;
(global as any).document = window.document;
(global as any).history = window.history;
(global as any).localStorage = new Storage();
(global as any).fetch = fetch;
(global as any).toJS = toJS;

import { configure } from "mobx"

configure({
    enforceActions: "never",
})

import { expect } from 'chai'
import { describe, test, beforeEach } from 'mocha'
import { login_store } from '../login/login_store'
import { event_store } from '../behaviour_events/behaviour_event_store'
import { router_store } from '../../router_store'
import { server_post } from '../../server_connector';
import { hydrate } from '../../../../server/scripts/hydration'


describe('behaviour_event', () => {
    beforeEach(async () => {
        await hydrate()
    })

    test('black box test', async () => {
        login_store.username = 'john'
        login_store.password = 'test'
        await login_store.login()

        window.location.hash = '#/events/update?event_id=5'
        router_store.hash = window.location.hash
        router_store.query.event_id = '5'

        await event_store.on_component_load()

        // check event loaded
        expect(event_store.comment === null).to.equal(true)
        expect(event_store.behaviour_id === 2).to.equal(true)
        expect(event_store.timestamp.toString() === "Sun Oct 03 2021 17:05:22 GMT-0400 (Eastern Daylight Time)").to.equal(true)
        
        // behaviour list loaded
        expect(event_store.behaviours.length).to.be.greaterThan(0)

        // check getting and setting dates
        // TODO: bug found here where month was displaying one previous since javascript
        // getMonth is 0-indexed
        event_store.set_date_time('2021-10-03T17:05')
        expect(event_store.get_date_time()).to.equal('2021-10-03T17:05')
        
        event_store.comment = 'test comment'

        await event_store.save()

        const result = await server_post('/prisma/behaviourEvent/findMany', {
            where: {
                id: 5
            }
        })

        expect(result[0].comment).to.equal('test comment')

        // TODO: clean up test setup into a function
    })

    
})