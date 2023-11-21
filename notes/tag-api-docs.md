# Tag API

- 공통: /tag/

## GET /tag/byalc/:alcId

alcId에 해당하는 주류와 LINKED 관계의 태그들을 가져온다

### 200

```js
{
    data: [
        {
            title: string, // tag title
            weight: int, // weight of this tag
        }, ...
    ],
    count: int // count of data
}
```

### 404

alcId에 해당하는 주류가 없는 경우

```js
{
    data: [],
    count: 0,
    err: string // err message with English
}
```

## GET /tag/bytag/:tagTitle

tagTitle에 해당하는 태그와 LINKED 관계의 주류를 가져오고,  
그 주류와 LINKED된 다른 tag들도 가져온다.

### 200

```js
{
    data: [
        {
            id: int, // id of alcohol
            alcohol: string, // title of alcohol
            weight: int, // weight of input tag with alcohol
            otherTags: [
                {
                    title: string, // title of other tag
                    weight: int, // weight with alcohol and this tag
                }, ...
            ]
        }, ...
    ],
    count: int // count of data
}
```

### 404

tagTitle에 해당하는 태그가 없는 경우

```js
{
    data: [],
    count: 0,
    err: string // err message with English
}
```
