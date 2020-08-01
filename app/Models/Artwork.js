'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Artwork extends Model {
	static get createdAtColumn() { return null }
	static get updatedAtColumn() { return null }

	coments(){
		return this.hasMany('App/Models/Message', 'id', 'artwork_id')
	}

	chapters(){
		return this.hasMany('App/Models/Chapter')
	}

	tags(){
		return this.belongsToMany('App/Models/Tag').pivotTable('artworks_has_tags')
	}
}

module.exports = Artwork
