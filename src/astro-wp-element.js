// Astro Framework - WordPress v0.2.0
// Copyright 2015 Ting Yang and Hector Jarquin
// Released under the MIT license
// Last updated: November 7th, 2015
//
// Support:
//  WordPress.com, the official RESTful api endpoint
//  WordPress.org (self hosted) with Jetpack json-api plugin 
//  
// Highlights:
// 1. Remove data-wp-collection attribute
// 2. Combine collection to wp-element
// 3. data-wp-layout is the require attribute
//

(function () {
    'use strict';
    var AstroWP; // namespa
    var WPBlogs = [], // this to store the HTML BLOCKS, each Item = contents from 1 blog
        wPElements = [];

    function rootElement(rootNode) {
        var root, elements;
        root = rootNode;
    
        elements = root.querySelectorAll("[data-wp-element]");

        function getSourceURL() {
            // check if the root url is end with / or not
            // otherwise append / at tail
            if (root.dataset.wpSource.slice(-1) !== "/") {
                return root.dataset.wpSource + "/";
            }
            return root.dataset.wpSource;
        }

        function findWPElements() {
            return elements;
        }

        function countElements() {
            return elements.length;
        }

        return {
            SourceURL: getSourceURL,
            WPElements: findWPElements,
            ElementsLength: countElements
        };
    }

    function wPElement(wpElementNode, sourceUrl) {
        var element, expectedType, dataset, templates;
        expectedType = ["posts", "categories"];
        element = wpElementNode;
        dataset = element.dataset;
        templates = element.querySelectorAll('[data-wp-template]');

        function layout() {
            if (dataset.wpLayout) {
                if (dataset.wpLayout.search(/list|single|slider/) !== -1) {
                    return dataset.wpLayout;
                }
            }
            // if layout is not defined, we assume it means render single item
            return "single";
        }

        function getSearchCriteria(element) {
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
                // check the options
                criteria.options = data.wpOptions;
            }
            if (expectedType.indexOf(criteria.type) === -1) {
                console.error("data-wp-element only support posts");
                return null;
            }
            return criteria;
        }

        function processUrl() {
            if (sourceUrl.slice(-1) !== "/") {
                return sourceUrl + "/";
            }
            return sourceUrl;
        }

        function requestUrl(sourceUrl) {
            // 
            var component = getSearchCriteria(element);
            if (component) {
                var url = '';
                url += processUrl(sourceUrl);
                if (component.itemId) {
                    url += component.type + "/" + component.itemId + "/";
                    if (component.options) {
                        url += "?" + component.options;
                    }
                } else {
                    url += component.type + "/";
                    if (component.options) {
                        url += "?" + component.options;
                    }
                }
                return url;
            }
            return null;
        }

        function getTemplates() {
            // get templates value and add that into request url
            // 'field=templateValue1, templateValue2...etc'
            // reduce the http response data size
            // FIXME yty
            return templates;
        }
        // public properties
        return {
            requestUrl: requestUrl,
            layout: layout,
            template: getTemplates,
            nodes: element
        };
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
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
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
            var i;
            for ( i = 0; i < template.length; i += 1) {
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
                if (index === 0) {
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
        }
    };

    function filterData(data) {
        // filter out a list of post and only return first post
        if (data.posts) {
            // FIXME yty
            // should not return all post
            // fix the request string to return only 1 post
            return data.posts[0];
        }
        return data;
    }

    function renderContent (elements) {
        elements.forEach(function (element) {
            util.ajax(element.requestUrl(), function (err, data) {
                if (!err) {
                    var layout = element.layout();
                    switch (layout) {
                    case "list":
                        util.insertCollections(data, element.nodes);
                        break;
                    case "single":
                        data = filterData(data);
                        util.insertContent(data, element.template());
                        break;
                    default:
                        // assume data-wp-layout is not definded
                        data = filterData(data);
                        util.insertContent(data, element.template());
                    }
                }
            });
        });
    }
    
    function init() {
        // Step 1: Find the WP blocks, each block = 1 blog
        var WPBlogsRaw = document.querySelectorAll("[data-wp-source]");
        // Step 2: Create some WPBlogs
        var i, j, el;
        for (i = 0; i < WPBlogsRaw.length; i += 1) {
            WPBlogs.push(rootElement(WPBlogsRaw[i]));
        }
        // Step 3: Create the wPElements
        WPBlogs.forEach(function (WPBlog) {
            for (j = 0; j < WPBlog.ElementsLength(); j += 1) {
                el = wPElement(WPBlog.WPElements()[j], WPBlog.SourceURL());
                wPElements.push(el);
            }
        });
        // Create Event 
        // todoyty
    }

    function main() {
        init();
        // Step 4: Render the wpElememts(fill in the content)
        renderContent(wPElements);
    }

    main(); // Execute astro magic

    // the public properties, mainly use for unit test
    AstroWP = {
        Root: rootElement,
        wpElement: wPElement
    };
    // append it into the global object 
    if(!window.AstroWP) {
        window.AstroWP = AstroWP;
    }
}());

