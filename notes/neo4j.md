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

# 도커 초기실행시 주의사항

초기에 .data 폴더나 .conf 폴더가 이상한 권한으로 생성될 수 있음

폴더를 만들어도 보고 권한수정도 해봤지만 잘 되지는 않았다.

일단, 환경변수를 넣어서 하는 방식으로 올렸음

https://neo4j.com/docs/operations-manual/current/tutorial/tutorial-clustering-docker/

반드시 초기실행 전 해주자

```bash
# .data, .conf 폴더가 없는경우
mkdir .data .conf

export USER_ID="$(id -u)"
export GROUP_ID="$(id -g)"

docker compose up -d
```

하지만? 꺼졌을때 계속 치기는 귀찮으므로 위의 export들은 alias로 넣어놨음  
최초실행 전에 `mkdir`만 잘해주면 될듯
~/.bashrc 124번줄에 넣어놨음 (후에 누가 변경시 변동될 수 있음주의)

아니면...

https://neo4j.com/developer/kb/running-docker-as-nonroot-user/

위의 링크대로 neo4j 유저를 만들어 연결하는 법이 있다고는 하지만 위의 방법이 간편하다.

# 쿼리 언어

동일 폴더의 [cypher.md](cypher.md) 확인
