import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { expect } from 'chai';  
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
global.fetch = require('jest-fetch-mock');

it('renders navbar', () => {
  fetch.mockResponseOnce(JSON.stringify(false));

  const wrapper = mount((
    <div>
      <App/>
    </div>
  ));
  
  expect(wrapper.contains(
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top"><a className="navbar-brand" href="/">Drinkterest</a><button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button><div className="collapse navbar-collapse" id="navbar"></div></nav>
  )).to.equal(true);
});

it('renders info container', () => {
  fetch.mockResponseOnce(JSON.stringify(false));

  const wrapper = mount((
    <div>
      <App/>
    </div>
  ));
  
  expect(wrapper.contains(
    <div id="info"></div>
  )).to.equal(true);
});

it('renders info loading', () => {
  fetch.mockResponseOnce(JSON.stringify(false));

  const wrapper = mount((
    <div>
      <App/>
    </div>
  ));
  
  expect(wrapper.contains(
    <div id="loading"><h2>Loading...</h2><div className="progress"><div id="progress" className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div></div></div>
  )).to.equal(true);
});
