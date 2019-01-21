import React, { Component } from "react";
import { Route, Switch, Redirect, Link } from "react-router-dom";
import api from 'utils/api';
import _get from 'lodash/get';

import { wrapFetchData, getDefaultData } from 'helpers/getters';

import "styles/main.styl";
import s from "styles/main.styl";

export class Page1 extends Component {

  static async fetchData() {
    return api.call('test')
  }

  state = {
    message: getDefaultData(this.props, {message: ''}).message
  }

  componentDidMount() {
    wrapFetchData(this.constructor.fetchData, 123)
      .then(res => {
        this.setState({message: res.data.message})
      })
  }

  render() {
    return (
      <div>
        <div className={s.error + ' ' + s.mT1}>{`Hello Page 1 + ${this.state.message}`}</div>
      </div>
    )
  }
}

class Page2 extends Component {

  render() {
    return (
      <div>
        <div>Hello Page 2</div>
      </div>
    )
  }
}

export default class Application extends Component {

  state = {
    message: ''
  }

  render() {
    return (
      <div>
        <ul>
          <li><Link to='/'>Page 1 + {this.state.message}</Link></li>
          <li><Link to='/2'>Page 2</Link></li>
        </ul>
        <Switch>
          <Route exact path='/' component={Page1} />
          <Route path='/2' component={Page2} />
          <Redirect to="/"/>
        </Switch>
      </div>
    )
  }
}

