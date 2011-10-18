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



function Utils() {
}

/**
 * Retrieve all locators of a given DOM element
 * @param element - the DOM element
 */
Utils.getLocators = function(element) {

    var cssSelector = getCssLocator(element);
    var id = element.getAttribute("id") != undefined ? element.getAttribute("id") : null;
    var linkText = element.nodeName.toLowerCase() == "a" ? $(element).val() : null;
    var name = element.getAttribute("name") != undefined ? element.getAttribute("name") : null;
    var xpath = getXPathLocator(element);

    return  {cssSelector:cssSelector,id:id, linkText:linkText,name:name,xpath:xpath};
}

/**
 * Retrieve all locators for a given option element
 * @param element - the option element
 */
Utils.getOptionLocators = function(element) {
    return {index:element.index, value:element.value, visibleText:$(element).val()};
}


function getNodeNbr(current) {
    var childNodes = current.parentNode.childNodes;
    var total = 0;
    var index = -1;
    for (var i = 0; i < childNodes.length; i++) {
        var child = childNodes[i];
        if (child.nodeName == current.nodeName) {
            if (child == current) {
                index = total;
                break;
            }
            total++;
        }
    }
    return index;
}

function getCSSSubPath(e) {
    var css_attributes = ['id', 'name', 'class', 'type', 'alt', 'title', 'value'];
    for (var i = 0; i < css_attributes.length; i++) {
        var attr = css_attributes[i];
        var value = e.getAttribute(attr);
        if (value) {

            return attr == 'id' ?
                '#' + value
                : e.nodeName.toLowerCase() +
                (
                    attr == "class" ?
                        '.' + value.replace(" ", ".").replace("..", ".")
                        : '[' + attr + '="' + value + '"]'
                    );
        }
    }

    return e.nodeName.toLowerCase() + this.getNodeNbr(e) != -1 ? ':nth-of-type(' + this.getNodeNbr(e) + ')' : "";
}

function getCssLocator(e) {
    var current = e;
    var sub_path = getCSSSubPath(e);

    while ($(sub_path).get(0) != e && current.nodeName.toLowerCase() != 'html') {
        sub_path = getCSSSubPath(current.parentNode) + ' > ' + sub_path;
        current = current.parentNode;
    }
    return sub_path;
}

function getXPathLocator(e) {
    var xpath = '';
    while (e && e.nodeType == 1) {
        var index = $(e.parentNode).children(e.tagName).index(e) + 1;
        index > 1 ? (index = '[' + index + ']') : (index = '');
        xpath = '/' + e.tagName.toLowerCase() + index + xpath;
        e = e.parentNode;
    }
    return xpath;
}