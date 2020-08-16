'use strict'

const Artwork = use('App/Models/Artwork');
const Event = use('App/Models/Event');
const User = use('App/Models/User')
const User = use('App/Models/User');
const ArtSubcategory = use('App/Models/ArtSubcategory');
const ArtCategory = use('App/Models/ArtCategory');
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
		// const userArtCategories = await Db.select(
		// 	'art_categories.*',
		// 	'art_subcategories.*'
		//   ).from('art_categories')
		// 	.join('art_subcategories', 'art_categories.id', 'art_subcategories.art_categories_id')
		// 	.join('artworks', 'art_subcategories.id', 'artworks.art_subcategory_id')
		// 	.join('users', 'artworks.user_id', 'users.id')
		// 	.where('users.id', usuario.id)
		// 	.groupBy('art_subcategories.id')

		// return {artworks, eventos, userArtCategories}

		const arts = artworks.rows

		var subcatego = {}
		for (var i = 0; i < arts.length; i++) {
			subcatego = await ArtSubcategory.findBy('id', arts[i].art_subcategory_id)
			arts[i].subcategory = subcatego
			category = await ArtCategory.findBy('id', arts[i].art_category_id)
			arts[i].category = category
		}
		
		return {arts, eventos}
	}
}

module.exports = SearchController
