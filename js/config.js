export const W = 1000;
export const H = 760;
export const STORAGE = 'progressiveMatricesResults_v1';
export const BG = 0x101827;
export const PANEL = 0x1b2940;
export const TILE = 0x263750;
export const BORDER = 0x536681;
export const WHITE = '#f2f6ff';
export const MUTED = '#adbed6';

const config = {
  type: Phaser.AUTO,
  width: W,
  height: H,
  parent: 'game',
  backgroundColor: BG,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default config;
