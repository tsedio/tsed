import Fastify from "fastify";

const fastify = Fastify();

const opts = {
  schema: {
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {type: "integer"},
            title: {type: "string"},
            employer: {type: "string"}
          }
        }
      }
    }
  }
};

function Employee({id = null, title = null, employer = null} = {}) {
  this.id = id;
  this.title = title;
  this.employer = employer;
}

fastify.get("/", opts, function (request, reply) {
  const jobs = [];

  for (let i = 0; i < 200; i += 1) {
    jobs[i] = new Employee({
      id: i,
      title: "Software engineer",
      employer: "Fastify"
    });
  }

  reply.send(jobs);
});

fastify.listen(3000);
