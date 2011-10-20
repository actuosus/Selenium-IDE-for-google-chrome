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


function IHM(win) {
    this.win = win;
}

IHM.prototype.newSelect = function(newSelect) {

    var doc = this.win.document;
    var commands = doc.getElementById("commands");
    var row = doc.createElement("div");

    var partOne = doc.createTextNode("var " + newSelect.name + " = new Select(driver.findElement(By.");
    var partTwo = doc.createTextNode("(");
    var partThree = doc.createTextNode("));")

    var select = doc.createElement("select");

    for (var i = 0; i < newSelect.locators.length; i++) {
        var locator = newSelect.locators[i];
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

    row.appendChild(partOne);
    row.appendChild(select);
    row.appendChild(partTwo);
    row.appendChild(input);
    row.appendChild(partThree);
    commands.appendChild(row);
    commands.appendChild(doc.createElement("br"));
}


IHM.prototype._addSelectSingleAction = function(finders, row, doc) {

    var begin = doc.createTextNode("driver.findElement(By."); //locator pour select
    var parenth = doc.createTextNode("(");
    var parenth2 = doc.createTextNode("(");
    var next = doc.createTextNode(")).findElement(By.");//locator pour option
    var end = doc.createTextNode(")).click();");

    var selectSel = doc.createElement("select");

    for (var i = 0; i < finders.selectLocators.length; i++) {
        var locator = finders.selectLocators[i];
        var option = doc.createElement("option");
        option.appendChild(doc.createTextNode(locator.type));
        option.setAttribute("value", locator.value);
        selectSel.appendChild(option);
    }

    var inputSelect = doc.createElement("input");
    inputSelect.setAttribute("type", "text");
    inputSelect.setAttribute("length", "25");

    inputSelect.addEventListener("blur", function() {
        var index = selectSel.selectedIndex;
        selectSel.options[index].setAttribute("value", inputSelect.value);
    }, true);

    selectSel.addEventListener("change", function() {
        var index = selectSel.selectedIndex;
        inputSelect.value = selectSel.options[index].value;
    }, true);

    inputSelect.value = selectSel.options[0].value;

    var selectOption = doc.createElement("select");

    for (var i = 0; i < finders.locators.length; i++) {
        var locator = finders.locators[i];
        var option = doc.createElement("option");
        option.appendChild(doc.createTextNode(locator.type));
        option.setAttribute("value", locator.value);
        selectOption.appendChild(option);
    }

    var inputOption = doc.createElement("input");
    inputOption.setAttribute("type", "text");
    inputOption.setAttribute("length", "25");

    inputOption.addEventListener("blur", function() {
        var index = selectOption.selectedIndex;
        selectOption.options[index].setAttribute("value", inputOption.value);
    }, true);

    selectOption.addEventListener("change", function() {
        var index = selectOption.selectedIndex;
        inputOption.value = selectOption.options[index].value;
    }, true);

    inputOption.value = selectOption.options[0].value;

    row.appendChild(begin);
    row.appendChild(selectSel);
    row.appendChild(parenth);
    row.appendChild(inputSelect);
    row.appendChild(next);
    row.appendChild(selectOption);
    row.appendChild(parenth2);
    row.appendChild(inputOption);
    row.appendChild(end);
}

IHM.prototype._addSelectMultipleAction = function(method, finders, row, doc){

    var begin = doc.createTextNode(finders.selectName + "." + method);
    var parenth = doc.createTextNode("(");
    var end = doc.createtextNode(");");

    var selectOption = doc.createElement("select");

    for (var i = 0; i < finders.locators.length; i++) {
        var locator = finders.locators[i];
        var option = doc.createElement("option");
        option.appendChild(doc.createTextNode(locator.type));
        option.setAttribute("value", locator.value);
        selectOption.appendChild(option);
    }

    var inputOption = doc.createElement("input");
    inputOption.setAttribute("type", "text");
    inputOption.setAttribute("length", "25");

    inputOption.addEventListener("blur", function() {
        var index = selectOption.selectedIndex;
        selectOption.options[index].setAttribute("value", inputOption.value);
    }, true);

    selectOption.addEventListener("change", function() {
        var index = selectOption.selectedIndex;
        inputOption.value = selectOption.options[index].value;
    }, true);

    inputOption.value = selectOption.options[0].value;

    row.appendChild(begin);

}

IHM.prototype.addSelectAction = function(method, finders) {

    var doc = this.win.document;
    var commands = doc.getElementById("commands");
    var row = doc.createElement("div");

    if (method == "click") {
        this._addSelectSingleAction(finders, row, doc);
    } else {
        //selectBy, deselectBy
        this._addSelectMultipleAction(method, finders, row, doc);
    }

    commands.appendChild(row);
    commands.appendChild(doc.createElement("br"));
}