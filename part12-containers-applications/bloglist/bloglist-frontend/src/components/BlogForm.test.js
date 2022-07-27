import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('', () => {
  const addBlog = jest.fn()
  render(<BlogForm addBlog={addBlog} />)

  const titleInput = screen.getByPlaceholderText('Title of the blog')
  const authorInput = screen.getByPlaceholderText('Author of the blog')
  const urlInput = screen.getByPlaceholderText('Url for the blog')
  const createButton = screen.getByText('Create')

  userEvent.type(titleInput, 'Best blog in Finland')
  userEvent.type(authorInput, 'Jarkko')
  userEvent.type(urlInput, 'testurl.com')
  userEvent.click(createButton)
  expect(addBlog.mock.calls[0][0]).toEqual({
    title: 'Best blog in Finland',
    author: 'Jarkko',
    url: 'testurl.com'
  })
})