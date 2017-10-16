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
@startuml
actor Foo1
boundary Foo2
control Foo3
entity Foo4
database Foo5
collections Foo6
Foo1 -> Foo2 : To boundary
Foo1 -> Foo3 : To control
Foo1 -> Foo4 : To entity
Foo1 -> Foo5 : To database
Foo1 -> Foo6 : To collections

@enduml