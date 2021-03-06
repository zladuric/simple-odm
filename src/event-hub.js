import EventEmitter from 'events';
import deepcopy from 'deepcopy';

const emitter = new EventEmitter();

/**
 * A singleton event hub
 */
class EventHub {

    /**
     * @param {string|Symbol} eventId - the id of the event
     * @param {function} listener - an listener that listens to the event
     */
    static on (eventId, listener)
    {
        emitter.on(eventId, listener);
    }

    /**
     * @param {string|Symbol} eventId - the id of the event
     * @param {Object} [argObject=null] - arguments sent to event listeners
     * @return {Promise} the promise object that will be resolved when all the listeners of the event are notified
     */
    static async emit (eventId, argObject = null)
    {
        const listeners = emitter.listeners(eventId);
        let result;
        let obj = deepcopy(argObject);

        for (const listener of listeners)
        {
            result = listener.call(null, obj);

            if (result instanceof Promise)
            {
                result = await result;
            }

            obj = Object.assign({}, obj, result);
        }

        return obj;
    }
}

Object.freeze(EventHub);

export default EventHub;