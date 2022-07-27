import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('<Blog />', () => {
  let container

  const user = {
    username: 'test',
    password: 'test'
  }
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'testurl.com',
    user: user
  }
  const updateBlog = jest.fn()

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} updateBlog={updateBlog} />).container
  })

  test('Renders title and author', () => {
    const title = screen.findByText('Test title')
    const author = screen.findByText('Test author')
    const div = container.querySelector('.fullInfo')
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(div).toHaveStyle('display: none')
  })

  test('Url and likes are shown after clicking the "View"-button', () => {
    const button = screen.getByText('View')
    userEvent.click(button)
    const div = container.querySelector('.fullInfo')
    expect(div).not.toHaveStyle('display: none')
  })

  test('Eventhandler is called twice after clicking "Like"-button twice', () => {
    const button = screen.getByText('Like')
    userEvent.click(button)
    userEvent.click(button)
    expect(updateBlog.mock.calls).toHaveLength(2)
  })

})



