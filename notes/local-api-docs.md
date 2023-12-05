# Local API

- 공통: /\_local/
- 외부에서 접근 불가능하게 설정

## POST /\_local/alcohol-update

연결된 main mysql database의 주류 목록에서 현재의 neo4j database를 업데이트함

ID에 종속적으로 진행하며, 현재는 타이틀만 가져옴

지금은 검색시 mysql 테이블에 의존하지 않도록 검색결과 인덱싱과 동일한 데이터를 가지게 함

## POST /\_local/add-tag

태그 추가

이미 존재하는 주류에 태그를 연결한다.

연결하려는 태그가 없는 경우, 새로 만든다.

이미 연결된 상태인 경우, weight를 추가한다.

### req body

```js
{
  password: string, // 외부 공개용 임시
  alcId: int, // alcohol database id
  tags: [
    {
        title: string,
        weight: int, // 0 is default
    }, ...
  ], // list of tags
}
```

### 200

성공시

### 403

패스워드 틀린 경우

### 404

alcId에 해당하는 주류 데이터가 없는 경우
