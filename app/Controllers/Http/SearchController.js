'use strict'

const Artwork = use('App/Models/Artwork');
const Event = use('App/Models/Event');
const User = use('App/Models/User')
class SearchController {
	async home({request, response}){
		const palabra = request.input('busqueda')
		const resultados = []

		const busqueda = "%" + palabra + "%"

		const artworks = Artwork.query().whereRaw('title like ?', busqueda).fetch()
		/*if(artworks){
			for (var i = Things.length - 1; i >= 0; i--) {
				Things[i]
			}
		}*/
		return artworks
	}
}

module.exports = SearchController
