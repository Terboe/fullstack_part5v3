const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.goto('http://localhost:5173/login')

  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.goto('http://localhost:5173/create')

  await page.getByRole('button', { name: 'create new blog' }).click()

  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)

  await page.getByRole('button', { name: 'create' }).click()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Aku Tervonen',
        username: 'aku',
        password: 'salainen',
      },
    })

    await page.goto('http://localhost:5173')
  })

  // Vanha testi ei enää sellaisenaan pidä paikkaansa,
  // koska login-lomake ei näy etusivulla vaan /login-reitillä.
  /*
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await expect(page.getByRole('textbox').first()).toBeVisible()
    await expect(page.getByRole('textbox').last()).toBeVisible()
  })
  */

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'väärä')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await expect(page.getByRole('link', { name: 'test title test author' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'like test title', 'like test author', 'like test url')

      await page.getByRole('link', { name: 'like test title like test author' }).click()

      const blog = page.getByTestId('blog')

      await expect(blog).toContainText('like test title')
      await expect(blog).toContainText('like test url')
      await expect(blog).toContainText('like test author')
      await expect(blog).toContainText('0')

      await blog.getByRole('button', { name: 'like' }).click()

      await expect(blog).toContainText('1')
    })

    test('a blog can be removed', async ({ page }) => {
      await createBlog(page, 'remove test title', 'remove test author', 'remove test url')

      await expect(
        page.getByRole('link', { name: 'remove test title remove test author' })
      ).toBeVisible()

      await page.getByRole('link', { name: 'remove test title remove test author' }).click()

      const blog = page.getByTestId('blog')

      await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

      await blog.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('blog deleted')).toBeVisible()
      await expect(
        page.getByRole('link', { name: 'remove test title remove test author' })
      ).not.toBeVisible()
    })

    // Tämä ei kuulu tehtävän 5.28 vaadittuihin testeihin.
    // Sen voi jättää pois tai pitää myöhempää varten.
    /*
    test('only the user who added the blog can see the remove button', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url')

      await page.getByRole('link', { name: 'test title test author' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'log out' }).click()

      await loginWith(page, 'aku', 'salainen')

      await expect(page.getByText('Aku Tervonen logged in')).toBeVisible()

      await page.getByRole('link', { name: 'test title test author' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
    */

    // Tehtävänannossa sanotaan, että blogien tykkäysjärjestystä ei nyt testata.
    /*
    test('blogs are ordered by likes, blog with most likes first', async ({ page }) => {
      // vanha järjestystesti pois käytöstä
    })
    */
  })
})