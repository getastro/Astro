Astro
=====

This framework to use to generate wordpress content by simple writing HTML tag and 0 line of javasript

###Rules:
- it must has contain `data-api-source` in body tab
- a div must has `data-api-single` or `data-api-collection` attribute
- `data-api-options` is optional `data-api-options="number=5&search=name"`
-  examples for `data-api-single="page"` `data-api-single="page"`
    `data-api-single="page/3"`   3 is post ID

###Example:
-------
```
    <!-- defind the source url -->
    <body data-api-source="https://public-api.wordpress.com/rest/v1.1/sites/98941271/">
    
    <!-- defind the type and query parameters in data-api-options -->
    <div data-api-collection="posts" data-api-options="number=2"></div>
    
    <!-- when fetch 1 post must provide the post id -->
    <!-- if not, you can define a search critria in the data-api-options-->
    <div data-api-single="page/4" data-api-options="search=schedule">
    <script src="./main.js"></script>
    </body>

```

###Question:
---------
-  what about accessibility
-  what about SEO

###Support:
--------
IE8+

WordPress official API 
[Documentaion](https://developer.wordpress.com/docs/api/)



###Todo:
-----

- Improve template string for the WordPress post and page

Render more fields, ex, customize return fields(now only return title and content)

- Implement get content from more than 1 source  (wordpress, joomla, etc)


