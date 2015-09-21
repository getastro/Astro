// Astro Framework - Wordpress verison
// Copyright 2015 Ting Yang and Hector Jarquin
// Released under the MIT license
// Last updated: Sept 20, 2015

// Support:
//  Wordpress.org, the official rest api endpoint
//  Jetpack plugin enable that support official endpoint
//
'use strict';

// @name: RootElement
// @param: The dom element that contain data-api-source
function RootElement(domBlock) {
    var root = domBlock;

    return {
        getSourceURL: function () {
            // root should expect
            if (root.dataset.wpSource.slice(-1) !== "/") {
                return root.dataset.wpSource + "/";
            } else {
                return root.dataset.wpSource;
            }
        },
        getChildElements: function () {
            return root.querySelectorAll("[data-wp-element]");
        },

        count: function () {
            return root.querySelectorAll("[data-wp-element]").length;
        }
    };
}

function WPElement(domEl) {
    var element, expectedType;
    expectedType = ["posts", "categories"];

    element = domEl;
    function getSearchCriteria (element) {
        var criteria, data, index;
        if (!element) {
            return;
        }
        criteria = {};
        data = element.dataset;
        index = data.wpElement.indexOf("/");
        if (index !== -1) {
            criteria.itemId = data.wpElement.slice(index + 1);
            criteria.type = data.wpElement.slice(0, index);
        } else {
            criteria.type = data.wpElement;
        }

        if (data.wpOptions) {
            criteria.options = data.wpOptions;
        }

        if (expectedType.indexOf(criteria.type) === -1) {
            console.error("data-wp-element only support posts");
            return null;
        }
        return criteria;
    }
    function processUrl (url) {
        if(url.slice(-1) !== "/") {
            return url + "/";
        } else {
            return url;
        }

    }
    return {
        requestUrl: function (sourceUrl) {
            var component = getSearchCriteria(element);
            if (component){
                var url = '';
                url += processUrl(sourceUrl);
                if (component.itemId) {
                    url += component.type + "/" + component.itemId + "/";
                    if (component.options) {
                        url+= "?" + component.options;
                    }
                } else {
                    url += component.type + "/";
                    if (component.options) {
                        url+= "?" + component.options;
                    }
                }
                return url;
            } else {
                return null;
            }
        },
        self: function () {
            return element;
        }
    };
}
var util = {
    ajax: function (url, callback) {
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                callback(null, JSON.parse(xmlhttp.responseText));
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    },
    test: function (){
        return 1;
    },
    insert: function (json, template) {
        for (var i = 0; i < template.length; i++) {
            if (template[i].tagName === "IMG") {
                template[i].setAttribute("src",json[template[i].dataset.wpTemplate]);
            }
            template[i].innerHTML = json[template[i].dataset.wpTemplate];
        }
    }
};

(function () {
    var parent, root, childrens, wpElements, baseUrl;

    parent = document.querySelector("[data-wp-source");
    root = RootElement(parent);
    childrens = root.getChildElements();
    wpElements = [];

    for (var i = 0; i < childrens.length; i++) {
        wpElements.push(WPElement(childrens[i]));
    }

    var baseUrl = root.getSourceURL();
    wpElements.forEach(function(el) {
        var template = el.self().querySelectorAll("[data-wp-template]");
        util.ajax(el.requestUrl(baseUrl), function(err, data) {
            util.insert(data, template);
        });
    });
}());
