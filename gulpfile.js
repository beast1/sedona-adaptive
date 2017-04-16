var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cashe        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    less         = require('gulp-less'),
    htmlmin      = require('gulp-htmlmin');

gulp.task('less', function() {
  return gulp.src([
    'src/less/blocks/*.less',
    'src/less/global/*.less',
  ])
    .pipe(concat('main.less'))
    .pipe(less())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
  return gulp.src([
    'src/libs/jquery/dist/jquery.min.js',
    'src/libs/jquery-sticky/jquery.sticky.js',
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: false
  });
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('cleanCss', function() {
  return del.sync('src/less/**/*.css');
});

gulp.task('clear', function() {
  return cache.clearAll();
});

gulp.task('img', function() {
  return gulp.src('src/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'scripts', 'cleanCss'], function() {
  gulp.watch('src/less/**/*.less', ['less', 'cleanCss'], browserSync.reload);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'less', 'scripts'], function() {
  
  var buildCss = gulp.src([
      'src/css/main.css',
      'src/css/toast-grid.css',
    ])
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
  
  var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
  
  var buildJs = gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'));
  
  var buildHtml = gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
  
});