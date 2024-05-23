import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Ad from '../models/Ad.js';

const { should } = chai;
should();

chai.use(chaiHttp);

describe('Ads', function () {
  let agentToken;
  let createdAdId;

  before(async function () {
    this.timeout(10000); // Ensure timeout is increased for the before hook as well

    // Create an agent user and generate a token for testing
    const agentUser = new User({
      name: 'Agent User',
      phone: '2233445566',
      password: await bcrypt.hash('agentpassword', 10),
      role: 'AGENT',
      status: 'ACTIVE',
    });
    await agentUser.save();
    agentToken = jwt.sign({ id: agentUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  });

  after(async () => {
    // Clean up the agent user and ads created during the tests
    await User.deleteOne({ phone: '2233445566' });
    await Ad.deleteOne({ _id: createdAdId });
  });

  describe('/POST ad', () => {
    it('it should create an ad', (done) => {
      chai.request(app)
        .post('/api/ads')
        .set('Authorization', `Bearer ${agentToken}`)
        .send({
          propertyType: 'HOUSE',
          area: 120,
          price: 50000,
          city: 'Cairo',
          district: 'Heliopolis',
          description: 'A beautiful house'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          createdAdId = res.body._id; // Save the created ad ID for cleanup
          done();
        });
    });
  });
});
