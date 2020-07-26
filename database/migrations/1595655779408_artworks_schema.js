'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArtworksSchema extends Schema {
  up () {
    this.create('artworks', (table) => {
      table.increments()
      table.string('tittle',100).notNullable()
      table.text('description')
      table.integer('art_subcategory_id').unsigned().references('id').inTable('art_subcategories').notNullable()
      table.boolean('is_adult_content')
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table.integer('views')
      table.boolean('is_private')
      table.string('path_img',45)
    })
  }

  down () {
    this.drop('artworks')
  }
}

module.exports = ArtworksSchema
