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

	async user({request, response}){
		const palabra = request.input('busqueda')
		const id = request.input('id')

		const busqueda = "%" + palabra + "%"

		const usuario = await User.findBy('id',id)
		const eventos = await usuario.events().whereRaw('tittle like ?', busqueda).fetch()
		const artworks = await usuario.artworks().whereRaw('title like ?', busqueda).fetch()

		return {artworks, eventos}
	}
}

module.exports = SearchController
