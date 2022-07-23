import React from 'react'
import Todo from '../Todos/Todo' 
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'

test('todo component is rendered on page with correct description', () => {
    const newTodo = {
        text: "Todo created for testing"
    };

    const component = render(<Todo todo={newTodo} onClickComplete={() => {}} onClickDelete={() => {}} />)
    expect(component.container).toHaveTextContent(newTodo.text);
})