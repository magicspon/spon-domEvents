// @ts-check

import delegate from 'dom-delegate'

/**
 * @typedef {Object} CreateStoreFactory
 * @property {function} add add an item to the store
 * @property {function} delete remove an item from the store
 * @property {Object} store the current store
 */

/**
 * @function createStore
 * @return {CreateStoreFactory}
 */
const createStore = () => {
	const store = {}

	return {
		/**
		 * @function add
		 * @param {string} key
		 * @param {object} value
		 * @return {void}
		 */
		add(key, value) {
			store[key] = value
		},

		/**
		 * @function delete
		 * @param {string} key
		 * @return {void}
		 */
		delete(key) {
			delete store[key]
		},

		get store() {
			return store
		}
	}
}

/**
 * @typedef {Object} EventDelegator
 * @property {function} addEvents add delegated events
 * @property {function} removeEvents remove all events
 * @property {function} removeEvent remove event by key
 */

/**
 * @namespace
 * @function domEvents
 * @param {HTMLElement} node
 * @return {EventDelegator}
 */
function domEvents(node = document.body) {
	const root = delegate(node)
	const eventStore = createStore()

	/**
	 * @memberof domEvents
	 * @function addEvents
	 * @description key/values to delegated events
	 * @param  {...any} args
	 * @return {void}
	 */
	function addEvents(...args) {
		const withRoot = args.length > 1
		const events = withRoot ? args[1] : args[0]
		const rootNode = withRoot ? delegate(args[0]) : root

		Object.entries(events).forEach(([key, fn]) => {
			const [event, ...rest] = key.split(' ')
			const selector = rest.join(' ')
			const func = typeof fn === 'function' ? fn : fn[0]
			const capture = typeof fn === 'function' ? false : fn[1]

			eventStore.add(`${event} ${selector}`, { func, rootNode, capture })
			rootNode.on(event, selector, func, capture)
		})
	}

	/**
	 * @memberof domEvents
	 * @function removeEvent
	 * @description unbind an event by key
	 * @param {string} key
	 * @return {void}
	 */
	function removeEvent(key) {
		const [event, selector] = key.split(' ')
		const { func, rootNode, capture } = eventStore.store[key]
		eventStore.delete(key)

		rootNode.off(event, selector, func, capture)
	}

	/**
	 * @memberof domEvents
	 * @function removeEvents
	 * @description Remove all the events
	 * @return {void}
	 */
	function removeEvents() {
		root.destroy()
	}

	return {
		addEvents,
		removeEvents,
		removeEvent
	}
}

export default domEvents
