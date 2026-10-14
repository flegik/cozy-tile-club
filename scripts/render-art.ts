import {writeFileSync,mkdirSync} from 'node:fs';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {Motif} from '../src/assets/Motif';
mkdirSync('/tmp/cozy-art',{recursive:true});for(let n=0;n<6;n++)writeFileSync(`/tmp/cozy-art/${n}.svg`,renderToStaticMarkup(React.createElement(Motif,{n,size:180})));
