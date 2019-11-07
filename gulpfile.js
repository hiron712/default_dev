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

gulp.task('scss', function(){
    //ここからタスクの内容
    return gulp.src('htdocs/sass/*.scss')
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
    return gulp.src(['htdocs/stylus/**/*.styl','!htdocs/stylus/**/_*.styl'])
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


gulp.task('babel', function() {
    return gulp.src('htdocs/script/**/*.js')
        .pipe(plumber())
        .pipe(concat('script.js'))
        .pipe(babel({
            "presets":["@babel/preset-env"] ,
            "plugins":["@babel/plugin-transform-modules-commonjs"]
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('htdocs/js'));

});


gulp.task('babel2', function() {
    return browserify('./htdocs/script/app.js')
        .transform(babelify, {presets: ['@babel/preset-env']})
        .bundle()
        .pipe(source('script.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./htdocs/js'));

    /*return gulp.src('htdocs/script//*.js')
        .pipe(plumber())
        .pipe(concat('script.js'))
        .pipe(babel({
            "presets":["@babel/preset-env"] ,
            "plugins":["@babel/plugin-transform-modules-commonjs"]
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('htdocs/js'));*/

    //gulp.task('imageedit', function(){
    //    var testFiles = glob.sync(jspath + '/imageedit/**/*.js');
    //    return browserify({
    //        entries: testFiles
    //    })
    //        .transform(babelify, {presets: ['@babel/preset-env']})
    //        .bundle()
    //        .pipe(source('staf.imageedit.min.js'))
    //        .pipe(buffer())
    //        .pipe(uglify())
    //        .pipe(plumber())
    //        .pipe(gulp.dest(outpath + '/js'));
    //});

});


gulp.task('pug', function () {
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
