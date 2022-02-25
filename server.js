const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const { v4: uuidv4 } = require("uuid");

const middlewares = jsonServer.defaults();

server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdOn = new Date().toISOString();
    req.body.lastEditedOn = new Date().toISOString();
    req.body.updatedOn = new Date().toISOString();
    req.body.status = "Assigned to timeline";
    req.body.id = uuidv4();
    if (req.body.steps && req.body.steps.length > 0) {
      req.body.steps = req.body.steps.map((step) => ({
        ...step,
        id: uuidv4(),
      }));
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    req.body.lastEditedOn = new Date().toISOString();
    req.body.updatedOn = new Date().toISOString();
  }
  next();
});

router.render = (req, res) => {
  res.jsonp({
    result: res.locals.data,
  });
};

// Use default router
server.use(router);
server.listen(3002, () => {
  console.log("\x1b[32m", "JSON Server Running on PORT 3002");
  console.log("\x1b[32m", "--------------------------------");
  console.log("\x1b[35m", "http://localhost:3002/recipe");
  console.log("\x1b[35m", "http://localhost:3002/inlets");
});
