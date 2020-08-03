'use strict'
const Tag = use('App/Models/Tag');
class TagController {
	async index({ params }) {
		const variable = "%" + params.params + "%"
		const tags = await Tag.query().whereRaw('name like ?', variable).fetch()
		return tags
	}
}
module.exports = TagController
