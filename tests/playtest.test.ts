import {it,expect} from 'vitest';
import {fresh,startAttempt,playTile,undoAttempt,applyHint,parseSave,switchMode} from '../src/save/store';
import {levels} from '../src/puzzle/levels';
import {solve} from '../src/puzzle/solver';
import {bumpTracking,playtestReport} from '../src/game/playtest';
it('records real actions per mode and persists across resumption without replenishing counts',()=>{
 let s=startAttempt(fresh(),1);expect(s.tracking.normal[1].attempts).toBe(1);
 const a=s.campaigns.normal.active!;s=applyHint(s,{status:'budget',path:[],nodes:1},a.state);expect(s.tracking.normal[1].hints).toBe(0);
 s=applyHint(s,solve(levels[0].tiles,a.state),a.state);expect(s.tracking.normal[1].hints).toBe(1);
 s=undoAttempt(s);expect(s.tracking.normal[1].undos).toBe(0);
 s=playTile(s,levels[0].certificate[0]);s=undoAttempt(s);expect(s.tracking.normal[1].undos).toBe(1);
 s=bumpTracking(s,1,'seconds',12.5);s=parseSave(JSON.stringify(s));expect(s.tracking.normal[1].seconds).toBe(12.5);
 s=startAttempt(s,1);expect(s.tracking.normal[1].attempts).toBe(2);expect(s.tracking.normal[1].restarts).toBe(1);
 s=startAttempt(switchMode(s,'cozy'),1);expect(s.tracking.cozy[1].attempts).toBe(1);expect(s.tracking.normal[1].attempts).toBe(2);
 expect(playtestReport(s).modes).toEqual(s.tracking);expect(playtestReport(s)).not.toHaveProperty('owned');
});
it('records loss once even after Undo and repeats; wins record once and replay creates a new attempt',()=>{
 let s=startAttempt(fresh(),1);for(const id of levels[0].lossCertificate)s=playTile(s,id);expect(s.tracking.normal[1].losses).toBe(1);
 s=undoAttempt(s);s=playTile(s,levels[0].lossCertificate.at(-1)!);expect(s.tracking.normal[1].losses).toBe(1);
 s=startAttempt(s,1);for(const id of levels[0].certificate)s=playTile(s,id);expect(s.tracking.normal[1].wins).toBe(1);s=playTile(s,0);expect(s.tracking.normal[1].wins).toBe(1);
 expect(parseSave(JSON.stringify(s))).toEqual(s);
});
it('additively migrates existing v3 saves without fabricating past playtest activity or losing either mode',()=>{
 const old:any=startAttempt(switchMode(startAttempt(fresh(),1),'cozy'),1);delete old.tracking;delete old.tutorialCompleted;delete old.campaigns.normal.active.observed;delete old.campaigns.cozy.active.observed;
 const s=parseSave(JSON.stringify(old));expect(s.mode).toBe('cozy');expect(s.tracking).toEqual({normal:{},cozy:{}});expect(s.tutorialCompleted).toBe(false);expect(s.campaigns.normal.active?.state).toEqual(old.campaigns.normal.active.state);expect(s.campaigns.cozy.active?.state).toEqual(old.campaigns.cozy.active.state);expect(s.placed).toEqual(old.placed);expect(s.hearts).toBe(old.hearts);
});
