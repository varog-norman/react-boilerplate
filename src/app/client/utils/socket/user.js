export default function USER(context) {
  var self = context || this;

  // Listeners

  var listeners = {
    event: async (type, data) => {
      if (type == 'user:update' && data) {
        // await execute(getCurrentUser)
      }
    }
  }

  function initListeners() {
    Object.keys(listeners).forEach(key => {
      self.socket.on(key, listeners[key])
    })
  }

  function removeListeners() {
    Object.keys(listeners).forEach(key => {
      self.socket.off(key, listeners[key])
    })
  }

  return {
    // listeners
    initListeners,
    removeListeners
  }
}