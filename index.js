const recipes = [
  {
    id: 2,
    name: "Recipe002",
    duration: 100,
    version: 1,
    createdDate: "2022-03-08T08:04:25.637Z",
    steps: [
      {
        inletLabel: "port-HCL",
        bankId: 1,
        inletId: 1,
        duration: 60,
      },
      {
        inletLabel: "port-Ammonia",
        bankId: 2,
        inletId: 2,
        duration: 70,
      },
    ],
    execInfo: {
      scheduledCount: 3,
      isRunning: false,
      startTime: null,
      percentageCompleted: 0,
      paused: false,
      pausedTime: null,
    },
  },
  {
    id: 3,
    name: "Recipe003",
    duration: 100,
    version: 1,
    createdDate: "2022-03-08T08:04:25.637Z",
    steps: [
      {
        inletLabel: "port-HCL",
        bankId: 1,
        inletId: 1,
        duration: 60,
      },
      {
        inletLabel: "port-Ammonia",
        bankId: 2,
        inletId: 2,
        duration: 70,
      },
    ],
    execInfo: {
      scheduledCount: 5,
      isRunning: false,
      startTime: null,
      percentageCompleted: 0,
      paused: false,
      pausedTime: null,
    },
  },
];

const mappedRecipe = recipes.map((recipe) => ({
  ...recipe,
  scheduledCount: recipe.execInfo.scheduledCount,
}));

console.log(mappedRecipe);

const o1 = {
  id: 2,
  name: "Recipe002",
  duration: 100,
  version: 1,
  createdDate: "2022-03-08T08:04:25.637Z",
  steps: [
    {
      inletLabel: "port-HCL",
      bankId: 1,
      inletId: 1,
      duration: 60,
    },
    {
      inletLabel: "port-Ammonia",
      bankId: 2,
      inletId: 2,
      duration: 70,
    },
  ],
  execInfo: {
    scheduledCount: 3,
    isRunning: false,
    startTime: null,
    percentageCompleted: 0,
    paused: false,
    pausedTime: null,
  },
};

const o2 = JSON.parse(JSON.stringify(o1));

o2.execInfo.isRunning = true;

console.log(o1);
console.log(o2);
