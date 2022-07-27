describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test user',
      username: 'Tester',
      password: 'test_password'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login', function() {
    it('Succeeds with correct credentials', function() {
      cy.get('#username').type('Tester')
      cy.get('#password').type('test_password')
      cy.get('#login-button').click()

      cy.contains('Test user logged in')
    })

    it('Fails with wrong credentials', function() {
      cy.get('#username').type('FakeUser')
      cy.get('#password').type('fake_pass')
      cy.get('#login-button').click()
      cy.contains('Wrong username or password')
      cy.get('.notification')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'Tester',
          password: 'test_password'
        }).then(response => {
          localStorage.setItem('loggedUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })
      })

      it('A blog can be created', function() {
        cy.contains('Create new blog').click()
        cy.get('#title').type('Blog for testing')
        cy.get('#author').type('Author of the test blog')
        cy.get('#url').type('Url for the test blog')
        cy.get('#create-button').click()
        cy.contains('Blog for testing Author of the test blog')
      })

      it('A blog can be liked', function() {
        cy.createBlog({
          title: 'Blog for testing',
          author: 'Author of the test blog',
          url: 'Url for the test blog',
          likes: 0
        })
        cy.get('#view-button').click()
        cy.contains('Likes: 0')
        cy.get('#like-button').click()
        cy.contains('Likes: 1')
      })

      it('Users who have added blogs can remove them', function() {
        cy.createBlog({
          title: 'Blog for testing',
          author: 'Author of the test blog',
          url: 'Url for the test blog',
          likes: 0
        })
        cy.get('#view-button').click()
        cy.get('#remove-button').click()
        cy.get('html').should('not.contain', 'Blog for testing Author of the test Blog')
      })

      it('Blogs are sorted by likes (descending)', function() {
        cy.createBlog({
          title: 'Blog for testing',
          author: 'Author of the test blog',
          url: 'Url for the test blog',
          likes: 0
        })
        cy.createBlog({
          title: 'Blog with more likes',
          author: 'Mikko',
          url: 'mikkohaslikes.fi',
          likes: 4
        })
        cy.createBlog({
          title: 'Blog with even more likes',
          author: 'Tauno',
          url: 'taunohasmorelikes.fi',
          likes: 10
        })
        cy.createBlog({
          title: 'Blog with most likes',
          author: 'Uuno',
          url: 'uunohasmostlikes.fi',
          likes: 542
        })
        cy.createBlog({
          title: 'Random blog',
          author: 'Janne',
          url: 'jannehas2likes.fi',
          likes: 2
        })
        cy.createBlog({
          title: 'Blog with 7 likes',
          author: 'Seven',
          url: 'seven.fi',
          likes: 7
        })

        cy.get('.fullInfo').then(blogs => {
          let likes = []
          for (let i = 0; i < blogs.length; i++) {
            likes.push(blogs[i].children[2].innerText.slice(7, -5))
          }
          expect(likes.toString()).to.equal('542,10,7,4,2,0')
        })
      })
    })
  })
})