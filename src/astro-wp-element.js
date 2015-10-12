// Astro Framework - Wordpress verison 0.2.0
// Copyright 2015 Ting Yang and Hector Jarquin
// Released under the MIT license
// Last updated: October 11th, 2015
//
// Support:
//  Wordpress.com, the official RESTful api endpoint
//  Wordpress.org (self hosted) with Jetpack json api plugin 
//  
// Hightlight:
// 1. enable the collapse feature in bootstrap
// 2. rewrit the list render, ul and li will remove
(function () {
'use strict';

function RootElement(domBlock) {
    var url, root;
    var root = domBlock;
    url = root.dataset.wpSource;
    function validateSource (url) {
        return (url.search(/wordpress/) != -1);
    } 
    
    function getSourceURL () {
        // root should expect
        if (root.dataset.wpSource.slice(-1) !== "/") {
            return root.dataset.wpSource + "/";
        } else {
            return root.dataset.wpSource;
        }
    }

    function findWPElements () {
        return root.querySelectorAll("[data-wp-element]");
    }


    function findWPCollections () {
        return root.querySelectorAll("[data-wp-collection]");
    }

    function countElements () {
        return root.querySelectorAll("[data-wp-element]").length;
    }

    function countCollections () {
        return root.querySelectorAll("[data-wp-collection]").length;
    }
    
    // public properties
    return {
        getSourceURL: getSourceURL,
        findWPElements: findWPElements, 
        findWPCollections: findWPCollections, 
        countElements: countElements, 
        countCollections: countCollections 
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
            console.error("ASTRO Error: data-wp-element only " 
                        + "support posts and category");
            return null;
        }
        return criteria;
    }

    function requestUrl (sourceUrl) {
        // build the request url
        var component = getSearchCriteria(element);          
        var url;
        if (component.hasOwnProperty("type")) {
            url = "";
            url += sourceUrl + component.type + "/";
            if (!component.hasOwnProperty("option")) {
                return url;
            } else {
                // if contains wp-option
                url += "?" + component.option;
            }
        } else {
            // this may not happen if no type
        }
        return url;    
    }

    function self () {
        return element;
    }

    function template () {
        return element.querySelector("[data-wp-layout]");
    }


    // public properties
    return {
        requestUrl: requestUrl,
        self: self, 
        template: template 
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

    function requestUrl (sourceUrl) {
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
    }

    function self () {
        return element;
    }


    // public properties
    return {
        requestUrl: requestUrl,
        self: self 
    }
}

var util = {
    ajax: function (url, callback) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // JSON.parse will crash when has unexpected response 'json'
                callback(null, JSON.parse(xmlhttp.responseText));
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    },
    insertContent: function (json, template) {
        // json = {post}
        // insert each element with class = "post" + json["ID"]
        for (var i = 0; i < template.length; i++) {
            if (template[i].tagName === "IMG") {
                template[i].setAttribute("src",
                    json[template[i].dataset.wpTemplate]);
            } else if (template[i].tagName === "A") {
                template[i].setAttribute("href",
                    json[template[i].dataset.wpTemplate]);
            } else {
                template[i].innerHTML = json[template[i].dataset.wpTemplate];
            }
        }
    },
    insertCollections: function (json, layout) {
        //
        // json = [{post}, {posts} ..] 
        var list = layout.querySelector("*");
        json.posts.forEach(function (post, index) {
            if (index == 0) {
                // this not need to clone
                util.insertContent(post, 
                    layout.querySelectorAll("[data-wp-template]")); 
            } else {// this need to clone 
                var virtual = list.cloneNode(true);
                util.insertContent(post,
                    virtual.querySelectorAll("[data-wp-template]")); 
                layout.appendChild(virtual);
            }
        });
    },
    insertError: function (json, template) {
        // TODO:
        // insert error message into the dom,
        // it helps developer to know what went wrong
        //
        // <img data-wp-template>
        //     <span>Astro-ERROR: Can not fetch image</span>
        // </img>
    }

};

function ASTROWP () {
    var parent, root, wpElementTag,wpCollectionTag, wpElements, baseUrl,
        wpCollection;
    // find the source, key to fetch content from more 1 wordpress site
    parent = document.querySelectorAll("[data-wp-source]");
    // querySelectorAll return NodeList, not array 
    // foreach doesn't work in this case
    for (var j = 0; j < parent.length; j++) { 
        root = RootElement(parent[j]); // create ROOT object
        wpElementTag = root.findWPElements();
        wpCollectionTag = root.findWPCollections();
        wpElements = [];
        wpCollection = [];
        baseUrl = root.getSourceURL();
        for (var i = 0; i < wpElementTag.length; i++) {
            wpElements.push(WPElement(wpElementTag[i]));
        }

        for (var k = 0; k < wpCollectionTag.length; k++) {
            wpCollection.push(WPCollections(wpCollectionTag[k]));
        }
        wpElements.forEach(function(el, index) {
            var template = el.self().querySelectorAll("[data-wp-template]");
            util.ajax(el.requestUrl(baseUrl), function(err, data) {
                // if expecting data = {post}
                // this will break if the data in unexepeted format
                // Only reder first post if exist of not
                if (!data.hasOwnProperty('posts') ){
                    util.insertContent(data, template);
                } else {
                    // only display the 1st post when doing search
                    // use data-wp-options="category=demo"
                    // it can be display the most recent post under demo
                    util.insertContent(data.posts[0], template);
                }
            });
        });

        wpCollection.forEach(function (col, index) {
             util.ajax(col.requestUrl(baseUrl), function(err, data) {
                util.insertCollections(data, col.template());
            });
        });
    }
}
    // run astro
    ASTROWP();    
}).call(this);
