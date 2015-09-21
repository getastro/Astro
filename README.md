Astro
=====

This framework to use to generate wordpress content by simple writing HTML tag and 0 line of javasript

###Example:
```html
<div data-wp-source="https://public-api.wordpress.com/rest/v1.1/sites/98941271/">
    <div data-wp-element="posts/10" >

        <!-- start define template here -->

        <div data-wp-template="title"></div>
        <img data-wp-template="featured_image"></div>
        <div data-wp-tempalte="content"></div>
    </div>
</div>
```

What it will be looks like after the library excecuted

```html

<div data-wp-resouce="https://public-api.wordpress.com/rest/v1.1/sites/98941271/">
    <div data-wp-element="post/10">

        <!-- start define template here -->

        <div data-wp-template="title">json api advanture 2</div>
        <img data-wp-template="featured_image" src="http://mywordpress.com/cat.png"></img>
        <div data-wp-template="content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                eu nulla sollicitudin, gravida massa at, aliquet turpis. Quisque 
                accumsan, massa ac egestas imperdiet, lorem dolor tempus velit, non pellentesque ex.
            </p>
        </div>
    </div>
</div>

```
### How to use it:
1. Make a wrapper html tag and put `data-api-source` attribute
2. make a div tag inside it that contains `data-wp-element` attribute and give it value
3. create a template inside the div tag and use `data-this-[Return parameter]`
    [parameter list](https://developer.wordpress.com/docs/api/1.1/get/sites/%24site/posts/%24post_ID/#apidoc-response)


####Rules of data attribute
| data attribute      | Require | Values                          | Description                        |
|---------------------|---------|---------------------------------|------------------------------------|
| data-api-source     | Yes     | your wordpress url              |Read Detai                          |
| data-wp-element     | Yes     | posts/#id                       | This will return the specific post |
| data-wp-options     | No      | search=youNameIt&number=2       |  see [Query Parameter](https://developer.wordpress.com/docs/api/1.1/get/sites/%24site/posts/)   |


#####More detail
```html
    1. If your blog is host at wordpress.com
    data-api-source: https://public-api.wordpress.com/rest/v1.1/sites/ + YOUR BLOG URL
    ex. https://public-api.wordpress.com/rest/v1.1/sites/getcontentfrom.wordpress.com
    
    2. Jetpack plugin
    data-api-source: https://public-api.wordpress.com/rest/v1.1/sites/ + YOUR BLOG URL
```


###Support:

-  blog in wordpress.com
-  self hosted blog and enable jetpack plugin
WordPress official Restful api endpoint
[Documentaion](https://developer.wordpress.com/docs/api/)


###Todo:
- More Unit tests
- Implement render collections
- Implement get content from more than 1 source (standalone wordpress site using wp-api, json-api plugin)

###Issues:

- Accessibilit
- SEO




