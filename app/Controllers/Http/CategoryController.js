'use strict'

const Category = use('App/Models/ArtCategory');
const Subcategory = use('App/Models/ArtSubcategory');
const User = use('App/Models/User');
const Artwork = use('App/Models/Artwork');
class CategoryController {
	async categories(){
		return Category.query().fetch()
	}

	async subcategories(){
		return Subcategory.query().fetch()
	}

	async prueba({request, response}){
		const user = await User.findBy('id', 1)
		const artwork = await Artwork.findBy('id', 1)
		user.congratulations().save(artwork)
		return "listo"
	}
}

module.exports = CategoryController
