process.env.NODE_ENV = "test";

const User = require("../models/userModel");
const Note = require("../models/noteModel");
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const server = require("../server");
require("dotenv").config();

chai.use(chaiHttp);

const SIGNUP_ROUTE = process.env.SIGNUP_ROUTE;
const NOTES_ROUTE = process.env.NOTES_ROUTE;
const CREATE_NOTE_ROUTE = process.env.CREATE_NOTE_ROUTE;

let authToken;
let note_id;

before((done) => {
  let user = {
    name: "note test user",
    email: "notetestuser@test.com",
    password: "Password123!",
  };
  chai
    .request(server)
    .post(SIGNUP_ROUTE)
    .send(user)
    .end((err, res) => {
      res.should.have.status(201);
      authToken = res.body.token;
      done();
    });
});

after((done) => {
  // Ensure that deletion completes after tests finish
  User.deleteMany().then(() => {
    Note.deleteMany().then(() => {
      done();
    });
  });
});

describe("Testing All Note Related Routes", () => {
  it("test default API welcome route", (done) => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        const actualVal = res.body.message;
        expect(actualVal).to.be.eql("API is running");
        done();
      });
  });

  it("should verify that we have 0 notes in the DB", (done) => {
    chai
      .request(server)
      .get(NOTES_ROUTE)
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(0);
        done();
      });
  });

  it("should POST a valid note", (done) => {
    const note = {
      title: "Test note",
      content: "testing123abc",
      category: "test",
    };
    chai
      .request(server)
      .post(CREATE_NOTE_ROUTE)
      .set("Authorization", `Bearer ${authToken}`)
      .send(note)
      .end((err, res) => {
        res.should.have.status(200);
        note_id = res.body._id;
        done();
      });
  });

  it("should verify that new note was added to DB", (done) => {
    chai
      .request(server)
      .get(NOTES_ROUTE)
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(1);
        done();
      });
  });

  it("should GET created note", (done) => {
    chai
      .request(server)
      .get(`${NOTES_ROUTE}/${note_id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body._id.should.be.equal(note_id);
        done();
      });
  });

  it("should UPDATE note", (done) => {
    const updatedNote = {
      title: "Updated note",
      content: "new content",
      category: "update",
    };
    chai
      .request(server)
      .patch(`${NOTES_ROUTE}/${note_id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedNote)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.title.should.be.equal("Updated note");
        res.body.content.should.be.equal("new content");
        res.body.category.should.be.equal("update");
        done();
      });
  });

  it("should DELETE 1 note", (done) => {
    chai
      .request(server)
      .delete(`${NOTES_ROUTE}/${note_id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("should verify that new note was deleted from DB", (done) => {
    chai
      .request(server)
      .get(NOTES_ROUTE)
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(0);
        done();
      });
  });
});
