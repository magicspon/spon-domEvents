## Install

`yarn add @spon/domevents`

or

`npm install @spon/domevents --save`

```javascript
import domEvents from '@spon/domEvents'

const addEvents = domEvents(document.body)

addEvents({
	'click [data-toggle-button]': (e, elm) => {
		e.preventDefault()
		elm.classList.toggle('is-active')
	}
})
```

All events, by default are delegated to the node given to the initial setup. If you want to delegate to a different element, you can pass in a Dom node as the first argument , eg

```javascript
addEvents(document.querySelector('.my-node'), {
	'click [data-toggle-button]': (e, elm) => {
		e.preventDefault()
		elm.classList.toggle('is-active')
	}
})
```
