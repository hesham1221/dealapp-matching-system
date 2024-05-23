import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const { should } = chai;
should();

chai.use(chaiHttp);

describe('Auth', () => {
  afterEach(async () => {
    // Clean up the users created during the tests
    await User.deleteMany({ phone: { $in: ['1234567890', '0987654321'] } });
  });

  describe('/POST register', () => {
    it('it should register a user', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          phone: '1234567890',
          password: 'password123',
          role: 'CLIENT'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('token');
          done();
        });
    });
  });

  describe('/POST login', () => {
    it('it should login a user', (done) => {
      // First, create a user to login
      const user = new User({
        name: 'Login User',
        phone: '0987654321',
        password: bcrypt.hashSync('password123', 10),
        role: 'CLIENT',
        status: 'ACTIVE',
      });
      user.save().then(() => {
        chai.request(app)
          .post('/api/auth/login')
          .send({
            phone: '0987654321',
            password: 'password123'
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('token');
            done();
          });
      });
    });
  });
});
