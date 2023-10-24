// Test data
// MATCH (n) DETACH DELETE n;

CREATE
(a415:Alcohol {dbid: 415, title:"베리와인1168 애플로제 와인"}),
(a416:Alcohol {dbid: 416, title:"베리와인1168 애플와인"}),
(a329:Alcohol {dbid: 329, title:"고도리 복숭아 와인"}),
(a450:Alcohol {dbid: 450, title:"N와인 사과"}),
(a451:Alcohol {dbid: 451, title:"N와인 샤인"}),
(a460:Alcohol {dbid: 460, title:"추사 애플와인"}),
(a339:Alcohol {dbid: 339, title:"금이산 복숭아 와인"}),

(t0:Tag {title:"사과"}),
(t1:Tag {title:"애플"}),
(t2:Tag {title:"복숭아"}),
(t3:Tag {title:"와인"}),
(t4:Tag {title:"로제"}),

(g1:TagGroup {title:"Fruit"}),
(g2:TagGroup {title:"Category"}),

(t0)-[:RELATED {weight: 10}]->(t1),

(t0)-[:INCLUDED]->(g1),
(t1)-[:INCLUDED]->(g1),
(t2)-[:INCLUDED]->(g1),

(t3)-[:INCLUDED]->(g2),
(t4)-[:INCLUDED]->(g2),

(a415)-[:LINKED {weight: 10}]->(t1),
(a415)-[:LINKED {weight: 10}]->(t3),
(a415)-[:LINKED {weight: 10}]->(t4),

(a416)-[:LINKED {weight: 10}]->(t1),
(a416)-[:LINKED {weight: 10}]->(t3),

(a329)-[:LINKED {weight: 10}]->(t2),
(a329)-[:LINKED {weight: 10}]->(t3),

(a450)-[:LINKED {weight: 10}]->(t0),
(a450)-[:LINKED {weight: 10}]->(t3),

(a451)-[:LINKED {weight: 10}]->(t3),

(a460)-[:LINKED {weight: 10}]->(t3),
(a460)-[:LINKED {weight: 10}]->(t1),

(a339)-[:LINKED {weight: 10}]->(t2),
(a339)-[:LINKED {weight: 10}]->(t3);
