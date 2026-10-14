// @vitest-environment jsdom
import {it,expect,vi,afterEach} from 'vitest';
import {reducedMotion} from '../src/motion/preference';
import {fresh,parseSave} from '../src/save/store';
afterEach(()=>vi.unstubAllGlobals());
it('respects device preference unless the player explicitly overrides it',()=>{for(const matches of [true,false]){vi.stubGlobal('matchMedia',()=>({matches}));expect(reducedMotion('system')).toBe(matches);expect(reducedMotion('full')).toBe(false);expect(reducedMotion('reduced')).toBe(true);}});
it('preserves overrides and migrates old saves without losing progress',()=>{const save={...fresh(),hearts:123};for(const motion of ['full','reduced','system'] as const)expect(parseSave(JSON.stringify({...save,motion}))).toEqual({...save,motion});const {motion,...old}=save;expect(parseSave(JSON.stringify(old))).toEqual(save);expect(parseSave(JSON.stringify({...save,motion:'invalid'})).motion).toBe('system');});
