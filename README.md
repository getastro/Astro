Astro
=====

This framework to use to generate wordpress content by simple writing HTML tag and 0 line of javasript

###Example:
```html
<div data-api-source="https://public-api.wordpress.com/rest/v1.1/sites/98941271/">
    <div data-api-single="post/10" >

        <!-- start define template here -->

        <div data-this-title></div>
        <img data-this-feature-image></div>
        <div data-this-content></div>
    </div>
</div>
```

What it will be looks like after the library excecuted

```html

<div data-api-resouce="https://public-api.wordpress.com/rest/v1.1/sites/98941271/">
    <div data-api-single="post/10">

        <!-- start define template here -->

        <div data-this-title>json api advanture 2</div>
        <img data-this-feature-image src="http://mywordpress.com/cat.png"></img>
        <div data-this-content>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu nulla sollicitudin, gravida massa at, aliquet turpis. Quisque accumsan, massa ac egestas imperdiet, lorem dolor tempus velit, non pellentesque ex.
            </p>
        </div>
    </div>
</div>

```
### How to use it:
1. Make a wrapper html tag and put `data-api-source` attribute
2. make a div tag inside it that contains `data-api-single` attribute and give it value
3. create a template inside the div tag and use `data-this-[Return parameter]`
    [parameter list](https://developer.wordpress.com/docs/api/1.1/get/sites/%24site/posts/%24post_ID/#apidoc-response)


####Rules of data attribute
| data attribute      | Require | Values                          | This will return the specific post |
|---------------------|---------|---------------------------------|------------------------------------|
| data-api-single     | Yes     | post/#id                        | This will return the specific post |
|                     |         | page/#id                        | This will return the specific post |
| data-api-options    | No      | search=#post name&number=#limit | This will search specific post     |
| data-api-collection | Yes     | posts                           | Coming soon                        |
|                     |         | categories                      | Coming soon                        |


###Support:

blog in wordpress.com

WordPress official Restful api endpoint
[Documentaion](https://developer.wordpress.com/docs/api/)



###Todo:
- Unit test
- Implement render collections
- Implement get content from more than 1 source (standalone wordpress site using wp-api, json-api plugin)

###Issues:

- Accessibility
- SEO



