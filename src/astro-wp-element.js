// Astro Framework - WordPress v0.2.0
// Copyright 2015 Ting Yang and Hector Jarquin
// Released under the MIT license
// Last updated: November  1st, 2015
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
var AstroWP = AstroWP || {};

(function () {
'use strict';
// Expose to global, for unit test
AstroWP.RootElement = RootElement;
AstroWP.Elments = WPElement;
//AstroWP.Util = util;
//
var WPBlogs = []; // this to store the HTML BLOCKS, each Item = contents from 1 blog
var WPElements = [];


function Init () {
    // Step 1: Find the WP blocks, each block = 1 blog
    var WPBlogsRaw = document.querySelectorAll("[data-wp-source]");
    
    // Create some WPBlogs
    for(var i = 0; i < WPBlogsRaw.length; i++) { 
        WPBlogs.push(RootElement(WPBlogsRaw[i]));
    }
    
    // Create the WPElements
    WPBlogs.forEach(function (WPBlog) {
        for(var j = 0; j < WPBlog.ElementsLength(); j++) {
            console.log(WPBlog);
            var el = WPElement(WPBlog.WPElements()[j], WPBlog.SourceURL());
            WPElements.push(el);
        }
    });

    
    // Create Event 
    // TODO yty
}

function main () {
    Init();
    

    // Step 3: Render the wpElememts(fill in the content)
    RenderContent(WPElements);
}


function _filterData(data) {
    // filter out a list of post and only return first post
    if (data.posts) {
        return data.posts[0];
    } else {
        return data;
    }

}

function RenderContent (elements) {
    elements.forEach(function (element) {
        util.ajax(element.requestUrl(), function (err, data) {
            var layout = element.layout();
            switch (layout) {
                case "list":
                    util.insertCollections(data, element.nodes);
                    break;
                case "single":
                    data = _filterData(data);
                    util.insertContent(data, element.template());
                    break;
                default:
                    // assume data-wp-layout is not definded
                    data = _filterData(data);
                    util.insertContent(data, element.template());
            }
        });
    });
}


function RootElement(rootNode) {
    var url, root, elements;
    var root = rootNode;
    url = root.dataset.wpSource;

    elements = root.querySelectorAll("[data-wp-element]");
    function validateSource (url) {
        // Don't Trust user data
        return (url.search(/wordpress|api/) != -1);
    } 
    
    function getSourceURL () {
        // check if the root url is end with / or not
        // otherwise append / at tail
        if (root.dataset.wpSource.slice(-1) !== "/") {
            return root.dataset.wpSource + "/";
        } else {
            return root.dataset.wpSource;
        }
    }

    function findWPElements () {
        return elements;
    }


    function countElements () {
        return elements.length;
    }

    
    // public properties
    return {
        SourceURL: getSourceURL,
        WPElements: findWPElements, 
        ElementsLength: countElements 
    };
};


function WPElement(wpElementNode, sourceUrl) {
    var element, expectedType, layout, options, type1, dataset, templates;
    expectedType = ["posts", "categories"];

    element = wpElementNode;
    
    dataset = element.dataset;
    templates = element.querySelectorAll('[data-wp-template]'); 

    function type () {
        if (dataset.wpElement !== null) {
            if (dataset.wpElment.search(/posts|categories/) !== -1) {
                return datset.wpElement; 
            }   
        }
        return null;
    }

    function layout () {
        if (dataset.wpLayout) {
            if (dataset.wpLayout.search(/list|single|slider/) !== -1) {
                return dataset.wpLayout;
            }
        }
        // if layout is not defined, we assume it means render single item
        return "single";
    }
    
    function options () {
        if (dataset.wpOptions !== null) {
            // TODO tyty validation
            return dataset.wpOptions;
        }
        return null;
    }

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

    function processUrl () {
        if(sourceUrl.slice(-1) !== "/") {
            return sourceUrl + "/";
        } else {
            return sourceUrl;
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

    
    function getTemplates() {
        return templates;
    }
    function getNodes() {
        return elements;
    }
    // public properties
    return {
        requestUrl: requestUrl,
        layout: layout,
        render: renderContent,
        template: getTemplates,
        nodes: element
    };
};

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

main();

}());

