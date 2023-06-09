import { Application, Tracker } from '@vexa/core-app';

class AppTracker extends Tracker {}

const app = new Application({
  resolvePublic: () => '123',
  tracker: new AppTracker(),
});

const run = async () => {
  await app.init();
};

run();
// console.log(app);
