import config from './config.js';
import StartScene from './StartScene.js';
import GameScene from './GameScene.js';
import ResultsScene from './ResultsScene.js';
import HistoryScene from './HistoryScene.js';

new Phaser.Game({
  ...config,
  scene: [StartScene, GameScene, ResultsScene, HistoryScene],
});
