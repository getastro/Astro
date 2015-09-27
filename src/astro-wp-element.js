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
    var url, root;
    var root = domBlock;
    url = root.dataset.wpSource;
    function validateSource (url) {
        return (url.search(/wordpress/) != -1);
    } 
    return {
        getSourceURL: function () {
            // root should expect
            if (root.dataset.wpSource.slice(-1) !== "/") {
                return root.dataset.wpSource + "/";
            } else {
                return root.dataset.wpSource;
            }
        },
        findWPElements: function () {
            return root.querySelectorAll("[data-wp-element]");
        },
        findWPCollections: function () {
            return root.querySelectorAll("[data-wp-collection]");
        },

        countElements: function () {
            return root.querySelectorAll("[data-wp-element]").length;
        },

        countCollections: function () {
            return root.querySelectorAll("[data-wp-collection]").length;
        }

    };
}

function WPCollections (domEl) {
    var element, expectedType;
    expectedType = ["posts", "categories"];

    element = domEl;

    function getSearchCriteria(element) {
        var criteria, data;
        criteria = {};
        if(!element) {
            return;
        }
        // get the dataset
        data = element.dataset;
        if (data.wpCollection) {
            criteria.type = data.wpCollection;
        }
        if (data.wpOptions) {
            criteria.option = data.wpOptions;   
        }
        if (expectedType.indexOf(criteria.type) === -1) {
            console.error("data-wp-element only support posts and category");
            return null;
        }
        return criteria;
    }


    return {
        requestUrl: function (sourceUrl) {
            // build the request url
            var component = getSearchCriteria(element);          
            var url;
            if (component.hasOwnProperty("type")) {
                url = "";
                url += sourceUrl + component.type + "/";
                if (component.hasOwnProperty("option")) {
                    url += "?" + component.option;
                } else {
                    // do not do anything when no option
                }
            } else {
                // this may not happen if no type
            }
            return url;    
        },
        self: function () {
            return element;
        },
        template: function () {
            return element.querySelector("[data-wp-layout]");
        }
    }
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
    insertContent: function (json, template) {
        for (var i = 0; i < template.length; i++) {
            if (template[i].tagName === "IMG") {
                template[i].setAttribute("src",json[template[i].dataset.wpTemplate]);
            }
            if (template[i].tagName === "A") {
                template[i].setAttribute("href",json[template[i].dataset.wpTemplate]);
            } else {
            template[i].innerHTML = json[template[i].dataset.wpTemplate];
            }
        }
    },
    insertCollections: function (json, layout) {
        // how to define the collection
        //
        console.log(json);
        console.log(layout); 
        var list = layout.querySelector("li");
        json.posts.forEach(function (post, index) {
            if (index == 0) {
                // this not need to clone
                console.log("not need to clone");
                console.log(layout.querySelector("[data-wp-template]"));
                util.insertContent(post, layout.querySelectorAll("[data-wp-template]")); 
            } else {// this need to clone 
                var virtual = list.cloneNode(true);
                util.insertContent(post, virtual.querySelectorAll("[data-wp-template]")); 
                layout.appendChild(virtual);
            }
        });
    },
    insertError: function (json, template) {
        // TODO:
        // insert error message into the dom,
        // it helps developer to know what went wrong
        //
        // <img data-wp-template><span>Astro-ERROR: Can not fetch image</span></img>
    }

};

(function () {
    var parent, root, wpElementTag,wpCollectionTag, wpElements, baseUrl, wpCollection;

    parent = document.querySelectorAll("[data-wp-source]");
    
    for (var j = 0; j < parent.length; j++) { 
        root = RootElement(parent[j]);
        wpElementTag = root.findWPElements();
        wpCollectionTag = root.findWPCollections();
        wpElements = [];
        wpCollection = [];
        var baseUrl = root.getSourceURL();
        for (var i = 0; i < wpElementTag.length; i++) {
            wpElements.push(WPElement(wpElementTag[i]));
        }
        for (var j = 0; j < wpCollectionTag.length; j++) {
            wpCollection.push(WPCollections(wpCollectionTag[j]));
        }

        wpElements.forEach(function(el) {
            var template = el.self().querySelectorAll("[data-wp-template]");
            util.ajax(el.requestUrl(baseUrl), function(err, data) {
                util.insertContent(data, template);
            });
        });

        wpCollection.forEach(function (col) {
            console.log(baseUrl);
             util.ajax(col.requestUrl(baseUrl), function(err, data) {
                util.insertCollections(data, col.template());
            });

        });
    }
}());
