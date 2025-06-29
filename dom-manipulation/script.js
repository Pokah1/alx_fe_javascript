const displayQuote = document.getElementById("quoteDisplay");
const addNewQuote = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

let quotes = [];

function loadQuotesFromStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  quotes = storedQuotes
    ? JSON.parse(storedQuotes)
    : [
        {
          text: "Believe you can and you're halfway there.",
          category: "Motivation",
        },
        {
          text: "The only way to do great work is to love what you do.",
          category: "Motivation",
        },
        {
          text: "In the middle of every difficulty lies opportunity.",
          category: "Inspiration",
        },
        {
          text: "Life is what happens when you're busy making other plans.",
          category: "Life",
        },
        {
          text: "You miss 100% of the shots you don't take.",
          category: "Life",
        },
      ];
  saveQuotes();
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    displayQuote.innerHTML = "<p>No quotes available for this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  displayQuote.innerHTML = `<p>"${quote.text}"</p><small>Category: ${quote.category}</small>`;
  categoryFilter.value = quote.category;
  localStorage.setItem("lastSelectedCategory", quote.category);
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(document.createElement("h2")).textContent =
    "Add New Quote (Dynamic)";
  document.body.appendChild(formContainer);
}

function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText && newCategory) {
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    saveQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    populateCategories();
    alert("Quote added successfully!");

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuote),
    })
      .then((res) => res.json())
      .then((date) => {
        console.log("Posted to server:", date);
      })
      .catch((err) => {
        console.error("Error posting to server:", err);
      });
  } else {
    alert("Please fill in both fields to add a quote");
  }
}

function populateCategories() {
  const categories = [...new Set(quotes.map((q) => q.category))];
  const selected = localStorage.getItem("lastSelectedCategory") || "all";

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selected) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  showRandomQuote();
}

function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error parsing file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

async function syncQuotes() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    const newQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    const beforeSync = quotes.length;
    quotes.push(...newQuotes);
    saveQuotes();
    populateCategories();

    if (quotes.length > beforeSync) {
      const syncDiv = document.getElementById("syncNotification");
      syncDiv.textContent = "Quotes synced with server!";
      syncDiv.style.display = "block";

       // Hide after 3 seconds
      setTimeout(() => {
        syncDiv.style.display = "none";
      }, 3000);
    }
  } catch (error) {
    console.error("Failed to sync from server:", error);
  }
}


async function fetchQuotesFromServer() {
  await syncQuotes();
}

addNewQuote.addEventListener("click", showRandomQuote);

window.onload = function () {
  loadQuotesFromStorage();
  populateCategories();
  createAddQuoteForm(); // <-- now dynamically creates the quote form
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const q = JSON.parse(last);
    displayQuote.innerHTML = `<p>"${q.text}"</p><small>Category: ${q.category}</small>`;
  }

setInterval(fetchQuotesFromServer, 20000);

};
