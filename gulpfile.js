const gulp = require('gulp'); //タスクランナー

const sass = require('gulp-sass');//SCSS変換用
const stylus = require('gulp-stylus'); //Stylus変換用
const pug = require("gulp-pug"); //Pug変換用
const ejs = require("gulp-ejs"); //ejs変換用

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require("gulp-uglify-es").default;

const postcss = require("gulp-postcss");
const autoprefixer = require('autoprefixer');
const cssSorter = require('css-declaration-sorter');
const mqpacker = require("css-mqpacker");

const plumber = require("gulp-plumber");
const rename = require('gulp-rename');
const glob = require("glob");

const plugin = [
    autoprefixer({
        cascade: false
    }),
    cssSorter({
        order: 'smacss'
    }),
    mqpacker()
];

/*-------------------------------------------------
--------------------------------------------------*/
gulp.task('scss', function(){
    //ここからタスクの内容
    return gulp.src('resources/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(postcss(plugin))
        .pipe(gulp.dest('htdocs/assets/css/'));
});

/*-------------------------------------------------
--------------------------------------------------*/
gulp.task('stylus', function() {
    return gulp.src(['resources/stylus/**/*.styl','!resources/stylus/**/_*.styl'])
        .pipe(stylus({
            compress: true
        }))
        .pipe(postcss(plugin))
        .pipe(gulp.dest('htdocs/assets/css/'));
});

/*-------------------------------------------------
--------------------------------------------------*/
gulp.task('babel', function() {
    var scriptFiles = glob.sync('resources/script/**/*.js', '!./resources/script/**/_*.js');
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
gulp.task( "ejs", function () {
    return gulp.src(["./resources/ejs/**/*.ejs", '!./resources/ejs/**/_*.ejs'])
        .pipe(ejs())
        .pipe(rename({ extname: '.html' }))
        .pipe( gulp.dest( "./htdocs" ) );
});
/*-------------------------------------------------
--------------------------------------------------*/
gulp.task('watch', function(){
    gulp.watch( 'resources/sass/**/*.scss', gulp.task('scss'));
    gulp.watch( 'resources/stylus/**/*.styl', gulp.task('stylus'));
    gulp.watch( 'resources/pug/**/*.pug', gulp.task('pug'));
    gulp.watch( 'resources/ejs/**/*.ejs', gulp.task('ejs'));
    gulp.watch( 'resources/script/**/*.js', gulp.task('babel'));
});
