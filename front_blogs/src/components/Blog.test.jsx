import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'
import BlogForm from './BlogForm'


/*test('renders content',  () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'a',
    url : 'gg.com'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Component testing is done with react-testing-library', { exact: false } )
  expect(element).toBeDefined()
})



test('show all when view clicked', async  () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'aku',
    url : 'gg.com',
    likes: 15
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const e1 = screen.getByText('aku', { exact: false } )
  const e2 = screen.getByText('15', { exact: false } )
  const e3 = screen.getByText('.com', { exact: false } )
  expect(e1).toBeDefined()
  expect(e2).toBeDefined()
  expect(e3).toBeDefined()
})


test('clicking the like button twice calls event handler twice', async () => {


    const user = {
        id: '123'
    }


  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'aku',
    url : 'gg.com',
    likes: 15,
    user: user
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} update={mockHandler} />
  )

  const tuser = userEvent.setup()
  const button1 = screen.getByText('view')
  await tuser.click(button1)
  const button2 = screen.getByText('like')
  await tuser.click(button2)
  await tuser.click(button2)

  expect(mockHandler.mock.calls).toHaveLength(2)
})



test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createNote = vi.fn()

  render(<BlogForm createBlog={createNote} />)

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'testing title field')
  await user.type(inputs[1], 'testing author field')
  await user.type(inputs[2], 'testing url field')
  await user.click(sendButton)

  console.log(createNote.mock.calls)
  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].title).toBe('testing title field')
  expect(createNote.mock.calls[0][0].author).toBe('testing author field')
  expect(createNote.mock.calls[0][0].url).toBe('testing url field')

}) */




test('blog details and likes are shown to a logged out user, buttons are not shown', () => {
  const blog = {
    id: 'blog123',
    title: 'Component testing is done with react-testing-library',
    author: 'aku',
    url: 'gg.com',
    likes: 15,
    user: {
      id: 'user123',
      name: 'Aku'
    }
  }

  render(<Blog blog={blog} show={true} />)

  expect(screen.getByText('Component testing is done with react-testing-library', { exact: false })).toBeDefined()
  expect(screen.getByText('aku', { exact: false })).toBeDefined()
  expect(screen.getByText('gg.com', { exact: false })).toBeDefined()
  expect(screen.getByText('15', { exact: false })).toBeDefined()

  expect(screen.queryByText('like', { exact: false })).toBeNull()
  expect(screen.queryByText('remove', { exact: false })).toBeNull()
})

test('logged in user who is not the blog creator only sees the like button', () => {
  const blog = {
    id: 'blog123',
    title: 'Component testing is done with react-testing-library',
    author: 'aku',
    url: 'gg.com',
    likes: 15,
    user: {
      id: 'creator123',
      name: 'Aku'
    }
  }

  const currentUser = {
    id: 'otherUser123',
    name: 'Other User'
  }

  const mockUpdate = vi.fn()

  render(
    <Blog
      blog={blog}
      update={mockUpdate}
      currentUser={currentUser}
      show={true}
    />
  )

  expect(screen.getByText('Component testing is done with react-testing-library', { exact: false })).toBeDefined()
  expect(screen.getByText('aku', { exact: false })).toBeDefined()
  expect(screen.getByText('gg.com', { exact: false })).toBeDefined()
  expect(screen.getByText('15', { exact: false })).toBeDefined()

  expect(screen.getByText('like', { exact: false })).toBeDefined()
  expect(screen.queryByText('remove', { exact: false })).toBeNull()
})

test('blog creator sees both like button and remove button', () => {
  const blog = {
    id: 'blog123',
    title: 'Component testing is done with react-testing-library',
    author: 'aku',
    url: 'gg.com',
    likes: 15,
    user: {
      id: 'creator123',
      name: 'Aku'
    }
  }

  const currentUser = {
    id: 'creator123',
    name: 'Aku'
  }

  const mockUpdate = vi.fn()
  const mockDelete = vi.fn()

  render(
    <Blog
      blog={blog}
      update={mockUpdate}
      dele={mockDelete}
      currentUser={currentUser}
      show={true}
    />
  )

  expect(screen.getByText('Component testing is done with react-testing-library', { exact: false })).toBeDefined()
  expect(screen.getByText('aku', { exact: false })).toBeDefined()
  expect(screen.getByText('gg.com', { exact: false })).toBeDefined()
  expect(screen.getByText('15', { exact: false })).toBeDefined()

  expect(screen.getByText('like', { exact: false })).toBeDefined()
  expect(screen.getByText('remove', { exact: false })).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blogUser = {
    id: 'creator123',
    name: 'Aku'
  }

  const blog = {
    id: 'blog123',
    title: 'Component testing is done with react-testing-library',
    author: 'aku',
    url: 'gg.com',
    likes: 15,
    user: blogUser
  }

  const currentUser = {
    id: 'otherUser123',
    name: 'Other User'
  }

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      update={mockHandler}
      currentUser={currentUser}
      show={true}
    />
  )

  const user = userEvent.setup()
  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createNote = vi.fn()

  render(<BlogForm createBlog={createNote} />)

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'testing title field')
  await user.type(inputs[1], 'testing author field')
  await user.type(inputs[2], 'testing url field')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].title).toBe('testing title field')
  expect(createNote.mock.calls[0][0].author).toBe('testing author field')
  expect(createNote.mock.calls[0][0].url).toBe('testing url field')
})