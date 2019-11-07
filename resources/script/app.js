import * as lib from '../lib/lib.js';

var $ = require('jquery');

$(window).on('load',function(){
    console.log(lib.square(13));
    this.console.log('load');
});


