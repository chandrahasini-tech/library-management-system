const email = localStorage.getItem("userEmail");

const profileCard = document.getElementById("profileCard");

const reservedBooks = document.getElementById("reservedBooks");

async function fetchProfile(){

    try{

        const response = await fetch(`/api/profile/${email}`);

        const data = await response.json();

        profileCard.innerHTML = `

            <h2>${data.user.name}</h2>

            <p><strong>Email:</strong> ${data.user.email}</p>

            <p><strong>Phone:</strong> ${data.user.phone}</p>

            <p><strong>Role:</strong> ${data.user.role}</p>

        `;

        reservedBooks.innerHTML = "";

        if(data.reservations.length === 0){

            reservedBooks.innerHTML = `

                <p>No Reserved Books</p>

            `;

        }
        if(data.issues && data.issues.length > 0){

    reservedBooks.innerHTML += `

        <h2 style="margin-top:30px;">
            Issued Books
        </h2>

    `;

    data.issues.forEach((book)=>{

        reservedBooks.innerHTML += `

            <div class="reserved-book">

                <p>

                    <strong>
                        ${book.title}
                    </strong>

                </p>

                <p>

                    Issued:
                    ${
                        new Date(
                            book.issueDate
                        ).toLocaleDateString()
                    }

                </p>

                <p>

                    Return:
                    ${
                        new Date(
                            book.returnDate
                        ).toLocaleDateString()
                    }

                </p>

                <p>

                    Status:
                    ${book.status}

                </p>

            </div>

        `;

    });

}

        data.reservations.forEach((book)=>{

            reservedBooks.innerHTML += `

                <div class="reserved-book">

                    <p><strong>${book.title}</strong></p>

                    <p>

                        Expiry:
                        ${new Date(book.expiryDate).toDateString()}

                    </p>

                    <button
                        onclick="cancelReservation('${book._id}')"
                        class="cancel-btn"
                    >

                        Cancel Reservation

                    </button>

                </div>

            `;

        });

    }catch(error){

        console.log(error);

    }

}

fetchProfile();



// LOGOUT

function logout(){

    localStorage.clear();

    window.location.href = "login.html";

}



// CANCEL RESERVATION

async function cancelReservation(id){

    try{

        const response = await fetch(`/api/reservation/${id}`,{

            method:"DELETE"

        });

        const data = await response.json();

        window.location.reload();

        fetchProfile();

    }catch(error){

        console.log(error);

    }

}