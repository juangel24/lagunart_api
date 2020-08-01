'use strict'

const Notification = use('App/Models/Notification');
const User = use('App/Models/User');
class NotificationController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  async onNotification(variable){
  	let user = await User.find(variable)
  	let notificacion = await user.user_notifications().fetch()
  	this.socket.broadcastToAll('notificaciones', notificacion)
  }
}

module.exports = NotificationController
