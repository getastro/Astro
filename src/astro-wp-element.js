// Astro Framework - WordPress v0.2.1
// Copyright 2016 Ting Yang and Hector Jarquin
// Released under the MIT license
// Last updated: Feburary 3rd, 2016 
//
// Support:
//  WordPress.com, the official RESTful api endpoint
//  WordPress.org (self hosted) with Jetpack json-api plugin 
//  
// Highlights:
// 1. support rendering nested properties in json content
//

// custom event polyfill for IE9 - IE10
(function (document, window) {
    'use strict';
    function CustomEvent (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles,
                            params.cancelable, params.detail);
        return evt;
    }
    CustomEvent.prototype = window.CustomEvent.prototype;
    window.CustomEvent = CustomEvent;
})(document, window);

(function (document, window) {
    'use strict';

    
    /**
     * Define the "const" variables
     *
     */
    var event_FinishRequest = new CustomEvent("AstroWP-render");

    // Astro defined attribute name
    var ASTRO_QUERY_DATASET = {
        source: "[data-wp-source]",
        element: "[data-wp-element]",
        template: "[data-wp-template]"
    };

    var ASTRO_DATASET_ATTRIBUTE = {
        source: 'wpSource',
        element: 'wpElement',
        options: 'wpOptions',
        layout: 'wpLayout',
        singlePage: 'partialView' // will be use in other
    };
    
    var LAYOUT_TYPE = /list|single/;
    
    var ERROR_MESSAGE = {
        layout: "Not valid layout type, the program will set the layout to Single"
    };

    /**
     * The global value that will insert into window object
     *  {
     *      wpElements: {
     *          blogs: [
     *              {
     *                  element: [] <- NodeList
     *                  url: string <- the blog url
     *                  jsoncontent: [] <- the posts
     *              }
     *          ]
     *      }
     *  }
     *
     */

    var AstroWP = {};
    /**
     * Util object contains helper functions 
     *
     */
    var Util = {
        /**
         * GetContentFromWordpress
         *
         * @param {string} url the api data endpoint
         * @param {function} callback return 2 params, err & json data
         */
        GetContentFromWordpress: function (url, callback) {
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
        ExtractJsonValueByKey: function (param, json) {
            var p = param;
            var keys = p.split(".");
            
            console.log(keys);
            for (var i = 0; i < keys.length; i+=1) {
                json = json[keys[i]];
                
            }

            return json;

        }
    };

    /**
     * getBlogs
     *
     * @return {NodeList} return nodes that contains [data-wp-source] attributes
     */
    function getBlogs () {
        var wpBlogs;
        wpBlogs = document.querySelectorAll(ASTRO_QUERY_DATASET.source);
        return wpBlogs || [];
    } 
    


    /**
     * getElements
     *
     * @param {nodeList} blogs All nodes that contains [data-wp-source] attribute
     * @return {object} new custom object, see line 66
     */
    function getElements (blogs) {
        var elements = { 
            blogs: []
        };
        var i;
        for (i = 0; i < blogs.length; i+=1) {
            elements.blogs.push(
                {
                    'url': blogs[i].dataset[ASTRO_DATASET_ATTRIBUTE.source],
                    'elements': blogs[i].querySelectorAll(ASTRO_QUERY_DATASET.element),
                    'jsoncontent': []
                }        
            );
        }
        return elements;
    }
    
 


    // Element module
    /**
     * Element
     *
     * @param {string} url the blog URL from wordpress
     * @param {dom element} rawElement The dom element that has [data-wp-element] attribute
     * @return {{
     *      url The request url
     *      layout What layout going to build for this element
     *      childNode The child nodes
     *      elementNode The current element node
     *      template The childNodes that contains [data-wp-template] attribute
     * }} some public functions
     */
    function Element (url, rawElement) {
        
        var sourceURL = url;
                
        var dataset = rawElement.dataset; 

        function layout  () {
            if (!dataset[ASTRO_DATASET_ATTRIBUTE.layout]) {
                return 'single';
            }
            if (dataset[ASTRO_DATASET_ATTRIBUTE.layout].search(LAYOUT_TYPE) !== -1) {
                return dataset[ASTRO_DATASET_ATTRIBUTE.layout];
            } 

                 //if layout is not defined, we assume it means render single item
        }


        function options() {
            var optionAttribute = dataset[ASTRO_DATASET_ATTRIBUTE.options] || null;
            return optionAttribute;
        }

        function endPoint() {
            var type = dataset[ASTRO_DATASET_ATTRIBUTE.element] || null;
            return type;
        }
        
        function requestURL () {
            var path = '';
            var opts = options();    
            // apend a / to URL
            if (sourceURL.slice(-1) !==  "/") {
                sourceURL= sourceURL + "/";
            }
            
            path += sourceURL + endPoint();
            
            if (opts !== null) {
                path += '?' + opts; 
            }
            return path;
        }
        

        function childnodes () {
            return rawElement.querySelector('*');
        }

        function parentNode () {
            return rawElement;
        }

        function templates () {
            return rawElement.querySelectorAll(ASTRO_QUERY_DATASET.template);
        }
        return {
            // public function
            url : requestURL,
            layout: layout,
            childnodes: childnodes,
            elementNode: parentNode,
            templates: templates
        };
    } 

    /**
     * getElementAmt
     * @summary This will return the # of ajax call is needed
     *          for aync in Fetch(), need to dispatch an event
     *          after all ajax call 
     *
     * @param {object} element AstroWP
     */
    function getElementAmt(element) {
        var counter = 0;

        for (var i = 0; i < element.wpElements.blogs.length; i++) {
            counter += element.wpElements.blogs[i].elements.length;
        }
        return counter;
    }
    /**
     * Init
     * @summary Gather the nessesery information from the nodes
     *          and build the object see line 66, the object will
     *          be use in Fetch() and Build()
     *
     *
     * 
     */
    function Init() {
        // find Blogs
        var blogs = getBlogs();
        var elements = getElements(blogs);
        AstroWP.wpElements = elements;
    }


    /**
     * Fetch
     * @summary A step after Init(), once it got called, it will
     *          loop throught AstroWP.wpElement.blogs and do the ajax call
     *          for each wp-element, then it will cache the json content to
     *          AstroWP.wpElement.blogs.jsoncontent
     *
     * @param {function} callback Build the dom tree after retrive the json content from wordpress
     */
    function Fetch(callback) {
        // build element requirement 
        var elCounter = 0; // need to use for track when all ajax call are finished
        var i, e;
        var elAmt = getElementAmt(AstroWP);
        AstroWP.wpElements.blogs.forEach(function(bg) {
            for (i = 0; i < bg.elements.length; i+=1) {
                e = Element(bg.url, bg.elements[i]);
                // closure
                (function (e, bg) {
                    Util.GetContentFromWordpress(e.url(), function (err, data) {
                        // cache the content
                        if (err) {
                            callback(e, data);
                        }
                        if (Array.isArray(data)) {
                            bg.jsoncontent.push([data]);
                        }
                        if (!data.posts) {
                            bg.jsoncontent.push([data]);
                        } else {
                            bg.jsoncontent.push(data.posts);
                        }
                        // sorry for the messy code                       
                        // promises is not fully compatible in every browswer
                        // this nessed code is ugly, but...
                        // this will be rewrite soon
                        // Todoyty
                        callback(e, data); // i know, this block of code smell
                        elCounter += 1;
                        if(elCounter === elAmt) {
                              //fixmeyty
                            // fire up event 
                            document.dispatchEvent(event_FinishRequest);
                            
                        }
                    });
                })(e, bg);
            }
        });
    }

    /**
     * Build
     * @summary a callback for Fetch(), it will build the html if the
     *          wp element layout is list
     *
     * @param {object} element an instance of Element
     * @param {json} jsonContent content that receive from wordpress
     */
    function Build(element, jsonContent) {
        if (element.layout() === 'list') {
            // copy the nodes
            var nodes = element.childnodes();
            var i, virtual;
            var posts = jsonContent.posts || jsonContent;
            for (i = 1; i < posts.length; i+= 1) {
                virtual = nodes.cloneNode(true);
                element.elementNode().appendChild(virtual);
            }
        }
        Render(element, posts);
    }
    /**
     * Render
     * @summary Decision maker for render type base on the received json 
     *
     * @param {object} element instance of Element
     * @param {json object} json json object that received from WordPress
     */
    function Render(element, json) {
        var nodes, templates;
        if (Array.isArray(json)) {
            RenderList(element, json);
        } else {
            nodes = element.elementNode(); 
            templates = nodes.querySelectorAll(ASTRO_QUERY_DATASET.template);
            RenderSinglePost(json, templates);
        }
    }

    /** yty
     * RenderList
     *
     * @param {object} element instance of Element
     * @param {json object} json json objects that received from wordpress
     */
    function RenderList(element, posts) {
        var nodes, i, templates;
        // if the json with .posts is from .com
        // if the json type is array, its from .org
        //var posts = json.posts || json;
        for (i = 0; i < posts.length; i+= 1) {
            // assign the coresponse html to the post json
            nodes = element.elementNode().children[i]; 
            templates = nodes.querySelectorAll(ASTRO_QUERY_DATASET.template);
            // this will insert the json to html inner html
            RenderSinglePost(posts[i], templates);
        }
    }

    /**
     * RenderSinglePost
     *
     * @param {json object} json post json object
     * @param {nodelist} template The nodes that contains [data-wp-template]
     */
    function RenderSinglePost(json, template) {
        var i, content;
            for ( i = 0; i < template.length; i += 1) {
                content = Util.ExtractJsonValueByKey(template[i].dataset.wpTemplate, json);
                if (template[i].tagName === "IMG") {
                    template[i].setAttribute("src",
                        content);
                } else if (template[i].tagName === "A") {
                    template[i].setAttribute("href",
                       content);
                } else {
                    template[i].innerHTML = content;
                }
            }
    }


    /**
     * Start execute the magic
     *
     */
    Init();


    Fetch(function (element, jsonContent) {
        Build(element, jsonContent);
    });


    /*
     * Explosure the object to public
     *
     */
    // for other other usage
    AstroWP.Util = Util;
    // put this to public
    window.AstroWP = AstroWP;
    window.ASTRO_QUERY_DATASET = ASTRO_QUERY_DATASET;
    window.ASTRO_DATASET_ATTRIBUTE = ASTRO_DATASET_ATTRIBUTE;


}(document, window));
