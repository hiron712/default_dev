var gulp = require('gulp');
var compass = require('gulp-compass');
var changed = require('gulp-changed');
var postcss = require("gulp-postcss");
var autoprefixer = require('autoprefixer');

var stylus = require('gulp-stylus');

var plumber = require("gulp-plumber");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var pug = require("gulp-pug");

gulp.task('scss', function(){
    //ここからタスクの内容
    gulp.src('htdocs/sass/*.scss')
        .pipe(changed('htdocs/sass/*.scss'))
        .pipe(compass({
            style: 'compressed',
            sourcemap: false,
            comments: false,//コメントを残すか
            css: 'htdocs/css/',//吐き出すcssのフォルダ場所
            sass: 'htdocs/sass/'//sassファイルの場所
        }))
        .pipe(postcss([
            autoprefixer({
                cascade: false
            })
        ]))
        .pipe(gulp.dest('htdocs/css/'));
});


gulp.task('stylus', function() {
    gulp.src(['htdocs/stylus/**/*.styl','!htdocs/stylus/**/_*.styl'])
        .pipe(stylus({
            compress: true
        }))
        .pipe(postcss([
            autoprefixer({
                cascade: false
            })
        ]))
        .pipe(gulp.dest('htdocs/css/'));
});


gulp.task('script', function() {
    gulp.src('htdocs/script/**/*.js')
        .pipe(plumber())
        .pipe(concat('script.js'))
        .pipe(babel({ "presets":["@babel/preset-env"] }))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('htdocs/js'));

});


gulp.task('pug', function buildHTML() {
    return gulp.src( ['./htdocs/pug/**/*.pug', '!./htdocs/pug/**/_*.pug'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./htdocs'))
});

//////////////////////////////
gulp.task('watch', function(){
    gulp.watch( 'htdocs/sass/**/*.scss', ['scss']);
    gulp.watch( 'htdocs/stylus/**/*.styl', ['stylus']);
});
