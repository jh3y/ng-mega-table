var gulp = require('gulp'),
  coffee = require('gulp-coffee'),
  jade = require('gulp-jade'),
  less = require('gulp-less'),
  wrap = require('gulp-wrap'),
  rename = require('gulp-rename'),
  filter = require('gulp-filter'),
  order = require('gulp-order'),
  plumber = require('gulp-plumber'),
  connect = require('gulp-connect'),
  cssmin = require('gulp-cssmin'),
  templateCache = require('gulp-angular-templatecache'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  ngmin = require('gulp-ngmin'),
  sources = {
    coffee: [
      'src/coffee/services/ngMegaTableDemo.coffee',
      'src/coffee/services/**/*.coffee',
      'src/coffee/controllers/ngMegaTableDemo.coffee',
      'src/coffee/controllers/**/*.coffee',
      'src/coffee/app.coffee',
      'src/coffee/routes.coffee'
    ],
    ngMegaTable: {
      coffee: 'src/coffee/ngMegaTable/**/*.coffee',
      templates: 'src/jade/templates/ngMegaTable/**/*.jade',
      less: 'src/less/ngMegaTable/**/*.less'
    },
    vendor: {
      js: [
        'src/vendor/jquery/dist/jquery.js',
        'src/vendor/angular/angular.js',
        'src/vendor/angular-resource/angular-resource.js',
        'src/vendor/angular-route/angular-route.js',
        'src/vendor/handlebars/handlebars.js',
        'dist/ngMegaTable.min.js'
      ],
      css: [
        'src/vendor/bootstrap/dist/css/bootstrap.min.css',
        'dist/ngMegaTable.min.css'
      ]
    },
    overwatch: env + '**/*.*',
    docs: [
      'src/jade/documents/**/*.jade',
      'src/jade/layout-blocks/**/*.jade'
    ],
    templates: 'src/jade/templates/views/**/*.jade',
    less: [
      'src/less/**/*.less',
      '!src/less/ngMegaTable/**/*.less'
    ],
  },
  env = 'out/',
  destinations = {
    build: '',
    ngMegaTable: {
      js: 'dist/',
      templates: 'tmp/ngMegaTable/',
      css: 'dist/'
    },
    html: env,
    css: env + 'css/',
    js: env + 'js/',
    templates: 'tmp/'
  };

gulp.task('reload', function(event) {
	return gulp.src(sources.overwatch)
		.pipe(connect.reload());
});
gulp.task('serve', ['build'], function(event) {
	connect.server({
		root: destinations.html,
		port: 1987,
		livereload: true
	});
	// sets up a livereload that watches for any changes in the root
	gulp.watch(sources.overwatch, ['reload']);
});



gulp.task('less:compile', function(event) {
  return gulp.src(sources.less)
    .pipe(concat('style.css'))
    .pipe(less())
    .pipe(gulp.dest(destinations.css))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(destinations.css));
});
gulp.task('less:watch', function(event) {
  gulp.watch(sources.less, ['less:compile']);
});



gulp.task('ngMegaTable:less:compile', function(event) {
  return gulp.src(sources.ngMegaTable.less)
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest(destinations.ngMegaTable.css))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(destinations.ngMegaTable.css));
});
gulp.task('ngMegaTable:less:watch', function(event) {
  gulp.watch(sources.ngMegaTable.less, ['ngMegaTable:less:compile']);
});


gulp.task('vendor:scripts:publish', function(event) {
  return gulp.src(sources.vendor.js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(destinations.js))
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(destinations.js));
});
gulp.task('vendor:styles:publish', function(event) {
  return gulp.src(sources.vendor.css)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(destinations.css))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(destinations.css));
});
gulp.task('vendor:publish', ['vendor:scripts:publish', 'vendor:styles:publish']);




