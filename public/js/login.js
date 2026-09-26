document
    .getElementById("loginForm")
    .addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const response = await fetch(
            "/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        document.getElementById("message")
            .textContent =
                data.message || data.error;

        if (response.ok) {

            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 800);

        }

    });