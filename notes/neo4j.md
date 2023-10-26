# neo4j

- http 접속 포트 7474

  - ex: http://localhost:7474

- bolt 접속 포트 7687

  - ex: bolt://localhost:7687
  - ex2: neo4j://localhost:7687

  - 관련 정보는 https://neo4j.com/docs/driver-manual/4.0/client-applications/#driver-configuration-examples 참고

## .env 주의사항

아무래도 NEO4J로 시작하는 .env 내의 키들은 다 neo4j 실행하면서 들어가는거같음

NEO4J_URI라고 해서 넣었었는데 겹치는건지 뭔지 해서 안됨

주의하도록 하자

## .env 주의사항 2

데이터베이스 접근용 패스워드는 처음 생성시 (.data 생성시)에만 수정된다.

백날 NEO4J_AUTH만 바꿔놓고 왜안되는거지 하지 말자.

# 쿼리 언어

동일 폴더의 [cypher.md](cypher.md) 확인
