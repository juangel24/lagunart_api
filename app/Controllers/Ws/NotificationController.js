'use strict'

const Notification = use('App/Models/Notification');
const User = use('App/Models/User');
class NotificationController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  async onNotification(variable){
  	let user = await User.find(variable.user)
  	let segu = await user.followers().fetch()
  	let seguidores = segu.rows
  	let notificacion = new Notification()
  	notificacion.content = variable.content
  	notificacion.type = variable.type
  	notificacion.user_id = variable.user
  	await notificacion.save()

  	for (var i = 0; i < seguidores.length; i++) {
  		try{
  			user = await User.find(seguidores[i].follower)
	  		await user.user_notifications().save(notificacion)
  		}catch(error){
  			console.log(error)
  		}
  	}

  	this.socket.broadcastToAll('notificacion', notificacion)
  }
}

module.exports = NotificationController
