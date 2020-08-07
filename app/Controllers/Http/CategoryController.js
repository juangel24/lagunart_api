'use strict'

const Category = use('App/Models/ArtCategory');
const Subcategory = use('App/Models/ArtSubcategory');
class CategoryController {
	async categories(){
		const catego = await Category.query().fetch()
		return {catego}
	}

	async subcategories(){
		const subcat = await Subcategory.query().fetch()
		return {subcat}
	}
}

module.exports = CategoryController
