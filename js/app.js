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

		parse: function(rawData){
			// console.log(rawData)
			return rawData.data
		}
	})

	//------------- View -------------//
	var AppView = React.createClass ({

		componentWillMount: function(){
			var self = this
			this.props.gifs.on('sync',function() {self.forceUpdate()})
		},

		render: function(){
			// console.log(this)
			return (
				<div className="pageContainer">
					<Header/>
					<SearchBar/>
					<Scroll gifs={this.props.gifs}/>
				</div>
				)
		}
	})

	var HomeView = React.createClass ({
		render: function(){
			return(
				<div className="pageContainer">
					<Header/>
					<SearchBar />
					<p>Welcome to Iphs! Search above.</p>
				</div>
				)
		}
	})

	var SearchBar = React.createClass ({
		_search: function(keyEvent) {		
			if (keyEvent.keyCode === 13) {
				window.location.hash = `scroll/${keyEvent.target.value}`
				keyEvent.target.value = ""
			}
		},

		render: function(){
			return <input onKeyDown={this._search} />
		}
	})

	var Header = React.createClass({
		render: function() {
			return (
				<div className="titleContainer">
					<h1 className="pageTitle">Iphy</h1>
					<h3 className="subTitle">Search iphs</h3>
				</div>
				)
			}
	})

	var Scroll = React.createClass ({
		_getGifsJSX: function(objArr){
			var gifsArr = []
			var counter = 0
			objArr.forEach(function(gifObj) {
				counter += 1
				var component = <Gif gif={gifObj} key={counter}/>
				gifsArr.push(component)
			})
			return gifsArr
		},

		render: function(){
			var gifs = this._getGifsJSX(this.props.gifs.models)
			console.log(gifs.length)
			return (
				<div className="gifScroll">
					 {gifs}
				</div>
				)
		}
	})

	var Gif = React.createClass ({
		render: function(){
			// console.log(this)
			var gifModel = this.props.gif
			console.log(gifModel.get('slug'))
			return (
				<div className="gif">
					<img src={gifModel.get('images').original.url}/>
				</div>
				)
		}
	})


	//------------- Router -------------//
	var IphyRouter = Backbone.Router.extend ({
		routes: {
			"scroll/:query"  : "handleScrollView",
			"*default"       : "home"
		},

		handleScrollView: function(query){
			this.coll.reset()
			this.coll.fetch({
				data: {
					q: query,
					"api_key": this.coll._apiKey
				}
			})
			DOM.render(<AppView gifs={this.coll} />, document.querySelector('.container'))
			// console.log(this.coll)		
		},

		home: function() {
			location.hash = "home"
			DOM.render(<HomeView/>, document.querySelector('.container'))
		},

		initialize: function() {
			this.coll = new IphyCollection
			Backbone.history.start()
		}
	})

	var rtr = new IphyRouter()
    
}

app()
