var gulp = require('gulp');
var compass = require('gulp-compass');
var changed = require('gulp-changed');
var postcss = require("gulp-postcss");
var autoprefixer = require('autoprefixer');

var stylus = require('gulp-stylus');

var plumber = require("gulp-plumber");
var concat = require("gulp-concat");

//var uglify = require('gulp-uglify');
const uglify = require("gulp-uglify-es").default;

var rename = require('gulp-rename');
var babel = require('gulp-babel');
var pug = require("gulp-pug");

var browserify = require('browserify');
var babelify = require('babelify');

var source     = require('vinyl-source-stream');

var buffer = require('vinyl-buffer');

var glob = require("glob");

/*-------------------------------------------------
--------------------------------------------------*/
gulp.task('scss', function(){
    //ここからタスクの内容
    return gulp.src('resources/sass/*.scss')
        //.pipe(changed('resources/sass/*.scss'))
        .pipe(compass({
            style: 'compressed',
            sourcemap: false,
            comments: false,//コメントを残すか
            css: 'htdocs/assets/css/',//吐き出すcssのフォルダ場所
            sass: 'resources/sass/'//sassファイルの場所
        }))
        .pipe(postcss([
            autoprefixer({
                cascade: false
            })
        ]))
        .pipe(gulp.dest('htdocs/assets/css/'));
});

/*-------------------------------------------------
--------------------------------------------------*/
gulp.task('stylus', function() {
    return gulp.src(['resources/stylus/**/*.styl','!resources/stylus/**/_*.styl'])
        .pipe(stylus({
            compress: true
        }))
        .pipe(postcss([
            autoprefixer({
                cascade: false
            })
        ]))
        .pipe(gulp.dest('htdocs/assets/css/'));
});

/*-------------------------------------------------
--------------------------------------------------*/
//gulp.task('babel', function() {
//    return gulp.src('resources/script/**/*.js')
//        .pipe(plumber())
//        .pipe(concat('script.js'))
//        .pipe(babel({
//            "presets":["@babel/preset-env"] ,
//            "plugins":["@babel/plugin-transform-modules-commonjs"]
//        }))
//        .pipe(rename({suffix: '.min'}))
//        .pipe(uglify())
//        .pipe(gulp.dest('htdocs/js'));
//});


gulp.task('babel', function() {
    var scriptFiles = glob.sync('resources/script/**/*.js');
    return browserify({
        entries: scriptFiles
    })
        .transform(babelify, {presets: ['@babel/preset-env']})
        .bundle()
        .pipe(source('script.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(plumber())
        .pipe(gulp.dest('htdocs/assets/js'));
});

/*-------------------------------------------------
--------------------------------------------------*/
gulp.task('pug', function () {
    return gulp.src( ['./resources/pug/**/*.pug', '!./resources/pug/**/_*.pug'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./htdocs'))
});

/*-------------------------------------------------
--------------------------------------------------*/
gulp.task('watch', function(){
    gulp.watch( 'resources/sass/**/*.scss', gulp.task('scss'));
    gulp.watch( 'resources/stylus/**/*.styl', gulp.task('stylus'));
});
