const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");

const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.rewriter({ "/recipes/status": "/recipes" }));

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  console.log(req.path);
  const jsonData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db.json"), {
      encoding: "utf-8",
    })
  );
  const recipeLength = jsonData.recipes.length;

  if (req.method === "POST") {
    try {
      if (req.body.id === null || !req.body.id) {
        const newRecipe = {};
        const newId = recipeLength + 1;
        newRecipe.id = newId;
        newRecipe.name = req.body.name ? req.body.name : "Recipe " + newId;
        newRecipe.duration = req.body.duration ? req.body.duration : 100;
        newRecipe.version = 1;
        newRecipe.createdDate = new Date().toISOString();
        newRecipe.steps = req.body.steps
          ? req.body.steps.map((step, ind) => [{ ...step, id: ind + 1 }])
          : [];
        console.log("NEW RECIPE ", newRecipe);
        req.body.recipe = newRecipe;
        req.body.scheduledCount = req.body.scheduledCount
          ? req.body.scheduledCount
          : 3;
        req.body.isRunning = req.body.isRunning ? req.body.isRunning : true;
        req.body.startTime = req.body.startTime
          ? req.body.startTime
          : new Date().toISOString();
        req.body.percentageCompleted = req.body.percentageCompleted
          ? req.body.percentageCompleted
          : 30;
        req.body.paused = req.body.paused ? req.body.paused : false;
        req.body.pausedTime = req.body.pausedTime
          ? req.body.pausedTime
          : new Date().toISOString();
      } else {
        const recipeId = +req.body.id;
        const filteredRecipe = jsonData.recipe.find(
          (r) => r.recipe.id === recipeId
        );
        filteredRecipe.recipe = {
          ...filteredRecipe.recipe,
          ...req.body,
          version: filteredRecipe.recipe.version + 1,
        };
        req.body.recipe = filteredRecipe.recipe;
        req.body.scheduledCount = filteredRecipe.scheduledCount;
        req.body.isRunning = filteredRecipe.isRunning;
        req.body.startTime = filteredRecipe.startTime;
        req.body.percentageCompleted = filteredRecipe.percentageCompleted;
        req.body.paused = filteredRecipe.paused;
        req.body.pausedTime = filteredRecipe.pausedTime;
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    //req.body.lastEditedOn = new Date().toISOString();
    //req.body.updatedOn = new Date().toISOString();
  }
  next();
});

router.render = (req, res) => {
  const response = {};
  response.result = res.locals.data;
  console.log("Request Path :- ", req.path);
  if (req.path.indexOf("status") != -1) {
    response.offset = 0;
    response.limit = 10;
    response.count = 1000;
  }
  res.jsonp(response);
};

// Use default router
server.use(router);
server.listen(3002, () => {
  console.log("\x1b[32m", "JSON Server Running on PORT 3002");
  console.log("\x1b[32m", "--------------------------------");
  console.log("\x1b[35m", "http://localhost:3002/recipes");
  console.log("\x1b[35m", "http://localhost:3002/inlets");
});
