describe('Posts API', () => {
  let authToken: string;

  before(() => {
    // Mock successful login to get JWT token
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/auth/google/callback',
      qs: { code: 'mock-code' },
    }).then((response) => {
      authToken = response.body.access_token;
    });
  });

  beforeEach(() => {
    // Reset interceptors before each test
    cy.intercept('GET', '/posts').as('getPosts');
    cy.intercept('GET', '/posts/*').as('getPost');
    cy.intercept('POST', '/posts').as('createPost');
    cy.intercept('PATCH', '/posts/*').as('updatePost');
    cy.intercept('DELETE', '/posts/*').as('deletePost');
  });

  it('should create a new post', () => {
    const newPost = {
      title: 'Test Post',
      content: 'Test Content',
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/posts',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: newPost,
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body.title).to.equal(newPost.title);
      expect(response.body.content).to.equal(newPost.content);
    });
  });

  it('should get all posts', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/posts',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should get a single post', () => {
    // First create a post
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/posts',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: {
        title: 'Test Post',
        content: 'Test Content',
      },
    }).then((createResponse) => {
      // Then get the created post
      const postId = createResponse.body.id;
      cy.request(`http://localhost:3000/posts/${postId}`).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(postId);
      });
    });
  });

  it('should update a post', () => {
    // First create a post
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/posts',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: {
        title: 'Original Title',
        content: 'Original Content',
      },
    }).then((createResponse) => {
      const postId = createResponse.body.id;
      const updatedPost = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      // Then update the post
      cy.request({
        method: 'PATCH',
        url: `http://localhost:3000/posts/${postId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: updatedPost,
      }).then((updateResponse) => {
        expect(updateResponse.status).to.equal(200);
        expect(updateResponse.body.title).to.equal(updatedPost.title);
        expect(updateResponse.body.content).to.equal(updatedPost.content);
      });
    });
  });

  it('should delete a post', () => {
    // First create a post
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/posts',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: {
        title: 'Post to Delete',
        content: 'This post will be deleted',
      },
    }).then((createResponse) => {
      const postId = createResponse.body.id;

      // Then delete the post
      cy.request({
        method: 'DELETE',
        url: `http://localhost:3000/posts/${postId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.equal(200);

        // Verify the post is deleted
        cy.request({
          method: 'GET',
          url: `http://localhost:3000/posts/${postId}`,
          failOnStatusCode: false,
        }).then((getResponse) => {
          expect(getResponse.status).to.equal(404);
        });
      });
    });
  });

  it('should handle unauthorized access', () => {
    const newPost = {
      title: 'Unauthorized Post',
      content: 'This should fail',
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/posts',
      body: newPost,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(401);
    });
  });
});
