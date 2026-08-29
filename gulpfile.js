// NPM FileSystem
const fs = require('fs');

// Gulp
const gulp = require('gulp');

// To render Static HTML Pages
const nunjucksRender = require('gulp-nunjucks-render');

// To add data to Static HTML Pages
const data = require('gulp-data');

// Read values from exampledata.json
const exampledata = JSON.parse(fs.readFileSync('contentdata.json', {encoding: 'utf8'}));

//Render HTML Pages
gulp.task('render', function() {

    // Gets .html and files in pages
    return gulp.src('pages/**/*.+(html)')

    // Add exampledata to Static HTML Pages
    .pipe(data(function(file) {
        return exampledata;
    }))

    // Render Static HTML Pages with Template
    .pipe(nunjucksRender({
        path: ['templates']
    }))

    // Output Static HTML files in "out" folder
    .pipe(gulp.dest('./'))
});

