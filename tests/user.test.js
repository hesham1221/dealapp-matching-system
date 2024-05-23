import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../app.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const { should } = chai;
should();

chai.use(chaiHttp);

describe("Users", () => {
  let adminToken;

  before(async function () {
    // Create an admin user and generate a token for testing
    const adminUser = new User({
      name: "Admin User",
      phone: "1122334455",
      password: await bcrypt.hash("adminpassword", 10),
      role: "ADMIN",
      status: "ACTIVE",
    });
    await adminUser.save();
    adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  after(async () => {
    // Clean up the admin user created during the tests
    await User.deleteOne({ phone: "1122334455" });
  });

  describe("/GET admin-stats", () => {
    it("it should GET admin stats", (done) => {
      chai
        .request(app)
        .get("/api/users/admin-stats")
        .set("Authorization", `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          done();
        });
    });
  });
});
