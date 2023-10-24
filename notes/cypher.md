# cypher란

neo4j를 사용하기 위한 쿼리 언어,

graph database를 다루는데 좀더 특화된거같음

[공식 neo4j Manual](https://neo4j.com/docs/cypher-manual/current/introduction/)

# CREATE

```cypher
CREATE (ee:Person {name: 'Emil', from: 'Sweden', kloutScore: 99});
```

- CREATE : 노드 생성
- () : 노드 하나의 의미를 가진다
- ee:Person 노드 라벨로 Person 가지는 노드 -> ee라는 노드 변수에 넣음
- {} : 해당 노드의 내용물(property)을 정의

# MATCH

```cypher
MATCH (ee:Person) WHERE ee.name = 'Emil' RETURN ee;
```

- MATCH : 노드의 패턴을 찾아낸다
- (ee:Person) : Person 라벨의 노드를 ee 변수에 넣는다
- WHERE : 노드 조건문 필터링
- ee.name = 'Emil' : 해당 ee 노드의 name property가 'Emil'과 동일한지
- RETURN : 결과물을 리턴, 노드 자체를 리턴하는 경우 그래프로 볼 수 있다

# RELATION CREATE

```cypher
// 위에서 만든 Emil 노드를 가져와 ee에 넣음
MATCH (ee:Person) WHERE ee.name = 'Emil'

// 여러 노드를 한번에 생성, 각각을 변수로 만듬
CREATE (js:Person { name: 'Johan', from: 'Sweden', learn: 'surfing' }),
(ir:Person { name: 'Ian', from: 'England', title: 'author' }),
(rvb:Person { name: 'Rik', from: 'Belgium', pet: 'Orval' }),
(ally:Person { name: 'Allison', from: 'California', hobby: 'surfing' }),

// 관계 생성 부분, 위의 CREATE의 영향이 계속 들어오는 상태로 이해하면 됨
(ee)-[:KNOWS {since: 2001}]->(js),(ee)-[:KNOWS {rating: 5}]->(ir),
(js)-[:KNOWS]->(ir),(js)-[:KNOWS]->(rvb),
(ir)-[:KNOWS]->(js),(ir)-[:KNOWS]->(ally),
(rvb)-[:KNOWS]->(ally)
```

- -[:KNOWS]- : 링크를 표시함, 양쪽 다 화살표가 없는경우 undirected하게 찾는다
    - 단, CREATE할때는 반드시 directed하게 넣어야 한다 ex: (a)-[:KNOWS]->(b)
    - 링크에도 {}를 통해 정보를 입력할 수 있다. 위 예시 참고

# DB Clear

```cypher
MATCH (n) DETACH DELETE n
```

# CONSTRAINT

```cypher
CREATE CONSTRAINT FOR (n:Movie) REQUIRE (n.title) IS UNIQUE
```

CREATE CONSTRAINT를 통해 필수 프로퍼티를 지정할 수 있다.  
위의 예시는 Movie 라벨의 노드는 반드시 title 프로퍼티가 필요하고, 이는 UNIQUE해야한다는 제약을 넣는다.

```cypher
// 만든 제약들을 확인한다
SHOW CONSTRAINTS

// 제약을 삭제한다
DROP CONSTRAINT constraintname
```

# INDEX

```cypher
CREATE INDEX FOR (m:Movie) ON (m.released)
```

CREATE INDEX를 통해 index를 만들 수 있다.  
위의 예시는 Movie노드의 released 프로퍼티에 대해 인덱스를 만드는 모습이다.

```cypher
// 만든 index들을 확인한다
SHOW INDEXES

// index를 삭제한다
DROP INDEX indexName
```

# MERGE

MATCH와 CREATE를 섞은 느낌, 조건에 부합하는 노드가 없는경우 만들어서 리턴함

```cypher
MERGE (keanu:Person {name: 'Keanu Reeves'})
ON CREATE
  SET keanu.created = timestamp()
ON MATCH
  SET keanu.lastSeen = timestamp()
RETURN keanu.name, keanu.created, keanu.lastSeen
```

실제 생성시나 매치시 등의 작업을 할 수 있음

# 다른 팁들

## Kevin Bacon에서 4 hop 안에 갈수있는 노드

```cypher
MATCH (bacon:Person {name:"Kevin Bacon"})-[*1..4]-(hollywood)
RETURN DISTINCT hollywood
```

RETURN DISTINCT는 Unique한 결과만 가져오라는 뜻

https://neo4j.com/docs/cypher-manual/current/clauses/return/#return-unique-results

## Shortest Path

```cypher
MATCH p=shortestPath(
(bacon:Person {name:"Kevin Bacon"})-[*]-(meg:Person {name:"Meg Ryan"})
)
RETURN p
```

shortestPath() 함수를 이용해 최단경로를 찾을 수 있음  
단, 가는데 방향은 없는 점 유의
