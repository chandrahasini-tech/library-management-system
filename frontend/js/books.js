const bookForm = document.getElementById("bookForm");

if(bookForm){

    bookForm.addEventListener("submit", async (e)=>{

        e.preventDefault();

        const bookData = {

            title: document.getElementById("title").value,
            author: document.getElementById("author").value,
            genre: document.getElementById("genre").value,
            copies: document.getElementById("copies").value,
            image: document.getElementById("image").value,
            description: document.getElementById("description").value

        };

        try{

            const response = await fetch("/api/books/add",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(bookData)

            });

            if(response.ok){

                bookForm.reset();

                location.reload();

            }

        }catch(error){

            console.log(error);

        }

    });

}