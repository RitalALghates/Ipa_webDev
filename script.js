// rital yahya alghates
//2210683
const apiKey = "live_cp43hOu3RWEzGfMcPDngeIEuPRJzQvWxdrldMVfgNuZMG7M2YDGFVKcYCds01FtN";
// Define the base URL for TheCatAPI and get the container element to display cats
const baseURL = "https://api.thecatapi.com/v1";
const catContainer = document.getElementById("catContainer");

// Set up event listeners for the buttons and form
document
    .getElementById("fetchCatBtn")
    .addEventListener("click", fetchRandomCat); // Fetch random cat when button is clicked
document.getElementById("clearCatsBtn").addEventListener("dblclick", clearCats); // Clear cats on double-click
document
    .getElementById("catSearchForm")
    .addEventListener("submit", function (e) { // Handle breed search form submission
        e.preventDefault(); // Prevent default form submission behavior
        const breed = document.getElementById("breedInput").value.trim(); // Get breed input value
        if (breed) {
            searchBreed(breed); // Search for the breed if input is not empty
        } else {
            showError("Breed name cannot be empty."); // Show error if input is empty
        }
    });

// Function to fetch a random cat image with breed information
function fetchRandomCat() {
    fetch(`${baseURL}/images/search?has_breeds=1`, { // Fetch random cat image that has breed info
        headers: {
            "x-api-key": apiKey, // Include API key in headers
        },
    })
    .then((res) => res.json()) // Parse response as JSON
    .then((data) => {
        if (data.length > 0) {
            displayCat(data[0]); // Display the first cat image if available
        } else {
            showError("No cat found."); // Show error if no cat is found
        }
    })
    .catch(() => showError("Failed to fetch data from API.")); // Handle fetch errors
}

// Function to search for a specific breed by name
function searchBreed(breed) {
    fetch(`${baseURL}/breeds/search?q=${breed}`, { // Search for the breed by name
        headers: {
            "x-api-key": apiKey, // Include API key in headers
        },
    })
    .then((res) => res.json()) // Parse response as JSON
    .then((data) => {
        if (data.length === 0) return showError("Breed not found."); // Show error if breed not found
        const breedId = data[0].id; // Get breed ID from the first result
        fetch(`${baseURL}/images/search?breed_ids=${breedId}`, { // Fetch images for the specific breed
            headers: {
                "x-api-key": apiKey, // Include API key in headers
            },
        })
        .then((res) => res.json()) // Parse response as JSON
        .then((catData) => {
            if (catData.length > 0) {
                displayCat(catData[0]); // Display the cat image if available
            } else {
                showError("No image found for this breed."); // Show error if no image is found
            }
        });
    })
    .catch(() => showError("Error during breed search.")); // Handle errors during breed search
}

// Function to display the cat image and breed information
function displayCat(catData) {
    const breed = catData.breeds[0]; // Get breed info from the cat data
    const card = document.createElement("div"); // Create a new div for the cat card
    card.className = "cat-card"; // Assign a class name to the card
    card.innerHTML = ` 
        <img src="${catData.url}" alt="Cat Image" /> <!-- Display cat image -->
        <h3>${breed.name}</h3> <!-- Display breed name -->
        <p><strong>Origin:</strong> ${breed.origin}</p> <!-- Display breed origin -->
        <p><strong>Temperament:</strong> ${breed.temperament}</p> <!-- Display breed temperament -->
        <p><strong>Life Span:</strong> ${breed.life_span} years</p> <!-- Display breed life span -->
        <p><strong>Description:</strong> ${breed.description}</p> <!-- Display breed description -->
    `;
    catContainer.appendChild(card); // Add the card to the container
}

// Function to clear all displayed cats from the container
function clearCats() {
    catContainer.innerHTML = ""; // Clear the container's HTML content
}

// Function to show an error message for a short time
function showError(msg) {
    const errorDiv = document.createElement("div"); // Create a new div for the error message
    errorDiv.className = "error"; // Assign a class name to the error div
    errorDiv.textContent = msg; // Set the error message text
    catContainer.appendChild(errorDiv); // Add the error message to the container
    setTimeout(() => errorDiv.remove(), 3000); // Remove the error message after 3 seconds
}
