import React from 'react';
import ReactDOM from 'react-dom';
import SigninForm from './SigninForm';
import { expect } from 'chai';
import sinon from 'sinon';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('renders authorized signin click', () => {
  const onSigninClick = sinon.spy();
  const wrapper = mount((
    <div>
      <SigninForm onSigninClick={onSigninClick}/>
    </div>
  ));

  wrapper.find('.btn-primary').simulate('click');
  expect(onSigninClick).to.have.property('callCount', 1);
});

it('renders authorized signup click', () => {
  const onSignupNavigate = sinon.spy();
  const wrapper = mount((
    <div>
      <SigninForm onSignupNavigate={onSignupNavigate}/>
    </div>
  ));

  wrapper.find('.btn-secondary').simulate('click');
  expect(onSignupNavigate).to.have.property('callCount', 1);
});
