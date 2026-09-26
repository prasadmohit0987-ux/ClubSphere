async function loadDashboard() {

    const userResponse =
        await fetch("/api/me");

    if (!userResponse.ok) {

        window.location.href =
            "login.html";

        return;

    }

    const user =
        await userResponse.json();

    document.getElementById("userInfo")
        .innerHTML = `
            <p>
                <strong>Name:</strong>
                ${user.name}
            </p>

            <p>
                <strong>Email:</strong>
                ${user.email}
            </p>

            <p>
                <strong>Role:</strong>
                ${user.role}
            </p>
        `;

    const clubsResponse =
        await fetch("/api/my-clubs");

    const clubs =
        await clubsResponse.json();

    const container =
        document.getElementById("myClubs");

    if (clubs.length === 0) {

        container.innerHTML = `
            <p>
                You have not joined any clubs yet.
            </p>

            <a
                class="button"
                href="clubs.html"
            >
                Explore Clubs
            </a>
        `;

        return;

    }

    container.innerHTML = "";

    clubs.forEach(club => {

        const card =
            document.createElement("div");

        card.className = "club-card";

        card.innerHTML = `
            <h3>${club.name}</h3>

            <p>${club.description}</p>

            <p>
                <strong>Category:</strong>
                ${club.category}
            </p>
        `;

        container.appendChild(card);

    });

}

async function logout() {

    await fetch(
        "/api/logout",
        {
            method: "POST"
        }
    );

    window.location.href =
        "index.html";

}

loadDashboard();