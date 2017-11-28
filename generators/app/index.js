'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const path = require('path');

function toCamelCase(string) {
  if (string.indexOf('-') < 0 && string.indexOf('_') < 0) {
    return string;
  }
  return string.replace(/[-_][^-_]/g, function (match) {
    return match.charAt(1).toUpperCase();
  });
}

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the swell ' + chalk.red('generator-luobata-code') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'Please input project name (luobata_app):',
      default: 'luobata_app'
    },
    {
      type: 'input',
      name: 'projectDesc',
      message: 'Please input project description:'
    },
    {
      type: 'confirm',
      name: 'someAnswer',
      message: 'Would you like to enable this option?',
      default: true
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }
  defaults() {
    if (path.basename(this.destinationPath()) !== this.props.projectName) {
      this.log(
        'Your generator must be inside a folder named ' + this.props.projectName + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.projectName);
      this.destinationRoot(this.destinationPath(this.props.projectName));
    }
  }

  writing() {
    const pkg = this.fs.readJSON(this.templatePath('package_tpl.json'), {});
    pkg.name = this.props.projectName;
    pkg.description = this.props.projectDesc;
    pkg.repository.url = 'git+https://github.com/Luobata/' + this.props.projectName + '.git';
    pkg.bugs.url = 'https://github.com/Luobata/' + this.props.projectName + '/issues';
    pkg.homepage = 'https://github.com/Luobata/' + this.props.projectName + '#readme';
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    mkdirp('build');
    mkdirp('dist');
    mkdirp('src');
    mkdirp('assets');
    this.fs.copy(
      this.templatePath('gitignore_tpl'),
      this.destinationPath('.gitignore')
    );
    this.fs.copy(
      this.templatePath('babelrc_tpl'),
      this.destinationPath('.babelrc')
    );
    this.fs.copy(
      this.templatePath('tern-project_tpl'),
      this.destinationPath('.tern-project')
    );
    this.fs.copy(
      this.templatePath('eslint_tpl'),
      this.destinationPath('.eslintrc')
    );
    this.fs.copy(
      this.templatePath('index.js'),
      'src/index.js'
    );
    // This.fs.copy(
    //   this.templatePath('rollup.config.js'),
    //   'build/rollup.config.js'
    // );
    var readmeTpl = _.template(this.fs.read(this.templatePath('rollup.config.js')));
    this.fs.write(this.destinationPath('build/rollup.config.js'), readmeTpl({
      projectName: toCamelCase(this.props.projectName)
    }));
  }

  install() {
    this.installDependencies();
  }
};
