import { expect, test, describe, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/index.js";

describe("Health Check", () => {
  test("should return OK", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.text).toBe("OK");
  });
});
