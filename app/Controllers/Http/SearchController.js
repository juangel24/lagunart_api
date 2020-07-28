'use strict'

const Artwork = use('App/Models/Artwork');
const Artcategory = use('App/Models/ArtCategory');
class SearchController {
	async store({request,response}){
		const data = request.only([
			'title', 'description', 'art_subcategory_id', 'is_adult_content', 'user_id', 'views', 'is_private', 'path_img'
		])
	artwork = await Artwork.create(data)
	}

	async pruebon({request,response,view}){
		let categoria = await Artcategory.findBy('id',1)
		let subcategoria = await categoria.subcategory().fetch()
		return response.json(subcategoria)
	}
}

module.exports = SearchController
