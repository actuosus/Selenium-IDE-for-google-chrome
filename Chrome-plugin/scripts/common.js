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

var SeWin = {

    id:"SeWinID",
    initialized:false,
    win:null,
    testcase:new Array()
}


function createNewSelectRow(request) {
    var doc = SeWin.win.document;
    var commands = doc.getElementById("commands");
    var row = doc.createElement("div");

    var partOne = doc.createTextNode("var " + request.varname + " = new Select(driver.findElement(By.");
    var partTwo = doc.createTextNode(");");

    var select = doc.createElement("select");

    if (request.finders.locators.id != null) {
        var option = doc.createElement("option");
        option.appendChild(doc.createTextNode("id(" + request.finders.locators.id + ")"));
        select.appendChild(option);
    }

    if (request.finders.locators.name != null) {
        var option = doc.createElement("option");
        option.appendChild(doc.createTextNode("name(" + request.finders.locators.name + ")"));
        select.appendChild(option);
    }

    if (request.finders.locators.cssSelector != null) {
        var option = doc.createElement("option");
        option.appendChild(doc.createTextNode("cssSelector(" + request.finders.locators.cssSelector + ")"));
        select.appendChild(option);
    }

    if (request.finders.locators.xpath != null) {
        var option = doc.createElement("option");
        option.appendChild(doc.createTextNode("xpath(" + request.finders.locators.xpath + ")"));
        select.appendChild(option);
    }

    row.appendChild(partOne);
    row.appendChild(select);
    row.appendChild(partTwo);
    commands.appendChild(row);
    commands.appendChild(doc.createElement("br"));
}

//{type:"new", class:"Select", varname:"select" + recorder.knownSelects.length, finders:{locators:Utils.getLocators(currentSelect)}}
function addNew(request) {

    switch (request.classType) {

        case "Select":
            createNewSelectRow(request);
            break;
        default:
            break;
    }
}

function addAction(request) {


}

function addAssert(request) {


}

function addNewRow(request) {
    switch (request.type) {
        case "new":
            addNew(request);
            break;
        case "action":
            addAction(request);
            break;
        case "assert":
            addAssert(request);
            break;
        default:
            break;

    }
}


function start() {

    var features = "titlebar=no,menubar=no,location=no," +
        "resizable=yes,scrollbars=yes,status=no," +
        "height=600,width=400";

    SeWin.win = window.open("selenium-view.html", "SeWinID", features);


    if (!SeWin.initialized) {
        chrome.extension.onRequest.addListener(
            function(request, sender, sendResponse) {

                addNewRow(request);
                sendResponse({});
            });
        SeWin.initialized = true;
    }
}

function addCommand(aType, someLocators, value) {
    var doc = SeWin.win.document;
    var row = doc.createElement("div");
    SeWin.testcase.push({type:aType,locators:someLocators});

    var select = doc.createElement("select");
    var id = doc.createElement("option");
    id.setAttribute("value", "id: " + someLocators.id);
    id.appendChild(doc.createTextNode("id: " + someLocators.id));
    select.appendChild(id);
    var css = doc.createElement("option");
    css.setAttribute("value", "css: " + someLocators.css);
    css.appendChild(doc.createTextNode("css: " + someLocators.css));
    select.appendChild(css);
    var xpath = doc.createElement("option");
    xpath.setAttribute("value", "xpath: " + someLocators.xpath);
    xpath.appendChild(doc.createTextNode("xpath: " + someLocators.xpath));
    select.appendChild(xpath);
    var content = doc.createTextNode("type: " + aType + "   " + (value != undefined ? "value: " + value + "  " : ""));
    row.appendChild(content);
    row.appendChild(select);
    doc.getElementById("commands").appendChild(row);
    doc.getElementById("commands").appendChild(doc.createElement("br"));
}


function save() {

    SeWin.testcase = new array();

    while (SeWin.win.document.getElementById("commands").childNodes.length >= 1) {
        SeWin.win.document.getElementById("commands").removeChild(SeWin.win.document.getElementById("commands").firstChild);
    }
}