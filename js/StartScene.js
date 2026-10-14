import { BG, MUTED } from './config.js';
import { txt, rect, button, startSession } from './gameHelpers.js';

export default class StartScene extends Phaser.Scene{constructor(){super('Start')}
  create(){this.cameras.main.setBackgroundColor(BG);txt(this,500,105,'PROGRESSIVE MATRICES',39);txt(this,500,159,'Pattern Recognition Challenge',22,MUTED);
    rect(this,170,215,660,275);txt(this,500,260,'Complete 12 original visual matrix puzzles',25);
    ['Choose the missing tile from six answers','Difficulty increases as you progress','Your score, answers and duration are saved locally'].forEach((line,i)=>txt(this,500,323+i*46,line,20,MUTED));
    button(this,337,525,326,62,'START TEST',()=>{startSession();this.scene.start('GameScene',{index:0})},23);
    button(this,337,611,326,53,'RESULT HISTORY',()=>this.scene.start('History'));
  }}
