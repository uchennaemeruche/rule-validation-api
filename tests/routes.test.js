const supertest = require("supertest");
const app = require("../app");
describe("GET Endpoint", () => {
  it("should return with data [HTTP GET '/']", async () => {
    const res = await supertest(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.name).toBe("Uchenna Emeruche");
    expect(res.body.data.github).toContain("@");
  });

  it("should return: field missions successfully validated. with [HTTP 200 status]", async () => {
    const res = await supertest(app)
      .post("/validate-rule")
      .send({
        rule: {
          field: "missions.count",
          condition: "gte",
          condition_value: 45,
        },
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: {
            count: 45,
            successful: 44,
            failed: 1,
          },
        },
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.validation.error).toBe(false);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("data");
  });
  it("should return: rule is required. with a [HTTP 400 status] code for missing field[rule]", async () => {
    const res = await supertest(app)
      .post("/validate-rule")
      .send({
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: {
            count: 45,
            successful: 44,
            failed: 1,
          },
        },
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("rule is required.");
    expect(res.body.data).toBe(null);
  });
  it("should return invalid JSON payload. with [HTTP 400 status] ", async () => {
    const res = await supertest(app).post("/validate-rule").send("Uchh...");
    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toBe("error");
    expect(res.body.data).toBe(null);
  });
  it("should return: rule should be an object. with [HTTP 400 status]", async () => {
    const res = await supertest(app)
      .post("/validate-rule")
      .send({
        rule: 1,
        data: {
          name: "James Holden",
          crew: "Rocinante",
          age: 34,
          position: "Captain",
          missions: {
            count: 45,
            successful: 44,
            failed: 1,
          },
        },
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("rule should be an object.");
    expect(res.body.status).toBe("error");
    expect(res.body.data).toBe(null);
  });
  it("should return: field 5 is missing from data. with [HTTP 400 status]", async () => {
    const res = await supertest(app)
      .post("/validate-rule")
      .send({
        rule: {
          field: "5",
          condition: "contains",
          condition_value: "rocinante",
        },
        data: ["The Nauvoo", "The Razorback", "The Roci", "Tycho"],
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("field 5 is missing from data.");
    expect(res.body.status).toBe("error");
    expect(res.body.data).toBe(null);
  });

  it("should respond with status code 404 if resource is not found", async () => {
    const res = await supertest(app).get(`/validate}`);
    expect(res.statusCode).toEqual(400);
  });
});
