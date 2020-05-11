# Authentication API server bolilerplate

## [Prisma 2](https://www.prisma.io/) & [TypeGraphQL](https://typegraphql.com/) & GraphQL-Yoga server

Authentication API boilerplate with TypeGraphQL, Prisma 2 and MySQL(docker container). Auto-generated GraphQL schema and resolvers.

- [x] Typescrip
- [x] PRISMA 2: Type-safe ORM (support Type-safe model, generate schema)
- [x] TypeGraphQL: Code-first development, Support Custom SDL, Support Custom Resolvers
- [x] GraphQL-Yoga: Support various middlewares such as (`graphql-shield`)

### [TypeGraphQL](https://typegraphql.com/)

Use only classes and decorators to define your GraphQL schema. No need to define types in SDL and no need to create interfaces for them!

This way you will have only one source of truth, so say goodbye to all field type mismatches, typos and annoying refactoring.

## Motivation

- Next generation ORM is PRISMA 2: Prisma 2는 버전1에서의 서버를 만들고 deploy하지 않아도 되도록 smart node module을 사용하여 내부의 client를 가질 수 있어 확장하기 매우 편해졌으나 GraphQL서버를 만들기 위해 resolver함수들을 제작해야 함. `nexus-prisma`
- [nexus-graphql vs typegraphql 비교](https://medium.com/novvum/typegraphql-and-graphql-nexus-a-look-at-code-first-apis-7728f26d7e0d)
- Prisma 공식 예제는 `nexsus-prisma`를 도입, `typegraphql` 예제도 있음. 하지만 Code-first 개발로 Resolver함수들을 모두 만들어 주어야 함
- TypeGraphQL 베타 버전과 Prisma 2 베타 버전이 서로 보완이 됨: 즉 Prisma 1 과 같은 자동생성 코드를 얻을 수 있음
- Prisma 모델 스키마를 작성하여 Generate 하면 자동으로 GraphQL 스키마, GraphQL 리졸버(CRUD, Inputs, Outputs, Relations)를 생성함
- 필요시 추가 커스텀 Resolver 생성 가능
- Prisma 마이그레이션을 통해 추가 기획에 대한 빠른 대응 가능
- Typescript를 사용하여 Type-safe한 안정적인 서버 운영 가능

## 테스트용 DB 설정

- MySQL (docker image)
- `root`, `testdb`
- MySQL 데이터 위치 `./dbdata` => Docker 실행되면 생성되는 볼륨 (Persistence to local disk)

### Getting started

#### Installation

- docker-compose [installation](https://docs.docker.com/compose/install/)

#### Setup docker container

- 컨테이너 그룹 실행

```bash
docker-compose up -d
```

- 컨테이너 그룹 중지

```bash
docker-compose down
```

- 인스턴스 로그 확인

```bash
docker-compose logs
```

- DB Log

```bash
docker-compose logs db
```

#### Run Server

```bash
npm start
```

### MySQL console 접속

- 컨테이너 shell 접속

```bash
docker-compose exec db bash
```

- 컨테이너의 MySQL daemon 접속

```bash
docker-compose exec db mysql -uroot -ptestdb
```

or

```bash
npm run mysql
```

## PRISMA Schema

- [PSL(Prisma Schema Language)](https://github.com/prisma/specs/tree/master/schema)

`prisma/schema.prisma`

- PRISMA 설정 / 제너레이터 설정 (MySQL DB, Prisma 클라이언트 생성, TypeGraphQL 제너레이터 생성)

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

generator typegraphql {
  provider = "node_modules/typegraphql-prisma/generator.js"
  output   = "../prisma/generated/type-graphql"
}
```

- 테스트 데이터 모델

```prisma

model Post {
  id        Int     @default(autoincrement()) @id
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}

model User {
  id       Int     @default(autoincrement()) @id
  email    String  @unique
  password String  @default("")
  name     String?
  posts    Post[]
}

model Test {
  id   Int    @default(autoincrement()) @id
  test String @unique
  img  Url[]
}

model Url {
  id     Int    @default(autoincrement()) @id
  url    String
  test   Test?  @relation(fields: [testId], references: [id])
  testId Int?
}
```

## PRISMA 2 Migrate 실행 (Dev)

### Development

- edit `.env.dev`: 개발 모드 환경 설정
- 최초 실행

```bash
npm run dev:migrate
```

- 업데이트 Migration

```bash
npm run dev:migrateup
```

### Production

- edit `.env.prod`: 배포 모드 환경 설정

AWS RDS에 Migration 하는 경우 `npm run prod:migrate`, `npm run prod:migrateup`

## PRISMA 2 \& TypeGraphQL Client Generate

```bash
npm run generate
```
