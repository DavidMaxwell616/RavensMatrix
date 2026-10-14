import { BG, TILE, MUTED } from './config.js';
import { N, txt, rect, button, glyph, session, rand, saveHistory } from './gameHelpers.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.index = data.index || 0;
    this.locked = false;
  }

  create() {
    this.cameras.main.setBackgroundColor(BG);

    const i = this.index;
    const q = session.questions[i];

    txt(this, 500, 35, `QUESTION ${i + 1} / ${N * 4}`, 24);
    txt(this, 500, 70, q.formula.title, 21, MUTED);

    rect(this, 247, 103, 506, 442, 0x152238);

    const size = 130;
    const gap = 11;
    const left = 292;
    const top = 125;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const x = left + c * (size + gap);
        const y = top + r * (size + gap);

        rect(this, x, y, size, size, TILE, 10);

        if (r === 2 && c === 2) {
          txt(this, x + size / 2, y + size / 2, '?', 60, '#78aaf0');
        } else {
          glyph(this, x + size / 2, y + size / 2, q.formula.calc(r, c), 1.12);
        }
      }
    }

    txt(this, 500, 568, 'SELECT THE MISSING TILE', 18, MUTED);

    const w = 130;
    const h = 112;
    const slot = 149;
    const x0 = 61;
    const y0 = 598;

    const debugMarkers = [];

    q.options.forEach((option, j) => {
      const x = x0 + j * slot;

      rect(this, x, y0, w, h, TILE, 10);
      glyph(this, x + w / 2, y0 + 46, option, 0.9);
      txt(this, x + w / 2, y0 + 93, String(j + 1), 17, MUTED);

      if (j === q.correct) {
        const outline = this.add.graphics();
        outline.lineStyle(3, 0x72e6a1);
        outline.strokeRoundedRect(x, y0, w, h, 10);
        const label = txt(this, x + w / 2, y0 + 15, 'CORRECT', 13, '#72e6a1');
        debugMarkers.push(outline, label);
      }

      this.add
        .zone(x + w / 2, y0 + h / 2, w, h)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.choose(j));
    });

    const updateDebug = () => {
      const enabled = this.registry.get('debugAnswers') === true;
      debugToggle.t.setText(`Debug answers: ${enabled ? 'ON' : 'OFF'}`);
      debugMarkers.forEach(marker => marker.setVisible(enabled));
    };
    const debugToggle = button(this, 780, 20, 200, 42, '', () => {
      this.registry.set('debugAnswers', this.registry.get('debugAnswers') !== true);
      updateDebug();
    }, 17);
    updateDebug();

    this.input.keyboard.on('keydown', e => {
      const j = Number(e.key) - 1;

      if (j >= 0 && j < 6) {
        this.choose(j);
      }
    });
  }

  choose(j) {
    if (this.locked) {
      return;
    }

    this.locked = true;

    const q = session.questions[this.index];

    session.answers.push({
      question: this.index + 1,
      title: q.formula.title,
      level: q.formula.level,
      choice: j + 1,
      correctChoice: q.correct + 1,
      isCorrect: j === q.correct,
    });

    if (this.index + 1 < session.questions.length) {
      this.scene.start('GameScene', { index: this.index + 1 });
    } else {
      const entry = {
        id: `${Date.now()}-${rand(100000)}`,
        date: session.startedAt,
        seconds: Math.round((Date.now() - session.startMs) / 1000),
        total: session.questions.length,
        correct: session.answers.filter(a => a.isCorrect).length,
        answers: session.answers,
      };

      saveHistory(entry);
      this.scene.start('Results', { entry });
    }
  }
}
