'use strict'

class SaveController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  async onCereate(data){
  	console.log('hola')
  }
  async onSave(){}
}

module.exports = SaveController
