import USER from './user';

const ENTITIES = {
  STATS,
  WALLET,
  PAYMENT,
  USER,
};

const CONNECTION_ATTEMPTS = 10;

class Socket {

  static instance = null;

  static getInstance(cb = function() {}, utils = {}) {
    if (!Socket.instance) {
      Socket.instance = new this(cb, utils);
    }
    Socket.instance.connectionAttempts = 0;
    Socket.instance.connect(cb);

    return Socket.instance;
  }

  constructor(cb = function() {}, utils = {}) {
    this.instance = null;
    this.utils = utils;
    this.connectionAttempts = 0;

    cb && cb();
  }

  connect(cb = function() {}) {
    if (this.socket) {
      if (!this.socket.connected) {
        this.socket.connect();
      }

      return false;
    }


    // this.socket = io(io_url, {path: io_path, transports: ['websocket']});

    this.socket.on('connect', (err) => {
      if (err) {
        console.log(err)
        return this.socket.connect();
      }
      
      this.injectEntity('USER');
    });

    this.socket.on('disconnect', (err) => {
      if (this.connectionAttempts < CONNECTION_ATTEMPTS) {
        this.socket.connect();
        this.connectionAttempts++;
      }

      this.ejectEntity('USER');
    });

    this.socket.on('connect_error', () => {
      setTimeout(() => this.socket.connect(), 10000)
    })

    this.socket.on('unauthorized', (err, data) => {
      // 
    })
  }

  disconnect() {
    this.socket.disconnect();
  }

  injectEntity(entity) {
    this[entity] = ENTITIES[entity](this);
    this[entity].initListeners()
  }

  ejectEntity(entity) {
    if (this[entity]) {
      this[entity].removeListeners();
      this[entity] = null;
      delete this[entity];
    }
  }
}

export default Socket.getInstance();
