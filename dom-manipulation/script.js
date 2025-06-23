const displayQuote = document.getElementById("quoteDisplay");
const addNewQuote = document.getElementById("newQuote");

let quotes = [];

const loadQuotesFromStorage =() => {
 const storedQuotes = localStorage.getItem("quotes");
 if (storedQuotes) {
  quotes = JSON.parse(storedQuotes);
 } else {
  quotes = [
    { text: "Believe you can and you're halfway there.", category: "Motivation" },
      { text: "The only way to do great work is to love what you do.", category: "Motivation" },
      { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "You miss 100% of the shots you don't take.", category: "Life" },
  ];
  saveQuotes(); // Save defaults if first time
 }
}

const saveQuotes = () => {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

const showRandomQuotes = () => {
  if(quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  displayQuote.innerHTML = `<h3>"${randomQuote.text}"</h3><p>Category: ${randomQuote.category}</p>`;

  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
};



const addQuote = () => {
    const newText = document.getElementById("newQuoteText").value.trim();
    const newCategory = document.getElementById("newQuoteCategory").value.trim();

if(newText && newCategory) {
    quotes.push ({
        text: newText,
        category: newCategory
    });
     saveQuotes();


    document.getElementById("newQuoteText").value= "";
    document.getElementById("newQuoteCategory").value= "";
   

    //Update Dom
    displayQuote.innerHTML = `
    <h3>"${newText}" </h3>
    <p>Category: ${newCategory}</p>
    `;
   alert("Quote added successfully!");

} else {
    alert("Please fill in both fields to add a quote");
}
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

  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const q = JSON.parse(last);
    displayQuote.innerHTML = `
     <h3>"${q.text}"</h3>
      <p>Category: ${q.category}</p>
    `;
  }
};
