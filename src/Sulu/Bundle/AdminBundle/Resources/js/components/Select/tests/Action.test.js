// @flow
import {render, shallow} from 'enzyme';
import React from 'react';
import Action from '../Action';

test('The component should render', () => {
    const onClick = jest.fn();
    const afterAction = jest.fn();
    const action = render(<Action afterAction={afterAction} onClick={onClick} value="my-option">My action</Action>);
    expect(action).toMatchSnapshot();
});

test('The component should call the callbacks after a click', () => {
    const onClick = jest.fn();
    const afterAction = jest.fn();
    const action = shallow(<Action afterAction={afterAction} onClick={onClick} value="my-option">My action</Action>);
    action.find('button').simulate('click');
    expect(onClick).toBeCalled();
    expect(afterAction).toBeCalled();
});

test('The component should call the callbacks after press enter', () => {
    const onClick = jest.fn();
    const afterAction = jest.fn();
    const action = shallow(<Action afterAction={afterAction} onClick={onClick} value="my-option">My action</Action>);
    action.find('button').simulate('keydown', {key: 'Enter', preventDefault: jest.fn(), stopPropagation: jest.fn()});
    expect(onClick).toBeCalled();
    expect(afterAction).toBeCalled();
});

test('The component should call the callbacks after press space', () => {
    const onClick = jest.fn();
    const afterAction = jest.fn();
    const action = shallow(<Action afterAction={afterAction} onClick={onClick} value="my-option">My action</Action>);
    action.find('button').simulate('keydown', {key: ' ', preventDefault: jest.fn(), stopPropagation: jest.fn()});
    expect(onClick).toBeCalled();
    expect(afterAction).toBeCalled();
});

test('The component should call the onClick callbacks without a value', () => {
    const onClick = jest.fn();
    const action = shallow(<Action onClick={onClick}>My action</Action>);

    action.find('button').simulate('click');
    expect(onClick).toBeCalledWith(undefined);
});

test('The component should call the onClick callbacks with its value', () => {
    const onClick = jest.fn();
    const action = shallow(<Action onClick={onClick} value="my-value">My action</Action>);

    action.find('button').simulate('click');
    expect(onClick).toBeCalledWith('my-value');
});

test('A hover on the component should fire the callback', () => {
    const onClick = jest.fn();
    const requestFocusSpy = jest.fn();
    const action = shallow(
        <Action onClick={onClick} requestFocus={requestFocusSpy} value="my-value">My action</Action>
    );
    action.find('li').simulate('mousemove');
    expect(requestFocusSpy).toBeCalled();
});
