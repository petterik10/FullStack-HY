import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import FormBlog from './FormBlog'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'helloo',
  author: 'nnnn',
  url: 'http://test.com',
  likes: 5,
  user: {
    username: 'testuser',
    name: 'Test User',
  },
}

test('renders title and author but not url and likes', () => {
  render(<Blog blog={blog} />)

  const element1 = screen.getByText('helloo', { exact: false })
  const element2 = screen.getByText('nnnn', { exact: false })
  expect(element1).toBeDefined()
  expect(element2).toBeDefined()

  const element3 = screen.queryByText('http://test.com')
  const element4 = screen.queryByText(/likes/)
  expect(element3).toBeNull()
  expect(element4).toBeNull()
})

test('clicking the view button opens url and likes', async () => {
  render(<Blog blog={blog} />)

  const user = userEvent.setup()

  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = screen.getByText('http://test.com')
  expect(urlElement).toBeDefined()

  const likesElement = screen.getByText('likes 5', { exact: false })
  expect(likesElement).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const mockHandler = vi.fn()
  render(<Blog blog={blog} addLikeToBlog={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<FormBlog /> calls createBlog to create a new blog', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<FormBlog createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')

  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'adding title')
  await user.type(inputs[1], 'adding author')
  await user.type(inputs[2], 'adding url')
  await user.click(sendButton)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('adding title')
  expect(createBlog.mock.calls[0][0].author).toBe('adding author')
  expect(createBlog.mock.calls[0][0].url).toBe('adding url')
})
