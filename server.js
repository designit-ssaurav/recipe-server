const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");

const fs = require("fs");
const path = require("path");

const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(
  jsonServer.rewriter({
    "/recipes/status": "/recipes",
    "/recipes/:name/:version":
      "/recipes?recipe.name=:name&recipe.version=:version",
  })
);

server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  const jsonData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db.json"), {
      encoding: "utf-8",
    })
  );
  const recipeLength = jsonData.recipes.length;

  const getDuration = (steps) => {
    return steps.reduce((prev, curr) => {
      return prev + curr.duration;
    }, 0);
  };

  if (req.method === "POST") {
    try {
      if (req.body.id === null || !req.body.id) {
        const newRecipe = {};
        const newId = recipeLength + 1;
        newRecipe.id = newId;
        newRecipe.name = req.body.name ? req.body.name : "Recipe " + newId;
        newRecipe.duration = getDuration(req.body.steps);
        newRecipe.version = 1;

        newRecipe.createdBy = req.body.createdBy ? req.body.createdBy : "Admin";
        newRecipe.createdDate = new Date().toISOString();
        newRecipe.steps = req.body.steps ? req.body.steps : [];

        req.body.recipe = newRecipe;
        req.body.scheduledCount = req.body.scheduledCount
          ? req.body.scheduledCount
          : 3;
        req.body.isRunning = req.body.isRunning ? req.body.isRunning : false;
        req.body.startTime = req.body.startTime ? req.body.startTime : null;
        req.body.percentageCompleted = req.body.percentageCompleted
          ? req.body.percentageCompleted
          : 0;
        req.body.paused = req.body.paused ? req.body.paused : false;
        req.body.pausedTime = req.body.pausedTime
          ? req.body.pausedTime
          : new Date().toISOString();
        if (req.body.name || req.body.name === null) {
          delete req.body.name;
        }
        if (req.body.steps || req.body.steps === null) {
          delete req.body.steps;
        }
        if (req.body.duration || req.body.duration === null) {
          delete req.body.duration;
        }
        if (req.body.version || req.body.version === null) {
          delete req.body.version;
        }
        if (req.body.createdDate || req.body.createdDate === null) {
          delete req.body.createdDate;
        }
        if (req.body.createdBy || req.body.createdBy === null) {
          delete req.body.createdBy;
        }
      } else {
        const recipeId = +req.body.id;
        const filteredRecipe = jsonData.recipes.find(
          (r) => r.recipe.id === recipeId
        );
        const allRecipesWithId = jsonData.recipes.filter(
          (r) => r.recipe.id === recipeId
        );
        const latestVersion =
          allRecipesWithId[allRecipesWithId.length - 1].recipe.version;
        delete req.body.id;
        filteredRecipe.recipe = {
          ...filteredRecipe.recipe,
          duration: req.body.steps
            ? getDuration(req.body.steps)
            : filteredRecipe.recipe.duration,
          steps: req.body.steps ? req.body.steps : filteredRecipe.recipe.steps,
          createdDate: new Date().toISOString(),
          version: latestVersion + 1,
        };
        for (let key in req.body) {
          delete req.body[key];
        }
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

  if (req.method === "DELETE") {
    if (req.query["recipe.name"] && req.query["recipe.version"]) {
      const recipeName = req.query["recipe.name"];
      const recipeVersion = req.query["recipe.version"];

      const recipeToDelete = jsonData.recipes.find(
        (rec) =>
          rec.recipe.name === recipeName &&
          rec.recipe.version === +recipeVersion
      );
      req.params.id = recipeToDelete.id;
      req.url = `/recipes/${recipeToDelete.id}`;
    }
  }
  next();
});

router.render = (req, res) => {
  const response = {};
  response.result = res.locals.data;
  if (
    req.method === "GET" &&
    req.query["recipe.name"] &&
    req.query["recipe.version"]
  ) {
    if (res.locals.data && res.locals.data.length > 0) {
      response.result = { ...res.locals.data[0].recipe };
    }
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
