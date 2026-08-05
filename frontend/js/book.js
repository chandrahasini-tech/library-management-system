const params = new URLSearchParams(window.location.search);

const id = params.get("id");

const bookDetails = document.getElementById("bookDetails");

async function fetchBook(){

    try{

        const response = await fetch(`/api/books/${id}`);

        const book = await response.json();

        bookDetails.innerHTML = `

            <img src="${book.image}" alt="${book.title}">

            <div class="book-content">

                <h1>${book.title}</h1>

                <p><strong>Author:</strong> ${book.author}</p>

                <p><strong>Genre:</strong> ${book.genre}</p>

                <p><strong>Available Copies:</strong> ${book.copies}</p>

                <p>${book.description}</p>

                <button
                    class="reserve-btn"
                    onclick="reserveBook()"
                >

                    Reserve Book

                </button>

            </div>

        `;

    }catch(error){

        console.log(error);

    }

}

fetchBook();



// RESERVE BOOK

async function reserveBook(){

    const email = localStorage.getItem("userEmail");

    if(!email){

        alert("Please login first");

        return;

    }

    try{

        const response = await fetch("/api/reserve",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({

                email: email,

                bookId: id

            })

        });

        const data = await response.json();

        if(response.ok){

            window.location.href = "index.html";

        }else{

            alert(data.message);

        }

    }catch(error){

        console.log(error);

        alert("Reservation Failed");

    }

}