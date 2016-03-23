// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from 'backbone'

function app() {
 
	//------------- Model/Collection -------------//
	var IphyCollection = Backbone.Collection.extend ({
		url: "http://api.giphy.com/v1/gifs/search?",
		_apiKey: "dc6zaTOxFJmzC",



	})

	//------------- View -------------//
	var AppView = React.createClass ({
		render: function(){
			// console.log(this)
			return (
				<div className="pageContainer">
					<Scroll gifs = {this.props.gifs.models[0].get('data')}/>
				</div>
				)
		}
	})

	var Scroll = React.createClass ({

		_getGifsJSX: function(objArr){
			var gifsArr = []
			objArr.forEach(function(gifObj) {
				var component = <Gif gif={gifObj} key={gifObj.props} />
				gifsArr.push(component)
			})
			return gifsArr
		},

		render: function(){
			// console.log(this)
			return (
				<div className="gifScroll">
					{this._getGifsJSX(this.props.gifs)}
				</div>
				)
		}
	})

	var Gif = React.createClass ({
		render: function(){
			// console.log(this)
			var gifModel = this.props.gif
			console.log(gifModel)
			return (
				<div className="gif">
					<img src={gifModel.images.original.url}/>
				</div>
				)
		}

	})


	//------------- Router -------------//
	var IphyRouter = Backbone.Router.extend ({
		routes: {
			"scroll/:query" : "handleScrollView",
			"detail/:id"    : "handleDetailView"
		},

		handleScrollView: function(query){
			var coll = new IphyCollection()
			coll.fetch({
				data: {
					q: query,
					"api_key": coll._apiKey
				}
			}).then(function(){DOM.render(<AppView gifs={coll} />, document.querySelector('.container'))})
		},

		initialize: function() {
			Backbone.history.start()
		}
	})

	var rtr = new IphyRouter()

    
}

app()
