'use strict'

const Category = use('App/Models/ArtCategory');
const Subcategory = use('App/Models/ArtSubcategory');
class CategoryController {
	async categories(){
		return Category.query().fetch()
	}

	async subcategories(){
		return Subcategory.query().fetch()
	}
}

module.exports = CategoryController
