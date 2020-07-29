'use strict'

const Artwork = use('App/Models/Artwork');
const Event = use('App/Models/Event');
const User = use('App/Models/User')
class SearchController {
	async home({request, response}){
		const palabra = request.input('busqueda')

		const busqueda = "%" + palabra + "%"

		const artworks = await Artwork.query().whereRaw('title like ?', busqueda).fetch()
		const usuarios = await User.query().whereRaw('name like ?', busqueda).orWhere('username', 'like', busqueda).fetch()
		const eventos = await Event.query().whereRaw('tittle like ?', busqueda).fetch()
		
		return {artworks,usuarios,eventos}
	}
}

module.exports = SearchController
