const displayQuote = document.getElementById("quoteDisplay");
const addNewQuote = document.getElementById("newQuote");

const quotes = [
  {
    text: "Believe you can and you're halfway there.",
    category: "Motivation",
  },
  {
    text: "The only way to do great work is to love what you do.",
    category: "Motivation",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue",
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
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    category: "Inspiration",
  },
];
const showRandomQuotes = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  displayQuote.innerHTML = `<h3>"${randomQuote.text}"</h3><p>Category: ${randomQuote.category}</p>`;
};



const addQuote = () => {
    const newText = document.getElementById("newQuoteText").value.trim();
    const newCategory = document.getElementById("newQuoteCategory").value.trim();

if(newText && newCategory) {
    const newQuote = {
        text: newText,
        category: newCategory
    };

    quotes.push(newQuote);

    //Update Dom
    displayQuote.innerHTML = `
    <h3>"${newQuote.text}" </h3>
    <p>Category: ${newQuote.category}</p>
    `;
    document.getElementById("newQuoteText").value= "";
    document.getElementById("newQuoteCategory").value= "";

} else {
    alert("Please fill in both fields to add a quote");
}
}

addNewQuote.addEventListener("click", showRandomQuotes);
