'use strict'

const Artwork = use('App/Models/Artwork');
const Event = use('App/Models/Event');
const User = use('App/Models/User')
const Db = use('Database')
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

		// Categories of art posted by user
		const userArtCategories = await Db.select(
			'art_categories.*',
			'art_subcategories.*'
		  ).from('art_categories')
			.join('art_subcategories', 'art_categories.id', 'art_subcategories.art_categories_id')
			.join('artworks', 'art_subcategories.id', 'artworks.art_subcategory_id')
			.join('users', 'artworks.user_id', 'users.id')
			.where('users.id', usuario.id)
			.groupBy('art_subcategories.id')

		return {artworks, eventos, userArtCategories}
	}
}

module.exports = SearchController
