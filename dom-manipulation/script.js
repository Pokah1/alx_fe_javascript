const displayQuote = document.getElementById("quoteDisplay");
const addNewQuote = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

let quotes = [];

function loadQuotesFromStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [
    { text: "Believe you can and you're halfway there.", category: "Motivation" },
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "You miss 100% of the shots you don't take.", category: "Life" },
  ];
  saveQuotes(); // ensure it's stored on first load
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuotes() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    displayQuote.innerHTML = "<p>No quotes available for this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  // ✅ Show the random quote
  displayQuote.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;

  // ✅ Update category filter dropdown to match shown quote
  categoryFilter.value = quote.category;
  localStorage.setItem("lastSelectedCategory", quote.category);

  // ✅ Store quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}


function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    populateCategories(); // add new category if not present

    alert("Quote added successfully!");
  } else {
    alert("Please fill in both fields to add a quote");
  }
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const selected = localStorage.getItem("lastSelectedCategory") || "all";

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
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
  showRandomQuotes();
}

function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
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

addNewQuote.addEventListener("click", showRandomQuotes);

window.onload = function () {
  loadQuotesFromStorage();
  populateCategories();

  // restore last quote if available
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const q = JSON.parse(last);
    displayQuote.innerHTML = `<p>"${q.text}"</p><small>Category: ${q.category}</small>`;
  }
};
