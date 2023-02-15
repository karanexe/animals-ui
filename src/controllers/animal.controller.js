import { config } from "dotenv";
config();

import AnimalService from "../services/animal.service.js";
const service = new AnimalService(process.env.API_URL);

const TYPES = [
  "amphibian",
  "bird",
  "fish",
  "invertebrate",
  "mammals",
  "reptiles",
];

export function all(req, res) {
  service.all().then((data) => {
    res.render("animals", { animals: data });
  });
}

export function get(req, res, next) {
  service
    .get(req.params.id)
    .then((data) => {
      res.render("view-animal", { animal: data });
    })
    .catch((error) => {
      next(error);
    });
}

export function addPage(req, res) {
  res.render("add-animal", { types: TYPES });
}

export function add(req, res) {
  service.create(req.body).then(() => {
    res.redirect("/animals");
  });
}

export function deleteAnimal(req, res) {
  service.delete(req.params.id).then(() => {
    res.redirect("/animals");
  });
}
