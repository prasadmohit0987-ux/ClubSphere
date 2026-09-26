async function loadClubs() {

    try {

        const response = await fetch("/api/clubs");

        const clubs = await response.json();

        const container =
            document.getElementById("clubs");

        container.innerHTML = "";

        clubs.forEach(club => {

            const card =
                document.createElement("div");

            card.className = "club-card";

            card.innerHTML = `
                <h2>${club.name}</h2>

                <p>
                    <strong>Category:</strong>
                    ${club.category}
                </p>

                <p>
                    ${club.description}
                </p>

                <p>
                    <strong>President:</strong>
                    ${club.president}
                </p>

                <a
                    class="button"
                    href="club.html?id=${club.id}"
                >
                    View Details
                </a>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        document.getElementById("clubs").innerHTML =
            "<p>Unable to load clubs.</p>";

    }

}

loadClubs();