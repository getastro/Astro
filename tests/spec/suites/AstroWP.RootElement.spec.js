describe("Test Root Element", function() {
    var dom;
    beforeAll(function () {
        var singleElement='';
            singleElement += '<div id="root" data-wp-source="https://public-api.wordpress.com/rest/v1.1/sites/98941271/">';
            singleElement += '    <div data-wp-element="post/10">';
            singleElement += '        <h1 data-wp-template="title"></h1>';
            singleElement += '        <img data-wp-template="featured_image">';
            singleElement += '        <div data-wp-template="content"></div>';
            singleElement += '    </div>';
            singleElement += '</div>';
        
        dom = document.createElement('div');
        dom.innerHTML = singleElement;

    });
    it("should contain the apiSource", function() {
        var root, e;
            root = dom.querySelectorAll("[data-wp-source]");
        e = AstroWP.Root(root[0]);
        expect(e.SourceURL()).toBe("https://public-api.wordpress.com/rest/v1.1/sites/98941271/");
    });
    
    it("should contain 1 element", function () {
        var root, e;
            root = dom.querySelectorAll("[data-wp-source]");
        e = AstroWP.Root(root[0]);
        expect(e.ElementsLength()).toBe(1);
    });

    it ("should not see any valiables inside rootElement", function () {
        var root, e;
            root = dom.querySelectorAll("[data-wp-source]");
        e = AstroWP.Root(root[0]);
        expect(e.root).not.toBeDefined();
        expect(e.url).not.toBeDefined();
    });
});
