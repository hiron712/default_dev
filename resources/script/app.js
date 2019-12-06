import * as lib from '../lib/lib.js';

let $ = require('jquery');

$(window).on('load',()=>{
    console.log(lib.square(122));
    console.log('load');
});


