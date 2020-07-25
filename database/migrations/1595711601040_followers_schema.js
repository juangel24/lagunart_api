'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowersSchema extends Schema {
  up () {
    this.create('followers', (table) => {
    	table.integer('follower').unsigned().references('id').inTable('users').notNullable()
    	table.integer('followed').unsigned().references('id').inTable('users').notNullable()
    	table.boolean('is_followed').notNullable()
    })
  }

  down () {
    this.drop('followers')
  }
}

module.exports = FollowersSchema
