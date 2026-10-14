import { BG, PANEL, MUTED, STORAGE } from './config.js';
import { txt, rect, button, readHistory } from './gameHelpers.js';

export default class HistoryScene extends Phaser.Scene {
  constructor() {
    super('History');
  }

  create() {
    this.cameras.main.setBackgroundColor(BG);
    txt(this, 500, 72, 'SAVED RESULTS', 38);

    let data = readHistory();

    if (!data.length) {
      txt(this, 500, 280, 'No completed tests yet.', 24, MUTED);
    }

    data.slice(0, 8).forEach((a, i) => {
      const y = 146 + i * 57;

      rect(this, 140, y, 720, 46, PANEL, 8);
      txt(this, 278, y + 23, new Date(a.date).toLocaleString(), 17);
      txt(this, 545, y + 23, `${a.correct}/${a.total} correct`, 18);
      txt(
        this,
        742,
        y + 23,
        `${Math.floor(a.seconds / 60)}m ${a.seconds % 60}s`,
        17,
        MUTED,
      );
    });

    button(this, 187, 649, 260, 59, 'BACK TO MENU', () => {
      this.scene.start('Start');
    });

    button(this, 554, 649, 260, 59, 'CLEAR HISTORY', () => {
      if (confirm('Delete all saved test results on this device?')) {
        localStorage.removeItem(STORAGE);
        this.scene.restart();
      }
    });
  }
}