gulp.task('jade:compile', function(event) {
  return gulp.src('src/jade/documents/*.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest(destinations.html));
});
gulp.task('jade:watch', function(event) {
  gulp.watch(sources.docs, ['jade:compile']);
});





gulp.task('coffee:compile', ['templates:compile'], function(event) {
  var coffeeFilter = filter('**/*.coffee');
  return gulp.src(sources.coffee.concat([destinations.templates + '/*.*']))
    .pipe(plumber())
    .pipe(coffeeFilter)
    .pipe(concat('app.coffee'))
    .pipe(coffee({
      bare: true
    }))
    .pipe(coffeeFilter.restore())
    .pipe(order([
      '**/app.js',
      '**/templates.js'
    ]))
    .pipe(concat('app.js'))
    .pipe(wrap('(function(){<%= contents %>}());'))
    .pipe(gulp.dest(destinations.js))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(ngmin())
    .pipe(uglify())
    .pipe(gulp.dest(destinations.js));
});

gulp.task('coffee:watch', function(event) {
  gulp.watch(sources.coffee, ['coffee:compile']);
});

gulp.task('ngMegaTable:coffee:compile', ['ngMegaTable:templates:compile'], function(event) {
  var coffeeFilter = filter('**/*.coffee');
  return gulp.src([
    sources.ngMegaTable.coffee,
    destinations.ngMegaTable.templates + '**/*.*'
  ])
  .pipe(plumber())
  .pipe(coffeeFilter)
  .pipe(concat('ngMegaTable.coffee'))
  .pipe(coffee({
    bare: true
  }))
  .pipe(coffeeFilter.restore())
  .pipe(order([
    '**/ngMegaTable.coffee',
    '**/ngMegaTable/ngMegaTableTemplates.js'
  ]))
  .pipe(concat('ngMegaTable.js'))
  .pipe(wrap('(function(){<%= contents %>}());'))
  .pipe(gulp.dest(destinations.ngMegaTable.js))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(ngmin())
  .pipe(uglify())
  .pipe(gulp.dest(destinations.ngMegaTable.js));
});

gulp.task('ngMegaTable:coffee:watch', function(event) {
  gulp.watch(sources.ngMegaTable.coffee, ['ngMegaTable:coffee:compile']);
});


gulp.task('ngMegaTable:templates:compile', function(event) {
  return gulp.src(sources.ngMegaTable.templates)
    .pipe(jade())
    .pipe(templateCache('ngMegaTableTemplates.js', {
      module: 'ngMegaTable'
    }))
    .pipe(gulp.dest(destinations.ngMegaTable.templates));
});
gulp.task('ngMegaTable:templates:watch', function(event) {
  gulp.watch([sources.ngMegaTable.templates], ['ngMegaTable:coffee:compile']);
});



gulp.task('templates:compile', function(event) {
  return gulp.src([sources.templates])
    .pipe(jade())
    .pipe(templateCache({
      module: 'ngMegaTableDemo'
    }))
    .pipe(gulp.dest(destinations.templates));
});
gulp.task('templates:watch', function(event) {
  gulp.watch([sources.templates], ['coffee:compile']);
});


gulp.task('clean:output', function(event) {
  return gulp.src(env)
    .pipe(clean());
});


gulp.task('ngMegaTable:dist:watch', function(event) {
  gulp.watch('dist/**/*.*', ['vendor:publish']);
});


gulp.task('build', [
  'coffee:compile',
  'less:compile',
  'jade:compile',
  'ngMegaTable:dist'
]);

gulp.task('ngMegaTable:dist', [
  'ngMegaTable:less:compile',
  'ngMegaTable:coffee:compile'
]);

gulp.task('default', [
  'build',
  'coffee:watch',
  'templates:watch',
  'jade:watch',
  'less:watch',
  'ngMegaTable:less:watch',
  'ngMegaTable:templates:watch',
  'ngMegaTable:coffee:watch',
  'ngMegaTable:dist:watch',
  'serve'
]);
