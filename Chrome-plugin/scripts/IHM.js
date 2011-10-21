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
 * Object used to manage the webview (add rows ...)
 * @param win
 */
function IHM(win) {
    this.win = win;
}

/**
 * Private method used to create a select element bound to an input and vice versa with the element locators
 * @param locators - the different locators available
 * @param doc - the document object
 * @return a json object {select:the_select_object, input:the_input_object}
 */
IHM.prototype._getSelectors = function(locators, doc) {

    var select = doc.createElement("select");

    for (var i = 0; i < locators.length; i++) {
        var locator = locators[i];
        var option = doc.createElement("option");
        option.appendChild(doc.createTextNode(locator.type));
        option.setAttribute("value", locator.value);
        select.appendChild(option);
    }

    var input = doc.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("length", "25");

    input.addEventListener("blur", function() {
        var index = select.selectedIndex;
        select.options[index].setAttribute("value", input.value);
    }, true);

    select.addEventListener("change", function() {
        var index = select.selectedIndex;
        input.value = select.options[index].value;
    }, true);

    input.value = select.options[0].value;

    return {select:select, input:input};
}

/**
 * Used to add a new Select object to the testcase
 * @param newSelect - a Select object {@see Objects.js}
 */
IHM.prototype.newSelect = function(newSelect) {

    var doc = this.win.document;
    var commands = doc.getElementById("commands");
    var row = doc.createElement("div");

    var partOne = doc.createTextNode("Select " + newSelect.name + " = new Select(driver.findElement(By.");
    var partTwo = doc.createTextNode("(");
    var partThree = doc.createTextNode("));")

    var selectors = this._getSelectors(newSelect.locators, doc);

    var select = selectors.select;
    var input = selectors.input;

    Utils.appendChildren(row, [partOne, select, partTwo, input, partThree]);
    Utils.appendChildren(commands, [row, doc.createElement("br")]);
}

/**
 * Private method used to create a select action row
 * @param method - the method to call on the select object
 * @param finders - locators to find the option
 * @param row - the DOM element corresponding to the new row
 * @param doc - the document object
 */
IHM.prototype._createSelectAction = function(method, finders, row, doc) {
    var begin = doc.createTextNode(finders.selectName + "." + method);
    var parenth = doc.createTextNode("(");
    var end = doc.createTextNode(");");

    var selectors2 = this._getSelectors(finders.locators, doc);

    var selectOption = selectors2.select;
    var inputOption = selectors2.input;

    Utils.appendChildren(row, [begin, selectOption, parenth, inputOption, end]);
}

/**
 * Method used to add a select action row
 * @param method - the method to callon the select object
 * @param finders - locators to find the option
 */
IHM.prototype.addSelectAction = function(method, finders) {

    var doc = this.win.document;
    var commands = doc.getElementById("commands");
    var row = doc.createElement("div");

    this._createSelectAction(method, finders, row, doc);

    Utils.appendChildren(commands, [row, doc.createElement("br")]);
}

/**
 * Private method used to create a click action row
 * @param locators - locators of the object to be clicked
 * @param row - the new row
 * @param doc - the document object
 */
IHM.prototype._createClickAction = function(locators, row, doc) {

    var begin = doc.createTextNode("driver.findElement(By.");
    var parenth = doc.createTextNode("(");
    var end = doc.createTextNode(")).click();");

    var selectors = this._getSelectors(locators, doc);

    var select = selectors.select;
    var input = selectors.input;

    Utils.appendChildren(row, [begin, select, parenth, input, end]);
}

/**
 * private method used to create a new sendkeys action row
 * @param locators - locators of the object that should receive the keys
 * @param keys - the keys
 * @param row - the row
 * @param doc - the document
 */
IHM.prototype._craeteSendKeysAction = function(locators, keys, row, doc) {

    var begin = doc.createTextNode("driver.findElement(By.");
    var parenth = doc.createTextNode("(");
    var next = doc.createTextNode(")).sendKeys(");
    var end = doc.createTextNode(");");

    var selectors = this._getSelectors(locators, doc);

    var select = selectors.select;
    var input = selectors.input;

    var keysInput = doc.createElement("input");
    keysInput.setAttribute("type", "text");
    keysInput.setAttribute("length", "25");
    keysInput.setAttribute("value", keys);

    Utils.appendChildren(row, [begin, select, parenth, input, next, keysInput, end]);
}

/**
 * Add a new row for an action on a webElement
 * @param method - the applied on the webElement
 * @param finders - locators to find the webElement
 * @param params - parameters (can be empty)
 */
IHM.prototype.addWebElementAction = function(method, finders, params) {

    var doc = this.win.document;
    var commands = doc.getElementById("commands");
    var row = doc.createElement("div");

    switch (method) {

        case "click":
            this._createClickAction(finders.locators, row, doc);
            break;
        case "sendKeys":
            this._craeteSendKeysAction(finders.locators, params.keys, row, doc);
            break;
        default:
            break;
    }

    Utils.appendChildren(commands, [row, doc.createElement("br")]);
}