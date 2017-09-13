'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-luobata-code:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({projectName: 'luobata', projectDesc: 'test', someAnswer: true});
  });

  it('creates files', () => {
    assert.file([
      '.babelrc',
      '.gitignore',
      '.tern-project',
      'package.json',
      'src/index.js',
      'dist',
      'assets',
      'build',
      'src',
      'build/rollup.config.js'
    ]);
  });
});
