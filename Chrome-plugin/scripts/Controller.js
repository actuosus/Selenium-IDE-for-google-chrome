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


/**
 * Controller constructor
 * @param win - the Selenium IDE window
 */
function Controller(win) {
    this.win = win;
    this.ihm = new IHM(this.win);
    // this.model = new Model();
}

/**
 * Used to get the singleton
 * @param win - the Selenium IDE window
 * @return the controller
 */
Controller.getInstance = function(win) {
    if (Controller._instance == undefined) {
        Controller._instance = new Controller(win);
    }
    return Controller._instance;
}

/**
 * Add a row when a new object is created
 * @param request - json object
 * {type:"new", classType:"aClassName", varname:"the_variable_name", finders:{locators:Utils.getLocators(the DOM element)}}
 */
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

/**
 * Add an action row
 * @param request - json object
 * {type: "action", on:"WebElement | Select", method:"click | sendKeys", finders:{locators: Utils.getLocators(the DOM element)}, params:{}}
 */
Controller.prototype.addAction = function(request) {

    switch (request.on) {

        case "Select":
            this.ihm.addSelectAction(request.method, request.finders);
            break;
        case "WebElement":
            this.ihm.addWebElementAction(request.method, request.finders, request.params);
            break;
        default:
            break;
    }


}

/**
 * Add an action row
 * @param request - json object
 * {type: "assert", ...todo}
 */
Controller.prototype.addAssert = function(request) {


}

/**
 * Add a row to the current testcase
 * @param request - json object with needed information
 */
Controller.prototype.addRow = function(request) {
    switch (request.type) {
        case "new":
            this.addNew(request);
            break;
        case "action":
            this.addAction(request);
            break;
        case "assert":
            this.addAssert(request);
            break;
        default:
            break;
    }
}