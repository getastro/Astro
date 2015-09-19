describe("Dome", function() {

    beforeEach(function () {
            jasmine.getFixtures().fixturesPath = 'spec/fixtures';
            jasmine.getFixtures().load("single_page.html");
    });
    it("should contain the apiSource", function() {
    var root, e;
        root = document.querySelector("#root");
        e = Element(root);
        expect(e.getSourceURL()).toBe("https://public-api.wordpress.com/rest/v1.1/sites/98941271/");
    });

    it("should return a list of children", function () {
    var root, e;
        root = document.querySelector("#root");
        e = Element(root);
        expect(e.getChildElements().length).toBe(1);
    });
    it("should contain data-api-single in children", function() {
        
    });
});
