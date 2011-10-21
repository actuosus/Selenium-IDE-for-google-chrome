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
 * Object used to record action on the webapp
 */
function Recorder() {

    this.knownSelects = new Array();
    this.knownSelectsName = new Array();
}

/**
 * Used to add click listener on clickable objects
 */
Recorder.prototype.addClickListeners = function () {

    var clickables = Options.getClickables();

    $.each(clickables, function(index, value) {
        $(value).each(function(index) {
            $(this).bind('click', function() {
                chrome.extension.sendRequest({type: "action", on:"WebElement", method:"click", finders:{locators: Utils.getLocators(this)}, params:{}}, function(response) {
                });
            })
        });
    });
}

/**
 * Used to add input listener on seizable objects
 */
Recorder.prototype.addInputListeners = function () {

    var inputables = Options.getInputables();

    $.each(inputables, function(index, value) {
        $(value).each(function(index) {
            $(this).bind('change', function() {
                chrome.extension.sendRequest({type: "action", on: "WebElement", method:"sendKeys", finders:{locators: Utils.getLocators(this)}, params:{keys:"" + $(this).val() }}, function(response) {
                });
            })
        });
    });
}

/**
 * Used to add select listener on single and multiple select objects
 */
Recorder.prototype.addSelectListeners = function () {

    $("select:[multiple]").each(function(index) {
        $(this).bind('focus', function() {
            $(this).find("option").each(function() {
                if (this._wasSelected == null) {
                    this._wasSelected = this.selected;
                }
            });
        });
    });

    $("select:[multiple]").find("option").each(function(index) {
        $(this).bind('mousedown', function() {
            this._wasSelected = this.selected;
        });
    });

    $("select:[multiple]").each(function(index) {
        $(this).bind('change', function() {
            var currentSelect = this;
            $(this).find("option").each(function() {
                if (this.selected != this._wasSelected) {
                    var index = $.inArray(currentSelect, recorder.knownSelects);
                    if (index == -1) {
                        recorder.knownSelects.push(currentSelect);
                        recorder.knownSelectsName.push("select" + recorder.knownSelects.length);
                        chrome.extension.sendRequest({type:"new", classType:"Select", varname:"select" + recorder.knownSelects.length, finders:{locators:Utils.getLocators(currentSelect)}}, function(response) {
                        });
                    }
                    index = $.inArray(currentSelect, recorder.knownSelects);
                    chrome.extension.sendRequest({type:"action", on:"Select", method: this.selected ? "selectBy" : "deselectBy", finders:{selectName:recorder.knownSelectsName[index],locators: Utils.getOptionLocators(this)}, params:{}}, function(response) {
                    });
                    this._wasSelected = this.selected;
                }
            });
        });
    });

    $("select:not([multiple])").each(function(index) {
        $(this).bind('change', function() {
            var currentSelect = this;
            $(this).find("option:selected").each(function() {
                var index = $.inArray(currentSelect, recorder.knownSelects);
                if (index == -1) {
                        recorder.knownSelects.push(currentSelect);
                        recorder.knownSelectsName.push("select" + recorder.knownSelects.length);
                        chrome.extension.sendRequest({type:"new", classType:"Select", varname:"select" + recorder.knownSelects.length, finders:{locators:Utils.getLocators(currentSelect)}}, function(response) {
                        });
                    }
                index = $.inArray(currentSelect, recorder.knownSelects);
                chrome.extension.sendRequest({type: "action", on:"Select", method: "selectBy", finders:{selectName:recorder.knownSelectsName[index],locators: Utils.getOptionLocators(this)}, params:{} }, function(response) {
                });
            });
        });

    });
}



