import {solve} from './solver';
self.onmessage=(e)=>{const {request,tiles,state,budget}=e.data;self.postMessage({request,...solve(tiles,state,budget)});};
