import { client } from '../../index'

export default class Events {
    levelUp({ target, guild }) {
        const args = {
            target,
            guild,

        }

        client.eventHook.emit('levelUp', { ...args })
    }
}