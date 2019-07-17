const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
let cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
const del = require('del');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');

const cssFiles = [
  './src/less/style.less',
  './src/less/media.less'
]

const jsFiles = [
'./src/js/main.js',
'./src/js/script.js'
]

function styles() {
  return gulp.src(cssFiles)
  .pipe(sourcemaps.init())
  .pipe(less())
  .pipe(concat('style.css'))
  .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
  .pipe(cleanCSS({level : 2}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./build/css'))
  .pipe(browserSync.stream());
}


function scripts() {
  return gulp.src(jsFiles)
  .pipe(concat('scripts.js'))
  .pipe(uglify({
    toplevel : true
  }))
  .pipe(gulp.dest('./build/js'))
  .pipe(browserSync.stream());
}

function clean() {
  return del(['build/*'])
}

function watch() {
  browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/less/**/*.less', styles)
    gulp.watch('./src/js/**/*.js', scripts)
    gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts',scripts);
gulp.task('del',clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
gulp.task('dev', gulp.series('build', 'watch'));
