import React from 'react';
import ReactDOM from 'react-dom';
import Loading from './Loading';
import { expect } from 'chai';
import sinon from 'sinon';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('renders loading', () => {
  const wrapper = mount((
    <div>
      <Loading/>
    </div>
  ));
  
  expect(wrapper.contains(
    <div id="progress" className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
  )).to.equal(true);
});
