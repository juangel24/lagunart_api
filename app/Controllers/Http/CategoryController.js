'use strict'

const Category = use('App/Models/ArtCategory');
const Subcategory = use('App/Models/ArtSubcategory');
class CategoryController {
	async categories(){
		return Category.query().fetch()
	}

	async subcategories(){
		const subcat = await Subcategory.query().fetch()
		return {subcat}
	}
}

module.exports = CategoryController
