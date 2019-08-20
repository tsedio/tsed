import {
  AfterRoutesInit,
  BeforeRoutesInit,
  ExpressApplication,
  Inject,
  ServerSettingsService,
  Service
} from "@tsed/common";
import * as Passport from "passport";
import {Strategy} from "passport-local";
import {BadRequest, NotFound} from "ts-httpexceptions";
import {IUser} from "../interfaces/User";
import {UsersService} from "../services/users/UsersService";

@Service()
export class PassportLocalService implements BeforeRoutesInit, AfterRoutesInit {

  constructor(private usersService: UsersService,
              private serverSettings: ServerSettingsService,
              @Inject(ExpressApplication) private  expressApplication: ExpressApplication) {

    // used to serialize the user for the session
    Passport.serializeUser(PassportLocalService.serialize);

    // used to deserialize the user
    Passport.deserializeUser(this.deserialize.bind(this));
  }

  /**
   *
   * @param user
   * @param done
   */
  static serialize(user, done) {
    done(null, user._id);
  }

  $beforeRoutesInit() {
    const options: any = this.serverSettings.get("passport") || {} as any;
    const {userProperty, pauseStream} = options;

    this.expressApplication.use(Passport.initialize({userProperty}));
    this.expressApplication.use(Passport.session({pauseStream}));
  }

  $afterRoutesInit() {
    this.initializeSignup();
    this.initializeLogin();
  }

  /**
   *
   * @param id
   * @param done
   */
  public deserialize(id, done) {
    done(null, this.usersService.find(id));
  }

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  public initializeSignup() {
    Passport
      .use("signup", new Strategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      }, this.verify));
  }

  verify(req, email, password, done) {
    const {firstName, lastName} = req.body;
    // asynchronous
    // User.findOne wont fire unless data is sent back
    // process.nextTick(() => {
    this.signup({
      firstName,
      lastName,
      email,
      password
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
    // });
  }

  /**
   *
   * @param user
   * @returns {Promise<any>}
   */
  async signup(user: IUser) {

    const exists = await this.usersService.findByEmail(user.email);

    if (exists) {
      throw new BadRequest("Email is already registered");
    }

    // Create new User
    return await this.usersService.create(<any>{
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName
    });
  }

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  public initializeLogin() {
    Passport.use("login", new Strategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true // allows us to pass back the entire request to the callback
    }, (req, email, password, done) => {
      this.login(email, password)
        .then((user) => done(null, user))
        .catch((err) => done(err));
    }));
  }

  /**
   *
   * @param email
   * @param password
   * @returns {Promise<boolean>}
   */
  async login(email: string, password: string): Promise<IUser> {
    const user = await this.usersService.findByCredential(email, password);
    if (user) {
      return user;
    }

    throw new NotFound("User not found");
  }
}
