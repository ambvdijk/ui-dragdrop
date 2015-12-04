var gulp = require('gulp');

var del = require('del');
var ts = require('gulp-typescript');
var jshint = require('gulp-jshint');
var wrap = require('gulp-wrap');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var serve = require('gulp-serve');

var minimist = require('minimist');

var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'local' }
};

var options = minimist(process.argv.slice(2), knownOptions);

var paths = {
	clean: './dist',
	scripts: {
		source: './dist/.tmp/js/src/**/*.js',
		dest: './dist/serve/js/'
	},
	typescript: {
		config: './tsconfig.js',
		source: './src/*.ts',
		dest: './dist/.tmp/js' 
	},
	libraries: {
		source: './libs/**/*',
		dest: './dist/serve/libs/'
	},
	tests: {
		source: './tests/spec/**/*.js'
	}
};

gulp.task('typescript', compileTypeScript);
gulp.task('scripts', scriptsTask);
gulp.task('serve', serve({
	root: paths.wwwroot,
	port: 3001
}));	

gulp.task('clean', function () {
  return del([paths.clean]);
});

gulp.task('copy:libs', copyLibraries);
gulp.task('copy:all', gulp.parallel('copy:libs'));

gulp.task('watch:typescript', function () {
	gulp.watch(paths.typescript.source, gulp.series('typescript','scripts'/*, 'karma'*/));
});

gulp.task('watch', gulp.parallel('watch:typescript' /*, 'watch:tests'*/));

gulp.task('build', gulp
	.series(
		'clean',
		'typescript',
		'scripts',
		'copy:all'
	)
);

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));

function compileTypeScript() {
	var tsProject = ts.createProject('tsconfig.json');
	var tsResult = tsProject.src() // instead of gulp.src(...) 
        .pipe(ts(tsProject));
	return tsResult.js.pipe(gulp.dest(paths.typescript.dest));
}

function copyLibraries() {
	return gulp
		.src(paths.libraries.source)
		.pipe(gulp.dest(paths.libraries.dest));
}

function scriptsTask() {

	return gulp.src(paths.scripts.source)
		.pipe(jshint({sub:true}))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(concat('app.js'))
		.pipe(wrap('(function(angular){"use strict";\n<%= contents %>\n})(angular);'))
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.dest));
}