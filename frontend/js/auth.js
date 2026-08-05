// REGISTER

const registerForm = document.getElementById("registerForm");

if(registerForm){

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const userData = {

            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            role: document.getElementById("role").value

        };

        try{

            const response = await fetch("/api/auth/register",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(userData)

            });

            if(response.ok){

                window.location.href = "login.html";

            }

        }catch(error){

            console.log(error);

            alert("Registration Failed");

        }

    });

}



// LOGIN

const loginForm = document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const loginData = {

            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            role: document.getElementById("role").value

        };

        try{

            const response = await fetch("/api/auth/login",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(loginData)

            });

            const data = await response.json();

            if(response.ok){

                localStorage.setItem(
                    "userEmail",
                    loginData.email
                );

                localStorage.setItem(
                    "userRole",
                    data.role
                );

                if(data.role === "admin"){

                    window.location.href = "admin.html";

                }else{

                    window.location.href = "index.html";

                }

            }else{

                alert(data.message);

            }

        }catch(error){

            console.log(error);

            alert("Login Failed");

        }

    });

}