const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("../utils/test.helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("when initially some blogs re saved", () => {
  test("all blog posts are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("the blog posts identifier is named id", async () => {
    const response = await api.get("/api/blogs");

    const blog = response.body[0];
    assert(blog.id);
    assert.deepStrictEqual(blog._id, undefined);
  });
});

describe("a new blog addition", () => {
  test("a blog can be added", async () => {
    const newBlog = {
      title: "async/await simplifies making async calls",
      author: "Test Author",
      url: "http://test.com",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
  });

  test("if likes property is missing, it defaults to 0", async () => {
    const newBlog = {
      title: "Blog without likes",
      author: "Test Author",
      url: "http://test.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find(
      (blog) => blog.title === "Blog without likes"
    );

    assert.strictEqual(addedBlog.likes, 0);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    const titles = blogsAtEnd.map((b) => b.title);
    assert(!titles.includes(blogToDelete.title));

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  });
});

describe("updating a blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlogInDb = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

    assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
