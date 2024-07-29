process.env.NODE_ENV = "test";

const User = require("../models/userModel");
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const server = require("../server");

chai.use(chaiHttp);

const SIGNUP_ROUTE = process.env.SIGNUP_ROUTE;
const LOGIN_ROUTE = process.env.LOGIN_ROUTE;
const PROFILE_ROUTE = process.env.PROFILE_ROUTE;

let authToken;

before(async () => {
  // Ensure that deletion completes before tests start
  await User.deleteMany({ name: "test user" });
});

after(async () => {
  // Ensure that deletion completes after tests finish
  await User.deleteMany({ name: "test user" });
});

describe("Testing All User Routes", () => {
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

  it("should create a new user", (done) => {
    let user = {
      name: "test user",
      email: "testuser@test.com",
      password: "Password123!",
    };
    chai
      .request(server)
      .post(SIGNUP_ROUTE)
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });

  it("should fail registering due to email conflict", (done) => {
    let user = {
      name: "test user",
      email: "testuser@test.com",
      password: "Password123!",
    };
    chai
      .request(server)
      .post(SIGNUP_ROUTE)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("should fail registering due to weak password", (done) => {
    let user = {
      name: "test user",
      email: "testuser@test.com",
      password: "weakpassword",
    };
    chai
      .request(server)
      .post(SIGNUP_ROUTE)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("should login created user", (done) => {
    let user = {
      email: "testuser@test.com",
      password: "Password123!",
    };
    chai
      .request(server)
      .post(LOGIN_ROUTE)
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("token");
        authToken = res.body.token;
        done();
      });
  });

  it("should fail login due to incorrect email", (done) => {
    let user = {
      email: "wrongemail@test.com",
      password: "Password123!",
    };
    chai
      .request(server)
      .post(LOGIN_ROUTE)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("should fail login due to incorrect password", (done) => {
    let user = {
      email: "testuser@test.com",
      password: "incorrect password",
    };
    chai
      .request(server)
      .post(LOGIN_ROUTE)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("should update profile of a logged-in user", (done) => {
    let updatedInfo = {
      name: "updated user",
    };
    chai
      .request(server)
      .patch(PROFILE_ROUTE)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedInfo)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.name.should.be.equal("updated user");
        done();
      });
  });
});
