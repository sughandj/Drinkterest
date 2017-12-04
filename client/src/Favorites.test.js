import React from 'react';
import ReactDOM from 'react-dom';
import Favorites from './Favorites';
import { expect } from 'chai';
import sinon from 'sinon';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
global.fetch = require('jest-fetch-mock');

it('renders favorites loading', () => {
  fetch.mockResponseOnce(JSON.stringify([]));

  const wrapper = mount((
    <div>
      <Favorites/>
    </div>
  ));
  
  expect(wrapper.contains(
    <h2>Loading...</h2>
  )).to.equal(true);
});

it('renders favorites cards', () => {
  fetch.mockResponseOnce(JSON.stringify([]));
  
  const wrapper = mount((
    <div>
      <Favorites/>
    </div>
  ));
  
  expect(wrapper.contains(
    <div className="card"><h4 className="card-header">Budweiser</h4><div className="card-body"><h5 className="card-title">Light &amp; Malty</h5><h6 className="card-subtitle text-muted">Canada, Ontario</h6></div><img className="card-image" src="https://dx5vpyka4lqst.cloudfront.net/products/311787/images/thumb.png" alt="Budweiser"/><div className="card-body"><p className="card-text">6x473 mL can</p></div><div className="card-footer text-muted"><button id="311787" type="button" className="btn btn-secondary">Favorite</button></div></div>
  )).to.equal(false);
});
