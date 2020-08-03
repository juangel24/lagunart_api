'use strict'
const Tag = use('App/Models/Tag');
class TagController {
	async index({ params }) {
		//const palabra = request.input('busqueda')
		const variable = "%" + params + "%"
		const tags = await Tag.query().whereRaw('name like ?', variable).fetch()
		console.log(variable);
		return variable
	}
}
module.exports = TagController
