import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../app.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import PropertyRequest from "../models/PropertyRequest.js";

const { should } = chai;
should();

chai.use(chaiHttp);

describe("Property Requests", () => {
  let clientToken;
  let createdRequestId;

  before(async () => {
    // Create a client user and generate a token for testing
    const clientUser = new User({
      name: "Client User",
      phone: "3344556677",
      password: await bcrypt.hash("clientpassword", 10),
      role: "CLIENT",
      status: "ACTIVE",
    });
    await clientUser.save();
    clientToken = jwt.sign({ id: clientUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  after(async () => {
    // Clean up the client user and property requests created during the tests
    await User.deleteOne({ phone: "3344556677" });
    await PropertyRequest.deleteOne({ _id: createdRequestId });
  });

  describe("/POST property request", () => {
    it("it should create a property request", (done) => {
      chai
        .request(app)
        .post("/api/property-requests")
        .set("Authorization", `Bearer ${clientToken}`)
        .send({
          propertyType: "APARTMENT",
          area: 90,
          price: 30000,
          city: "Giza",
          district: "Dokki",
          description: "Looking for a cozy apartment",
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          createdRequestId = res.body._id; // Save the created request ID for cleanup
          done();
        });
    });
  });
});
