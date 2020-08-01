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
  	let notificacion = new Notification()
  	notificacion.content = variable.content
  	notificacion.type = variable.type
  	notificacion.user_id = variable.user
  	notificacion.save()
  	await user.user_notifications().save(notificacion)
  }
}

module.exports = NotificationController
