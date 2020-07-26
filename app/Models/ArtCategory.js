'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ArtCategory extends Model {
	static get createdAtColumn() { return null }
	static get updatedAtColumn() { return null }
	subcategory(){
		return this.belongsTo('App/Models/ArtSubcategory')
	}
}

module.exports = ArtCategory
