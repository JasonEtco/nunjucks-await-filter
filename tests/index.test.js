const nunjucks = require('nunjucks')
const express = require('express')
const supertest = require('supertest')
const awaitFilter = require('..')

describe('nunjucks-await-filter', () => {
  let env

  beforeAll(() => {
    env = nunjucks.configure(__dirname)
    awaitFilter(env)
  })

  it('works', () => {
    const func = () => Promise.resolve('world')
    env.renderString('Hello {{ func() | await }}', { func }, (err, res) => {
      expect(err).toBe(null)
      expect(res).toBe('Hello world')
    })
  })

  it('works with arguments in the function', () => {
    const func = word => Promise.resolve(word)
    env.renderString('Hello {{ func(\'world\') | await }}', { func }, (err, res) => {
      expect(err).toBe(null)
      expect(res).toBe('Hello world')
    })
  })

  it('renders errors', () => {
    const func = async () => { throw new Error('AAAAAAH') }
    env.renderString('Hello {{ func() | await }}', { func }, (err) => {
      expect(err).not.toBe(null)
    })
  })

  it('works in an Express app', async () => {
    const app = express()
    env.express(app)
    const func = () => Promise.resolve('world')

    app.get('/', async (req, res) => {
      res.render('template.njk', { func })
    })

    const res = await supertest(app).get('/')
    expect(res.text).toBe('Hello world')
  })
})
