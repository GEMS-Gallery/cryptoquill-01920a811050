import Func "mo:base/Func";
import Text "mo:base/Text";

// backend/main.mo
import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor {
  // Define a Post type with title, body, and author
  type Post = {
    title: Text;
    body: Text;
    author: Text;
  };

  // Use a stable variable to store posts so they persist across upgrades
  stable var posts: [Post] = [];

  // Function to add a new post
  public func addPost(title: Text, body: Text, author: Text): async () {
    let newPost: Post = { title; body; author };
    posts := Array.append([newPost], posts); // Add new post to the beginning
  };

  // Query function to get all posts
  public query func getPosts(): async [Post] {
    return posts;
  };
}
