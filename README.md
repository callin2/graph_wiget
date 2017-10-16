# examples https://callin2.github.io/graph_wiget/

# graph_wiget

# prerequisite
1. install node.js
2. install chrome browser

# build
1. `npm install`
2. `npm run build`

# run
1. `npm start`

# document
1. `npm run docs`


# uml test
```dot
@startuml
[*] --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]
@enduml
```


```uml
@startuml
[*] --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]
@enduml
```