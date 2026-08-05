const booksContainer = document.getElementById("booksContainer");

let allBooks = [];

async function fetchBooks(){

    try{

        const response = await fetch("/api/books");

        const books = await response.json();

        allBooks = books;

        displayBooks(books);

    }catch(error){

        console.log(error);

    }

}

function displayBooks(books){

    booksContainer.innerHTML = "";

    books.forEach((book)=>{

        booksContainer.innerHTML += `

            <div class="book-card"
                onclick="openBook('${book._id}')">

                <img src="${book.image}" alt="${book.title}">

                <div class="book-info">

                    <h3>${book.title}</h3>

                    <p>${book.author}</p>

                    <span class="available">

                        ${book.copies} Copies Available

                    </span>

                </div>

            </div>

        `;

    });

}

function openBook(id){

    window.location.href = `book.html?id=${id}`;

}


// SEARCH

function searchBooks(){

    const searchValue = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    const filteredBooks = allBooks.filter((book)=>{

        return (

            book.title.toLowerCase().includes(searchValue) ||

            book.author.toLowerCase().includes(searchValue) ||

            book.genre.toLowerCase().includes(searchValue)

        );

    });

    displayBooks(filteredBooks);

}


// GENRE FILTER

function filterGenre(genre){

    const filteredBooks = allBooks.filter((book)=>{

        return book.genre.toLowerCase() === genre.toLowerCase();

    });

    displayBooks(filteredBooks);

}
fetch("/api/check-expiry");
fetchBooks();