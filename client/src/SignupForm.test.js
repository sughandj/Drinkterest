import React from 'react';
import ReactDOM from 'react-dom';
import SignupForm from './SignupForm';
import { expect } from 'chai';
import sinon from 'sinon';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('renders authorized signin click', () => {
  const onSignupClick = sinon.spy();
  const wrapper = mount((
    <div>
      <SignupForm onSignupClick={onSignupClick}/>
    </div>
  ));

  wrapper.find('.btn-primary').simulate('click');
  expect(onSignupClick).to.have.property('callCount', 1);
});

it('renders authorized signup click', () => {
  const onSigninNavigate = sinon.spy();
  const wrapper = mount((
    <div>
      <SignupForm onSigninNavigate={onSigninNavigate}/>
    </div>
  ));

  wrapper.find('.btn-secondary').simulate('click');
  expect(onSigninNavigate).to.have.property('callCount', 1);
});
