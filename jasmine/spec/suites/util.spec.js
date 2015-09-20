describe("Util class", function () {
    var dom;
    beforeAll(function () {
        var wpElement='';
            wpElement += '<div data-wp-element = "posts" data-wp-options="search=Json api advanture1">';
            wpElement += '</div>';
        
        dom = document.createElement('div');
        dom.innerHTML = wpElement;
    });
    
    it("should able to get the wpelement", function () {
        var el, utl, criteria;

        el = dom.querySelector("[data-wp-element]");
        utl = util(); 
        criteria = utl.getSearchCriteria(el);
        expect(criteria.type).toEqual("posts");
        expect(criteria.itemId).toBeUndefined();
        expect(criteria.options).toBe("search=Json api advanture1");
    }); 

});
