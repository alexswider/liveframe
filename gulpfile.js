var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    headerfooter = require('gulp-headerfooter'),
    lr = require('tiny-lr'),
    server = lr();

// Server - listed on localhost:8080
gulp.task('webserver', function() {
  connect.server({
    root: 'dist'
  });
});

gulp.task('styles', function() {
  return gulp.src('src/scss/styles.scss')
      .pipe(sass({ style: 'expanded' }).on('error', function (err) {
        return notify().write(err);
      }))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ios 6', 'android 4'))
      .pipe(gulp.dest('dist/css'))
      .pipe(notify({ message: 'Styles task complete' }))
      .pipe(livereload());
});

gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
      .pipe(gulp.dest('dist/js'))
      //.pipe(uglify())
      .pipe(livereload());

});

gulp.task('lib', function() {
  return gulp.src('src/js/lib/**/*')
      .pipe(gulp.dest('dist/js/lib'));
});

gulp.task('assets', function() {
  return gulp.src('src/assets/**/*')
      .pipe(gulp.dest('dist/assets'));
});

// Images
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
      .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
      .pipe(gulp.dest('dist/img'))
      .pipe(livereload())
      .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('html', function() {
  return gulp.src('src/templates/**/*')
     // .pipe(headerfooter.header('src/templates/header.html'))
     // .pipe(headerfooter.footer('src/templates/footer.html'))
      .pipe(gulp.dest('dist/'))
      .pipe(livereload())
      .pipe(notify({ message: 'Html task complete' }));
})

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/img/**/*', ['images']);

  //gulp.watch('src/img/**/*', ['assets']);

  // Watch html files
  //gulp.watch('src/templates/**/*', ['html']);
  gulp.watch('src/templates/**/*', ['html']);

  // Create LiveReload server
  livereload.listen();

});

gulp.task('default', ['webserver', 'styles', 'scripts', 'images', 'html', 'lib', 'watch', 'assets']);