import { BG, MUTED } from './config.js';
import { txt, rect, button } from './gameHelpers.js';

export default class ResultsScene extends Phaser.Scene{constructor(){super('Results')}
  init(data){this.entry=data.entry}
  create(){this.cameras.main.setBackgroundColor(BG);let a=this.entry;txt(this,500,74,'TEST COMPLETE',38);txt(this,500,162,`${a.correct} / ${a.total}`,65);txt(this,500,225,`${Math.round(a.correct/a.total*100)}% correct`,25,MUTED);
    txt(this,500,269,`Time: ${Math.floor(a.seconds/60)}m ${a.seconds%60}s     •     Saved locally`,20);
    rect(this,142,318,716,220);txt(this,500,344,'QUESTION REVIEW',20);
    a.answers.forEach((o,j)=>{let x=175+(j%6)*116,y=384+Math.floor(j/6)*80;rect(this,x,y,90,64,o.isCorrect?0x23564c:0x633b47,7,null);txt(this,x+45,y+19,`#${j+1}`,16);txt(this,x+45,y+43,o.isCorrect?'✓':'✕',19)});
    txt(this,500,570,'Practice score only — not a standardized IQ score.',19,MUTED);
    button(this,170,621,205,58,'PLAY AGAIN',()=>this.scene.start('Start'));
    button(this,399,621,205,58,'HISTORY',()=>this.scene.start('History'));
    button(this,627,621,205,58,'EXPORT JSON',()=>this.exportEntry());
  }
  exportEntry(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(this.entry,null,2)],{type:'application/json'}));a.download='matrices-result-'+this.entry.date.slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000)}
}
