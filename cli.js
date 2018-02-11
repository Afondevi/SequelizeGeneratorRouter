#!/usr/bin/env node

/**
 * SEQUELIZE GENERATOR ROUTER
 */

'use strict';

exports.SequelizeGeneratorRouter = function() {

  let inquirer = require('inquirer');
  let fs = require('fs');
  let mkdirp = require('mkdirp');
  const modelsFolder = './models/';

  String.prototype.capitalize = function () {
    return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
      return p1 + p2.toUpperCase();
    });
  };

  fs.readdir(modelsFolder, (err, files) => {
    let filesName = [];
    files.forEach(function (file) {
      filesName.push(file.replace(/.js/g, ""));
    });

    let questions = [
      {
        type: 'list',
        name: 'router',
        message: 'Which sequelize route whould you like to generate ? :',
        choices: filesName
      }
    ];

    inquirer.prompt(questions).then(answers => {

      let routerName = answers.router;
      fs.readFile('./models/' + routerName + '.js', "utf8", function (err, fileData) {
        if (err) {
          console.log("\n  The model named " + routerName + ".js doesn't exist !");
        }

        let postData = getPostData(routerName, fileData);

        let routerNameObject = prepareRouteNameObject(routerName, postData);

        fs.readFile('baseRouter.js', "utf8", function (baseErr, baseFileData) {
          for (let key in routerNameObject) {
            let stringToReplace = "{{routeName." + key + "}}";
            baseFileData = baseFileData.replace(new RegExp(stringToReplace, 'g'), routerNameObject[key]);
          }

          mkdirp('./router', function (err) {
            fs.readFile('./router/' + routerName + '.js', "utf8", function (fileError, fileExist) {
              if (fileError) {
                fs.appendFile('./router/' + routerName + '.js', baseFileData, function (err) {
                  if (err) console.log("\n  error, try again...\n", err);
                  console.log("\n  The route " + routerName + '.js was create with success :)');
                });
              } else {

                console.log("\n  " + routerName + ".js was selected !\n");

                let exist = [
                  {
                    type: 'list',
                    name: 'exist',
                    message: 'Route named ' + routerName + ' already exist.\n  Do you want to erase and generate it again ? (DANGER):',
                    choices: [
                      "yes",
                      "no"
                    ]
                  }
                ];

                inquirer.prompt(exist).then(answers => {
                  let isExist = answers.exist;
                  if (isExist === "yes") {
                    fs.appendFile('./router/' + routerName + '.js', baseFileData, function (err) {
                      if (err) console.log("\n  error, try again...\n", err);
                      console.log("\n  The route " + routerName + '.js was create with success :)');
                    });
                  } else {
                    console.log("\n  Ok, it's maybe a good choice ;)");
                  }

                });
              }
            });

          });
        });
      });

    });

  });

};

function getPostData(routerName, fileData){

  let beginString = "sequelize.define('"+routerName.capitalize()+"', {",
      String = fileData.substring(fileData.lastIndexOf(beginString) + beginString.length + 1 , fileData.lastIndexOf("}, {")),
      arrayOfItem = String.match(/\S+(?=:)/g),
      postItems = '',
      arrayLength = arrayOfItem.length;

  for(let i = 0; i < arrayLength; i++){
    postItems += arrayOfItem[i]+": req.body."+arrayOfItem[i];
    if(i !== arrayLength - 1){
      postItems += ",\n\t\t\t";
    }
  }
  return postItems;
}

function prepareRouteNameObject(routerName, postData){
  let singular = routerName;

  let lastChar = routerName.substr(routerName.length - 1);
  if(lastChar === 's'){
    singular = routerName.substring(0, routerName.length - 1);
  }

  return {
    singular: singular,
    singularCap: singular.capitalize(),
    singularUp: singular.toUpperCase(),
    plurial: routerName,
    plurialCap: routerName.capitalize(),
    plurialUp: routerName.toUpperCase(),
    postData: postData
  }
}
