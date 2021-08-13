const $ = require('jquery');

import * as lib from '../lib/lib.js';

$(window).on('load',()=>{
    console.log(lib.square(10922));
    console.log('load');
});


