// Astro Module - views v0.1.0
// Copyright 2015 Ting Yang and Hector Jarquin
// Released under the MIT license
// Last updated: December 30th, 2015
// 
// Not support: Internet Explorer
// 
// Summary:
// Turn a data-wp-element node to a single page application
// once the item is clicked, it will render a single view 
//
(function (document, window) {
    // create custom event for page state
    var event_OnSinglePgaeView = new CustomEvent("Astro-onSingleView");
    var event_OnListView = new CustomEvent("Astro-onListView");
   
    window.ASTRO_QUERY_DATASET.view = "[data-app-view]"; // set the value
    window.ASTRO_QUERY_DATASET.container = "[astro-body]";
    
    var AstroLookUpTable = {};
    
    var store = {
        currentView: null
    }

    /**
     * BuildAstroLoopUpTable
     * @summary the object holds the hash table for the key-value pair of url and post json
     * @param {object} AstroWP The AstroWP element
     */
    function BuildAstroLoopUpTable(AstroWP) {
        AstroWP.wpElements.blogs.forEach(function(blog, index) {
            // build the hash table here!
            for (var i = 0; i < blog.jsoncontent.length; i++) {
                for (var j = 0; j < blog.jsoncontent[i].length; j++) {
                    AstroLookUpTable[blog.jsoncontent[i][j].URL] = blog.jsoncontent[i][j]; 
                }
            }
        });
    }

    /**
     * BluePrint
     * @summary This is the building plan for the views
     * @param {node} doc dom tree
     * @return {object} The object holds the avaliable views and relate elements
     */
    function BluePrint(doc) {
        var appViews = [];
        var viewsNode = doc.querySelectorAll(ASTRO_QUERY_DATASET.view);
        var mainListNodes = []; // the list wpelement nodes
        var views = []; // the views element node.
        for (var i = 0; i < viewsNode.length; i++) {
            if (viewsNode[i].dataset.wpElement) {
                mainListNodes.push(viewsNode[i]);
            } else {
                views.push(viewsNode[i]);
                var temp = {
                        name: viewsNode[i].dataset.appView,
                        viewElement: viewsNode[i],
                        list: []
                    } 
                appViews.push(temp);
            }
        } 

        // return appView object 
 
        for (var j = 0; j < mainListNodes.length; j++) {
            appViews.forEach(function (view) {
                if (view.name === mainListNodes[j].dataset.appView) {
                    view.list.push(mainListNodes[j]);
                }
            });
        }  
        return appViews;
    }

    /**
     * InsertAnchor
     * @summary append the specified data-app-view value to the anchor
     *          href = ...html/#viewname#posturl
     *
     * @param {object} appViews the blue print object
     */
    function InsertAnchor (appViews) {
        for(var i = 0; i < appViews.length; i++) {
            for (var j = 0; j < appViews[i].list.length; j++) {
                var node = appViews[i].list[j];
                var a = node.querySelectorAll("[data-wp-template=URL]");
                for (var k = 0; k < a.length; k++) {
                    a[k].setAttribute('href', "#" + node.dataset.appView + "#" 
                                + a[k].getAttribute('href'));
                }
            }
        } 
    }

    /**
     * extractView
     *
     * @param {string} hash The current hash value from url
     * @return {node} The view node
     */
    function extractView (hash) {
        var lastHashindex = hash.lastIndexOf('#');
        var viewName = hash.substring(1, lastHashindex);
        var app_views = document.querySelectorAll("[data-app-view=" + viewName + "]");
        if (app_views.length > 0) {
            var lastView = app_views[app_views.length - 1];
            store.currentView = lastView;
            return lastView;
        }
    } 

    /**
     * Render
     * @summary this will be call after the navigation state change
     *          it will decide what to render base on the url
     * @param {object} bluePrint the blue print object
     */
    function Render(bluePrint) {
        // this will be call when started
        // then decide what to do 
        var mainView = document.querySelector(ASTRO_QUERY_DATASET.container);

        if (window.location.hash.length < 1) {
            if (store.currentView !== null) {
                store.currentView.style.display = "none"; 
            }
            RenderMain(mainView);
        } else {
            var el = extractView(window.location.hash);
            RenderView(el, mainView, bluePrint);
        }
    }
    
    /**
     * RenderView
     * @summary Render the template and hide the astro list veiw
     *          and it will dispatch an event after it render, it gives
     *          users has oppotunities to do something when the event triggered
     *
     * @param {node} viewEl The view need to be render
     * @param {node} mainView the node has astro-body attribute
     * @param {object} bluePrint the blue print object
     */
    function RenderView(viewEl, mainView, bluePrint) {
        viewEl.style.display = "block"; // show the view 
        mainView.style.display = "none"; // hide the content in astro-body
        window.scrollBy(100, -window.pageYOffset);
        
        // extract the post url from current URL
        var urlTemp = window.location.hash;
        var index = urlTemp.lastIndexOf('#');
        var viewName = urlTemp.substring(1, index);
        urlTemp = urlTemp.substring(index + 1);

        bluePrint.forEach(function (view) {
            if (view.name == viewName) {
                var templates = view.viewElement.querySelectorAll('[data-wp-template]');
                var postJson = AstroLookUpTable[urlTemp];
                RenderSinglePost(postJson, templates);
            }
        });

        document.dispatchEvent(event_OnSinglePgaeView);
    }

    /**
     * RenderMain
     *
     * @param {node} mainView The node has astro-body
     */
    function RenderMain(mainView) {
        mainView.style.display = "block";
        document.dispatchEvent(event_OnListView);
    }
    
    function RenderSinglePost(json, template) {
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
    }

    document.addEventListener('AstroWP-render', function (e) {
        if (!window.AstroWP) {
            console.error("astro-wp-element.js is not found");
            return;
        }
     
        // execute the magic
        BuildAstroLoopUpTable(AstroWP); 
        var bluePrint = BluePrint(document);
        InsertAnchor(bluePrint); 
        Render(bluePrint);
        // when the navigation changed 
        window.addEventListener('popstate', function (e) {
            Render(bluePrint);
        });
    });
}) (document, window);

