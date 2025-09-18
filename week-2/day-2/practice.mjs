//callback -> a function passed as an argument to another function & called later
function fetchData(callback) {
  console.log("Fetching data...");

  setTimeout(() => {
    const data = { name: "Menahil", role: "AI Intern" };
    callback(data); // call the function we passed in
  }, 2000); 
}

fetchData((result) => {
  console.log("Data received:", result);
});



//promise -> an object representing a task that will finish in the future
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true; // change to false to test reject
      if (success) {
        resolve({ name: "Bilal", role: "Developer" });
      } else {
        reject("Error fetching data!");
      }
    }, 2000);
  });
}
// using .then() and .catch()
fetchData()
  .then((data) => console.log("Data received:", data))
  .catch((err) => console.error(err));



// async/await -> for writing an async code that will look like sync
async function getData() {
  try {
    const data = await fetchData(); // wait until Promise resolves
    console.log("Data received:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

getData();


