/**
 * Created by whj on 2016/5/3.
 */


var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var rename = require('gulp-rename');
var miniCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imageMin = require('gulp-imagemin');
var spriteSmith = require('gulp.spritesmith');
var browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
var reload = browserSync.reload;

var __PROD__ = process.env.NODE_ENV == 'production';
var __DEV__ = !__PROD__;

var my_dirname = __dirname+'/build';
// handle sass
gulp.task('sass', function () {
    var cssDir = path.resolve(my_dirname, 'css');
    var r = sass('./src/stylesheets/shop.scss', {compass: true})
        .pipe(rename('bundles.css'));
        r = r.pipe(miniCss())
    return r.pipe(gulp.dest(cssDir))
        .pipe(reload({stream: true}));
});


//handle spritesmith
gulp.task('sprites', function () {
    gulp.src('./src/sprites/*')
        .pipe(spriteSmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            padding: 5
        }))
        .pipe(gulp.dest('./sprites'));
});

//handle image
gulp.task('images', function () {
    var imageDir = path.resolve(my_dirname, 'images');
    gulp.src('./src/images/*')
        .pipe(imageMin())
        .pipe(gulp.dest(imageDir));
});


gulp.task('basejs', function () {
    var jsDir = path.resolve(my_dirname, 'javascripts')
    return gulp.src('./src/javascripts/plugins/*/*.js')
        .pipe(concat('base.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDir));
});

gulp.task('basecss',function(){
    var cssDir = path.resolve(my_dirname,'css')
    gulp.src('./src/javascripts/plugins/*/*.css')
        .pipe(concat('base.css'))
        .pipe(miniCss())
        .pipe(gulp.dest(cssDir))
})

gulp.task('vendorjs', function () {
    var jsDir = path.resolve(my_dirname, 'javascripts');
    return gulp.src('./src/javascripts/vendors/*.js')
        .pipe(babel({
            presets: ["react", "es2015"],
        }))
        .pipe(gulp.dest(jsDir));
});

gulp.task('default', function () {
    browserSync.init({
        server: "./build",
        port:3049,
        ui:{
            port:3050
        }
    });
    gulp.start('basejs', 'basecss','vendorjs', 'sass', 'sprites', 'images', 'watch');
});


//listening
gulp.task('watch', function () {
    gulp.watch('./src/sprites/*', ['sprites']);
    gulp.watch('./src/images/*', ['images']);
    gulp.watch(['./src/stylesheets/*', './src/stylesheets/*/*', './src/stylesheets/*/*/*'], ['sass']);
    gulp.watch('./build/*.html').on('change', reload);
    gulp.watch('./src/javascripts/plugins/*/*.js', ['basejs']);
    gulp.watch('./src/javascripts/vendors/*.js', ['vendorjs']);
    gulp.watch('./src/javascripts/plugins/*/*.css', ['basecss']);
});