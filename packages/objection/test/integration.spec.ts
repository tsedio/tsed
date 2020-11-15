import {PlatformTest} from "@tsed/common";
import {Server} from "./helpers/Server";
import {AjvServer} from "./helpers/AjvServer"
import {expect} from "chai";
import {CONNECTION} from "./helpers/connections/ConnectionProvider"
import Knex from "knex";

import {User} from './helpers/models/User'

describe('Objection integrations', () => {
  before(() => {
    PlatformTest.create({
      knex: {
        client: 'sqlite3',
        connection: ':memory:',
        migrations: {
          directory: __dirname + '/helpers/migrations'
        },
        seeds: {
          directory: __dirname + '/helpers/seeds'
        }
      }
    })
  })
  beforeEach(async () => {
    const conn = PlatformTest.injector.get<Knex>(CONNECTION)
    await conn.migrate.latest()
    await conn.seed.run()
  })
  afterEach(() => {
    PlatformTest.bootstrap(Server, {
      knex: {
        client: 'sqlite3',
        connection: ':memory:'
      }
    });
  })
  after(async () => {
    const conn = PlatformTest.injector.get<Knex>(CONNECTION)
    await conn.destroy()
  })

  it('should connect to the database', async () => {
    const conn = PlatformTest.injector.get<ReturnType<Knex>>(CONNECTION)

    const user = await conn.table('users').where({ id: 1 }).first()
    expect(user.name).to.be.equal('John')
  })

  it('should be able to work with Objection.js Model', async () => {
    const user = await User.query().findById(1)
    expect(user.name).to.be.equal('John')
  })
})