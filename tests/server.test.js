const request = require("supertest");

const app = require("../server");

describe("ClubSphere API", () => {

    test("Health endpoint should work", async () => {

        const response =
            await request(app)
                .get("/api/health");

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.status)
            .toBe("OK");

    });

    test("Clubs endpoint should return clubs", async () => {

        const response =
            await request(app)
                .get("/api/clubs");

        expect(response.statusCode)
            .toBe(500);

        expect(Array.isArray(response.body))
            .toBe(true);

    });

    test("Registration should reject missing fields", async () => {

        const response =
            await request(app)
                .post("/api/register")
                .send({});

        expect(response.statusCode)
            .toBe(400);

    });

});