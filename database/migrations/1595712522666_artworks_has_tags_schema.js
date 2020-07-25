'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArtworksHasTagsSchema extends Schema {
  up () {
    this.create('artworks_has_tags', (table) => {
    	table.integer('artworks_id').unsigned().references('id').inTable('artworks').notNullable()
    	table.integer('tags_id').unsigned().references('id').inTable('tags').notNullable()
    })
  }

  down () {
    this.drop('artworks_has_tags')
  }
}

module.exports = ArtworksHasTagsSchema
