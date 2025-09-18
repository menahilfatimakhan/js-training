// With Promises
fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((users) => {
    console.log("=== Users (Promise) ===");
    console.table(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
      }))
    );
  })
  .catch((err) => console.error("Error:", err));

// With Async/Await
async function fetchUsers() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await res.json();

    console.log("=== Users (Async/Await) ===");
    console.table(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
      }))
    );
  } catch (err) {
    console.error("Error:", err);
  }
}

fetchUsers();
