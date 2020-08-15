'use strict'

const Artwork = use('App/Models/Artwork');
const Event = use('App/Models/Event');
const User = use('App/Models/User')
class SearchController {
	async home({params}){
		const palabra = params.params

		const busqueda = "%" + palabra + "%"

		const artworks = await Artwork.query().whereRaw('title like ?', busqueda).fetch()
		const usuarios = await User.query().whereRaw('name like ?', busqueda).orWhere('username', 'like', busqueda).fetch()
		const eventos = await Event.query().whereRaw('tittle like ?', busqueda).fetch()
		
		return {artworks,usuarios,eventos}
	}

	async user({params, id}){
		const palabra = params.params
		const user = params.id

		const busqueda = "%" + palabra + "%"

		const usuario = await User.findBy('id',user)
		const eventos = await usuario.events().whereRaw('tittle like ?', busqueda).fetch()
		const artworks = await usuario.artworks().whereRaw('title like ?', busqueda).fetch()

		
		return {artworks, eventos}
	}
}

module.exports = SearchController
