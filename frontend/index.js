import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as backend_idl, canisterId as backend_id } from "declarations/backend";

const agent = new HttpAgent();
const backend = Actor.createActor(backend_idl, { agent, canisterId: backend_id });

document.addEventListener("DOMContentLoaded", async () => {
  const newPostBtn = document.getElementById("new-post-btn");
  const newPostForm = document.getElementById("new-post-form");
  const submitPostBtn = document.getElementById("submit-post-btn");
  const postsContainer = document.getElementById("posts-container");

  const quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Write your post here...',
  });

  newPostBtn.addEventListener("click", () => {
    newPostForm.classList.toggle("hidden");
    if (!newPostForm.classList.contains("hidden")) {
      document.getElementById("post-title").focus();
    }
  });

  submitPostBtn.addEventListener("click", async () => {
    const title = document.getElementById("post-title").value;
    const author = document.getElementById("post-author").value;
    const body = quill.root.innerHTML;

    if (!title || !author || quill.getText().trim().length === 0) {
      alert("Please fill in all fields");
      return;
    }

    await backend.addPost(title, body, author);
    loadPosts();
    newPostForm.classList.add("hidden");
    document.getElementById("post-title").value = "";
    document.getElementById("post-author").value = "";
    quill.setText("");
  });

  async function loadPosts() {
    const posts = await backend.getPosts();
    postsContainer.innerHTML = posts.map(post => `
      <div class="post">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-author">by ${post.author}</p>
        <div class="post-body">${post.body}</div>
      </div>
    `).join('');
  }

  loadPosts();
});
