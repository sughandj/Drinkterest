import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import { expect } from 'chai';
import sinon from 'sinon';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('renders unauthorized navbar', () => {
  const wrapper = mount((
    <div>
      <Navbar/>
    </div>
  ));
  
  expect(wrapper.contains(
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top"><a className="navbar-brand" href="/">Drinkterest</a><button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button><div className="collapse navbar-collapse" id="navbar"></div></nav>
  )).to.equal(true);
});

it('renders authorized browse', () => {
  const wrapper = mount((
    <div>
      <Navbar authorized={"test"}/>
    </div>
  ));

  expect(wrapper.contains(
    <li className="nav-item active"><a className="nav-link">Browse</a></li>
  )).to.equal(true);
});

it('renders authorized favorites', () => {
  const wrapper = mount((
    <div>
      <Navbar authorized={"test"} navigate={"favorites"}/>
    </div>
  ));

  expect(wrapper.contains(
    <li className="nav-item active"><a className="nav-link">Favorites</a></li>
  )).to.equal(true);
});

it('renders authorized browse click', () => {
  const onBrowseClick = sinon.spy();
  const wrapper = mount((
    <div>
      <Navbar authorized={"test"} onBrowseClick={onBrowseClick}/>
    </div>
  ));

  wrapper.find('.active > a').simulate('click');
  expect(onBrowseClick).to.have.property('callCount', 1);
});

it('renders authorized favorites click', () => {
  const onFavoritesClick = sinon.spy();
  const wrapper = mount((
    <div>
      <Navbar authorized={"test"} navigate={"favorites"} onFavoritesClick={onFavoritesClick}/>
    </div>
  ));

  wrapper.find('.active > a').simulate('click');
  expect(onFavoritesClick).to.have.property('callCount', 1);
});
