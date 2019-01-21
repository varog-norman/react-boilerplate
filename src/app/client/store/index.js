import React, { Component } from 'react';

import _isEqual from 'lodash/isEqual';
import _get from 'lodash/get';
import _set from 'lodash/set';

class Store {

  static instance = null;

  static getInstance() {
    if (!Store.instance) {
      Store.instance = new this();
    }

    return Store.instance;
  }

  data = {
    modal: {
      show: false
    }
  }

  decorators = {}
  events = {}
}

/**
 * Inject Store decorator
 * @param {*} config = {
 *    name: 'String' = the unique name of target component
 *    props: ['<data key>'] = array of data to inject as props
 * }
 */
export default function injectStore({props = [], name = ''} = {}) {
  return function(Target) {
    class Dummy extends Component {

      constructor(p) {
        super(p)

        if (!name) {
          console.w('\'Name\' is not specified at target ' + Target.name);
        }
        
        this.store = Store.getInstance();
        let decoratorName = name;

        if (this.store.decorators[name]) {
          console.w('\'Name\' should be unique at target ' + Target.name + ' = ' + name);
          decoratorName += `_${Date.now()}`;
        }
        
        this.store.decorators[decoratorName] = this;
        this.config = {
          props
        }
      }

      componentWillUnmount() {
        delete this.store.decorators[name];
      }

      checkIsSetAvailable = (storeEntity = '') => {
        return this.config.props.includes(storeEntity)
      }

      injectEvent = (context, owner, name, method) => {
        this.store.events[name] = {
          owner,
          handler: method.bind(context)
        };
      }

      emit = (name, ...args) => {
        let event = this.store.events[name];

        if (!event) {
          return console.warn('No such event');
        }

        if (!this.store.decorators[event.owner]) {
          return console.warn('Event owner is not mounted');
        }

        return event.handler(...args);
      }

      set = (key, value) => {
        let storeEntity = key.split('.')[0];

        if (!this.checkIsSetAvailable(storeEntity)) {
          return console.warn('You can\'t modify not imported store');
        }

        let shouldUpdate = false;
        
        if (!_isEqual( _get(this.store.data, key, null), value )) {
          shouldUpdate = true;
        }

        if (shouldUpdate) {
          _set(this.store.data, key, value);
  
          Object.keys(this.store.decorators).forEach(key => {
            if (this.store.decorators[key] && this.store.decorators[key].config.props.includes(storeEntity)) {
              this.store.decorators[key].forceUpdate();
            }
          });

        }
      }

      render() {
        let props = {
          ...this.props,
          store: {
            set: this.set,
            injectEvent: this.injectEvent,
            emit: this.emit
          },
          ...Object.keys(this.store.data).reduce((res, key) => {

            if (this.config.props.includes(key)) {
              res[key] = this.store.data[key];
            }

            return res;
          }, {})
        }

        return (
          <Target {...props}/>
        )
      }
    }

    Object.keys(Target).forEach(key => {
      Dummy[key] = Target[key];
    })

    return Dummy;
  }
}