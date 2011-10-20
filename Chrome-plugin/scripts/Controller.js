/**
 *    Licensed to the Apache Software Foundation (ASF) under one
 *    or more contributor license agreements.  See the NOTICE file
 *    distributed with this work for additional information
 *    regarding copyright ownership.  The ASF licenses this file
 *    to you under the Apache License, Version 2.0 (the
 *    "License"); you may not use this file except in compliance
 *    with the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing,
 *    software distributed under the License is distributed on an
 *    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *    KIND, either express or implied.  See the License for the
 *    specific language governing permissions and limitations
 *    under the License.
 *
 *    @author Jeremy Herault (jeremy.herault AT gmail.com)
 */

 var count = 0;
/**
 * Controller constructor
 * @param win - the Selenium IDE window
 */
function Controller(win) {
    this.win = win;
    this.ihm = new IHM(this.win);
   // this.model = new Model();
    count+=1;
}

Controller.getInstance = function(win){
    if (Controller._instance == undefined){
        Controller._instance = new Controller(win);
    }
    return Controller._instance;
}

Controller.prototype.addNew = function(request) {

    switch (request.classType) {

        case "Select":
            var newSelect = new Select(request);
            this.ihm.newSelect(newSelect);
            break;
        default:
            break;
    }
}

Controller.prototype.addAction = function(request) {

    switch(request.on){

        case "Select": this.ihm.addSelectAction(request.method, request.finders);break;
        case "WebElement": break;
        default:break;
    }


}

Controller.prototype.addAssert = function(request) {


}

/**
 * Function called to add a row for a given testcase
 * @param jsonRow - the row to add
 */
Controller.prototype.addRow = function(request) {
    switch (request.type) {
        case "new": this.addNew(request);
            break;
        case "action":this.addAction(request);
            break;
        case "assert":this.addAssert(request);
            break;
        default:
            break;
    }
}