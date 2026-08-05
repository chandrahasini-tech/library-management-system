const membersContainer = document.getElementById("membersContainer");

const booksContainer = document.getElementById("booksContainer");



// FETCH MEMBERS

async function fetchMembers(){

    try{

        const response = await fetch("/api/users");

        const users = await response.json();

        membersContainer.innerHTML = "";

        users.forEach((user)=>{

            membersContainer.innerHTML += `

                    <div class="book-card">
                    <h3>${user.name}</h3>

                    <p>${user.email}</p>

                    <p>${user.phone}</p>

                    <p>${user.role}</p>
                    <p>
    Registered:
    ${
        user.registeredDate
        ? new Date(user.registeredDate).toLocaleDateString()
        : "N/A"
    }
</p>

                    <div class="user-actions">

    <button
        onclick="editUser('${user._id}')"
        class="edit-btn"
    >
        Edit
    </button>

    <button
        onclick="deleteMember('${user._id}')"
        class="delete-btn"
    >
        Delete
    </button>

</div>
                </div>

            `;

        });

    }catch(error){

        console.log(error);

    }

}

fetchMembers();
const searchInput = document.getElementById("userSearch");

searchInput.addEventListener("input", ()=>{

    const keyword =
    searchInput.value.toLowerCase();

    const cards =
    document.querySelectorAll(".member-card");

    cards.forEach(card=>{

        const text =
        card.innerText.toLowerCase();

        if(text.includes(keyword)){

            card.style.display = "block";

        }else{

            card.style.display = "none";

        }

    });

});


// DELETE MEMBER

async function deleteMember(id){

    try{

        await fetch(`/api/users/${id}`,{

            method:"DELETE"

        });

        fetchMembers();

    }catch(error){

        console.log(error);

    }

}



// FETCH BOOKS

async function fetchBooks(){

    try{

        const response = await fetch("/api/books");

        const books = await response.json();

        booksContainer.innerHTML = "";

        books.forEach((book)=>{

            booksContainer.innerHTML += `

                <div class="member-card">

                    <img
                        src="${book.image}"
                        style="
                            width:140px;
                            height:220px;
                            object-fit:cover;
                            border-radius:12px;
                            display:block;
                            margin: auto;
                        "
                    >

                    <h3 style="margin-top:15px;">

                        ${book.title}

                    </h3>

                    <p>${book.author}</p>

                    <p>${book.genre}</p>

                    <p>

                        Copies:
                        ${book.copies}

                    </p>
                    <p>
    Added:
    ${
        book.addedDate
        ? new Date(book.addedDate).toLocaleDateString()
        : "N/A"
    }
</p>

                    <div class="book-actions">

    <button
        onclick="editBook('${book._id}')"
        class="edit-btn"
    >
        Edit
    </button>

    <button
        onclick="deleteBook('${book._id}')"
        class="delete-btn"
    >
        Delete
    </button>

</div>

                </div>

            `;

        });

    }catch(error){

        console.log(error);

    }

}

fetchBooks();

fetchReservations();
fetchIssuedBooks();
async function fetchIssuedBooks(){

    try{

        const response =
        await fetch("/api/issues");

        const issues =
        await response.json();

        const container =
        document.getElementById(
            "issuesContainer"
        );

        container.innerHTML = "";

        issues.forEach((issue)=>{

          container.innerHTML += `

    <div class="member-card">

        <h3>${issue.title}</h3>

        <p>
            User:
            ${issue.email}
        </p>

        <p>
            Issued:
            ${
                new Date(
                    issue.issueDate
                ).toLocaleDateString()
            }
        </p>

        <p>
            Return:
            ${
                new Date(
                    issue.returnDate
                ).toLocaleDateString()
            }
        </p>

        <button
            onclick="returnBook('${issue._id}')"
            class="edit-btn"
        >

            Return Book

        </button>

    </div>

`;

        });

    }catch(error){

        console.log(error);

    }

}
async function returnBook(id){

    try{

        await fetch("/api/return-book",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                issueId:id

            })

        });

        fetchBooks();
        fetchIssuedBooks();

    }catch(error){

        console.log(error);

    }

}

// DELETE BOOK

async function deleteBook(id){

    try{

        await fetch(`/api/books/${id}`,{

            method:"DELETE"

        });

        fetchBooks();

    }catch(error){

        console.log(error);

    }

}
async function editBook(id){

    const title =
    prompt("Enter new title");

    const author =
    prompt("Enter new author");

    const genre =
    prompt("Enter new genre");

    const copies =
    prompt("Enter new copies");

    if(!title || !author){

        return;

    }

    try{

        await fetch(`/api/books/${id}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                title,
                author,
                genre,
                copies

            })

        });

        fetchBooks();

    }catch(error){

        console.log(error);

    }

}
async function editUser(id){

    const name =
    prompt("Enter new name");

    const email =
    prompt("Enter new email");

    const phone =
    prompt("Enter new phone");

    const role =
    prompt("Enter role (admin/member)");

    if(!name || !email){

        return;

    }

    try{

        await fetch(`/api/users/${id}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                name,
                email,
                phone,
                role

            })

        });

        fetchMembers();

    }catch(error){

        console.log(error);

    }

}
async function fetchReservations(){

    try{

        const response =
        await fetch("/api/reservations");

        const reservations =
        await response.json();

        const container =
        document.getElementById(
            "reservationsContainer"
        );

        container.innerHTML = "";

        reservations.forEach((reservation)=>{

            container.innerHTML += `

                <div class="member-card">

                    <h3>${reservation.title}</h3>

                    <p>

                        User:
                        ${reservation.email}

                    </p>

                    <p>

                        Reserved:
                        ${
                            new Date(
                                reservation.reservedDate
                            ).toLocaleDateString()
                        }

                    </p>

                    <button
                        onclick="issueBook('${reservation._id}')"
                        class="edit-btn"
                    >

                        Issue Book

                    </button>

                </div>

            `;

        });

    }catch(error){

        console.log(error);

    }

}
async function issueBook(id){

    try{

        await fetch("/api/issue-book",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                reservationId:id

            })

        });

        fetchReservations();
        fetchIssuedBooks();

    }catch(error){

        console.log(error);

    }

}