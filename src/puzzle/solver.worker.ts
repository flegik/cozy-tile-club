import {continuation} from './continuation';
self.onmessage=(e)=>{const {request,tiles,state,budget,certificate}=e.data;self.postMessage({request,...continuation(tiles,state,certificate,budget)});};
