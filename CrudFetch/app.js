import { Spinner } from "./spinner.js";
import { initTheme } from "./theme.js";

const API_URL = "https://jsonplaceholder.typicode.com/posts";
const POSTS_PER_PAGE = 10;

const postsContainer = document.getElementById("posts-container");
const postForm = document.getElementById("post-form");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const postIdInput = document.getElementById("post-id");
const paginationContainer = document.getElementById("pagination");

const spinner = new Spinner("spinner");

//initial state
let currentPage = 1;
let totalPosts = 0;

// Fetch posts
async function fetchPosts(page = 1) {
  spinner.show();
  try {
    const response = await fetch(
      `${API_URL}?_page=${page}&_limit=${POSTS_PER_PAGE}`
    );
    const posts = await response.json();
    totalPosts = parseInt(response.headers.get("X-Total-Count"));
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    spinner.hide();
  }
}

// Display posts
function displayPosts(posts) {
  postsContainer.innerHTML = "";
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <button class="edit" data-id="${post.id}">Edit</button>
            <button class="delete" data-id="${post.id}">Delete</button>
        `;
    postsContainer.appendChild(postElement);
  });
}

// Create post
async function createPost(title, body) {
  spinner.show();
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        title,
        body,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const newPost = await response.json();
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
  } finally {
    spinner.hide();
  }
}

// Update post
async function updatePost(id, title, body) {
  spinner.show();
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id,
        title,
        body,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
  } finally {
    spinner.hide();
  }
}

// Delete post
async function deletePost(id) {
  spinner.show();
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
  } finally {
    spinner.hide();
  }
}

// Handle form submission
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const body = bodyInput.value;
  const id = postIdInput.value;

  if (id) {
    // Update existing post
    await updatePost(id, title, body);
  } else {
    // Create new post
    await createPost(title, body);
  }

  // Reset form and refresh posts
  postForm.reset();
  postIdInput.value = "";
  loadPosts(currentPage);
});

// Handle edit and delete buttons
postsContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit")) {
    const postId = e.target.getAttribute("data-id");
    const post = await fetchPost(postId);
    titleInput.value = post.title;
    bodyInput.value = post.body;
    postIdInput.value = post.id;
  } else if (e.target.classList.contains("delete")) {
    const postId = e.target.getAttribute("data-id");
    await deletePost(postId);
    loadPosts(currentPage);
  }
});

// Fetch a single post
async function fetchPost(id) {
  spinner.show();
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const post = await response.json();
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
  } finally {
    spinner.hide();
  }
}

// Create pagination buttons
function createPaginationButtons() {
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  paginationContainer.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.addEventListener("click", () => loadPosts(currentPage - 1));
  prevButton.disabled = currentPage === 1;
  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => loadPosts(i));
    pageButton.disabled = i === currentPage;
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.addEventListener("click", () => loadPosts(currentPage + 1));
  nextButton.disabled = currentPage === totalPages;
  paginationContainer.appendChild(nextButton);
}

// Load posts and update pagination
async function loadPosts(page) {
  currentPage = page;
  const posts = await fetchPosts(page);
  displayPosts(posts);
  createPaginationButtons();
}

// Initial load
loadPosts(1);
initTheme();
