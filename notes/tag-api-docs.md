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

검색시의 response와 최대한 동일하게 유지하도록 한다. -> 카드에 들어갈 데이터 폼 통일

해당 alcohol node에서 weight가 높은 순서대로 가져온다

pagination 적용되어있음 (default: size = 10, page = 0)

### query

- size: 한 페이지의 노드 개수
- page: 페이지 번호, zero-based

- example  
  `/tag/bytag/와인?page=2&size=5`

### 200

```js
{
    data: [
        {
            score: int, // weight of input tag with alcohol
            id: int, // id of alcohol
            title: string,
            category: string,
            degree: float,
            image: string,
            tags: [string] // list of tag titles (검색한 tag 제외)
        }, ...
    ],
    count: int, // count of data
    page: int, // page
    size: int, // size for page
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
