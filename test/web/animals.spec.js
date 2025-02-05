import { config } from "dotenv";
import request from "supertest";
import AnimalService from "../../src/services/animal.service";
import app from "../../src/app";

config();
const service = new AnimalService(process.env.API_URL);

describe("/", function () {
  it("should get animals", function () {
    return request(app)
      .get("/animals")
      .expect(200)
      .then((data) => {
        expect(data.text).toContain("Animals");
      });
  });

  it("should get a animal", async () => {
    let item = {
      name: "Tom",
      description: "Friend of Jerry",
      colour: "red",
      type: "mammals",
    };
    const createdAnimal = await service.create(item);
    return request(app)
      .get("/animals/" + createdAnimal.id)
      .expect(200)
      .then((data) => {
        expect(data.text).toContain("Animal");
      });
  });

  it("should fail to get a animal", function () {
    return request(app)
      .get("/animals/123")
      .expect(400)
      .then((data) => {
        expect(data.text).toContain("Sorry, the service is unavailable");
      });
  });

  it("should get add animal page", function () {
    return request(app)
      .get("/animals/add")
      .expect(200)
      .then((data) => {
        expect(data.text).toContain("Add a Animal");
      });
  });

  it("should add a animal", function () {
    return request(app).post("/animals").expect(302).send({
      name: "Test animal",
      description: "Test description",
      colour: "red",
      type: "fish",
    });
  });

  it("should get update animal page", async () => {
    let item = {
      name: "Tom",
      description: "Friend of Jerry",
      colour: "red",
      type: "mammals",
    };
    const createdAnimal = await service.create(item);

    return request(app)
      .get("/animals/" + createdAnimal.id + "/update")
      .expect(200)
      .then((data) => {
        expect(data.text).toContain("Update Animal");
      });
  });

  it("should show error page trying to view form to update non existing animal", async () => {
    return request(app)
      .get("/animals/123/update")
      .expect(400)
      .then((data) => {
        expect(data.text).toContain("Sorry, the service is unavailable");
      });
  });

  it("should update a animal", async () => {
    let item = {
      name: "Tom",
      description: "Friend of Jerry",
      colour: "red",
      type: "mammals",
    };
    const createdAnimal = await service.create(item);

    return request(app)
      .post("/animals/" + createdAnimal.id + "/update")
      .expect(302)
      .send({
        name: "Test animal",
        description: "Test description",
        colour: "red",
        type: "fish",
      });
  });

  it("should show error page trying to update a non existing animal", async () => {
    let item = {
      name: "Tom",
      description: "Friend of Jerry",
      colour: "red",
      type: "mammals",
    };
    const createdAnimal = await service.create(item);

    return request(app)
      .post("/animals/123/update")
      .expect(400)
      .then((data) => {
        expect(data.text).toContain("Sorry, the service is unavailable");
      });
  });

  it("should view delete a animal btn", async () => {
    let item = {
      name: "Tom",
      description: "Friend of Jerry",
      colour: "red",
      type: "mammals",
    };
    const createdAnimal = await service.create(item);
    return request(app)
      .get("/animals/" + createdAnimal.id)
      .expect(200)
      .then((data) => {
        expect(data.text).toContain("Delete");
      });
  });

  it("should delete a animal", async () => {
    let item = {
      name: "uniqueName Tom",
      description: "Friend of Jerry",
      colour: "red",
      type: "mammals",
    };
    const createdAnimal = await service.create(item);
    return request(app)
      .get("/animals/" + createdAnimal.id + "/delete")
      .expect(302);
  });

  it("should show error page trying to delete a non existing animal", async () => {
    return request(app)
      .get("/animals/123/delete")
      .expect(400)
      .then((data) => {
        expect(data.text).toContain("Sorry, the service is unavailable");
      });
  });
});
