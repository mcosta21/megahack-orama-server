# MEGA HACK #5 - Desafio Órama - Server

Essa é o backend do [aplicativo](https://github.com/mcosta21/megahack-orama-mobile) desenvolvido durante a 5º edição do Mega Hack.

Foi desenvolvido utilizando NodeJS com Express e seu principal objetivo é de lidar com investimentos de usuários.

## Sobre o projeto
Esse projeto foi desenvolvido durante a 5ª edição do [Mega Hack](https://www.megahack.com.br) para o desafio da Órama.

## Tente você mesmo
### Pré-requisitos
Para rodar este projeto você precisará ter instalado o [NodeJS](https://nodejs.org/en/).

### Instalar
#### Clonar o repositório
```
# Clone o repositório
$ git clone https://github.com/mcosta21/megahack-orama-server

# Acesse a pasta
$ cd megahack-orama-server

# Instale as dependências
$ npm install or yarn

# Inicie o servidor
$ npm start ou yarn start
```

## Rotas
O servidor está configurado para se comunicar pela porta 3333,
através da rota:
http://localhost:3333/

- Buscar por um usuário

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /users/:userId| `GET`  |-|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `"id": 1,`<br />`"firstName": "Victor",`<br />`"lastName": "Ladeira",`<br />`"email": "victorladeirag@gmail.com",`<br />`"yieldReceived": 50`<br />`}`

- Buscar por todos os usuários

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /users/| `GET`  |-|**Code:** 200 - OK<br />**Content:** <br />`[`<br/>`{`<br /> `"id": 1,`<br />`"firstName": "Victor",`<br />`"lastName": "Ladeira",`<br />`"email": "victorladeirag@gmail.com",`<br />`"yieldReceived": 50`<br />`}`<br /> `]`

- Criar um usuário

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /users/| `POST`  |`{`<br />`"firstName": "Marcio",`<br />`"lastName": "Costa",`<br />`"email": "mcosta21@gmail.com",`<br />`"password": 123123,`<br />`"passwordConfirmation": 123123`<br />`}`|**Code:** 201 - Created<br />**Content:** <br />`{`<br /> `"id": 2,`<br />`"firstName": "Marcio",`<br />`"lastName": "Costa",`<br />`"email": "mcosta21@gmail.com",`<br />`"yieldReceived": 0`<br />`}`<br />

- Logar um usuário

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /auth/| `POST`  |`{`<br />`"email": "victorladeirag@gmail.com",`<br />`"password": "123123",`<br />`}`|**Code:** 201 - Created<br />**Content:** <br />`{`<br /> `"id": 1,`<br />`"firstName": "Victor",`<br />`"lastName": "Ladeira",`<br />`"email": "victorladeirag@gmail.com",`<br />`"yieldReceived": 50`<br />`"token": "iuehqwnuin2189321kjnsdniksjd912"`<br />``}`<br />

- Atualizar um usuário

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /users/| `PUT`  |`{`<br />`"newFirstName": "Thiago",`<br />`"NewLastName": "Goulart",`<br />`"newEmail": "tgoulart@gmail.com",`<br />`"newPassword": 123456,`<br />`"newYieldReceived": 42`<br />`}`|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `"id": 2,`<br />`"firstName": "Thiago",`<br />`"lastName": "Goulart",`<br />`"email": "tgoulart@gmail.com",`<br />`"yieldReceived": 42`<br />`}`<br />

- Remover um usuário

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /users/| `DELETE`  |`-`|**Code:** 202 - Accepted<br />**Content:** <br />`{`<br /> `"id": 2,`<br />`"message": "Usuário Removido`<br />`}`<br />

- Buscar por uma categoria

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /categories/:id| `GET`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `"id": 1,`<br />`"name": "Tesouro Direto"`<br />`}`<br />

- Buscar por todas as categorias

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /categories/| `GET`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`[`<br />`{`<br /> `"id": 1,`<br />`"name": "Poupança"`<br />`},`<br />`{`<br /> `"id": 2,`<br />`"name": "Tesouro Direto"`<br />`}`<br />`]`<br/>

- Criar uma categoria

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /categories/| `POST`  |`{`<br/>`"name": "Ofertas públicas" `<br/>`}`|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `"id": 3,`<br />`"name": "Ofertas públicas"`<br />`}`<br />

- Atualizar uma categoria

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /categories/| `PUT`  |`{`<br/>`"categoryId": 3,`<br/>`"name": "Ofertas Públicas" `<br/>`}`|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `"id": 3,`<br />`"name": "Ofertas Públicas"`<br />`}`<br />

- Remover uma categoria

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /categories/:categoryId| `DELETE`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `"message": "Categoria removida."`<br />`}`<br />

- Buscar por uma série

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /series/:id| `GET`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `"id": 1,`<br />`"cost": 200,`<br />`"yield": 10,`<br /> `"duration": 2,`<br/>`"description": "Meu Precioso",`<br />`"description": "Invista no Tesouro Direto com segurança",`<br />`"category": {` <br/> `"id": 2,`<br/>`"name": "Tesouro Direto"`<br />`}`<br /> `}` <br/>

- Buscar por todas as séries

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /series/| `GET`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`[`<br/>`{`<br /> `"id": 1,`<br />`"cost": 200,`<br />`"yield": 10,`<br /> `"duration": 2,`<br/>`"description": "Meu Precioso",`<br />`"description": "Invista no Tesouro Direto com segurança",`<br />`"category": {` <br/> `"id": 2,`<br/>`"name": "Tesouro Direto"`<br />`}`<br /> `}` <br/>`]`<br/>

- Buscar por todas as séries de uma categoria

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /series/category/:id| `GET`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`[`<br/>`{`<br /> `"id": 1,`<br />`"cost": 200,`<br />`"yield": 10,`<br />`"duration": 2,`<br/>`"description": "Meu Precioso",`<br />`"description": "Invista no Tesouro Direto com segurança",`<br />`"category": {` <br/> `"id": 2,`<br/>`"name": "Tesouro Direto"`<br />`}`<br /> `}` <br/>`]`<br/>

- Criar uma série

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /series/| `POST`  |`{`<br/>`"cost": 200,`<br />`"yield": 10,`<br />`"duration": 2,`<br />`"title": "Meu Precioso",`<br />`"description": "Invista no Tesouro Direto com segurança",`<br />`"categoryId": 2`<br />`}`|**Code:** 201 - CREATED<br />**Content:** <br />`{`<br />`"cost": 200,`<br />`"yield": 10,`<br />`"duration": 2,`<br/>`"title": "Meu Precioso",`<br />`"description": "Invista no Tesouro Direto com segurança",`<br />`"category": {` <br/> `"id": 2,`<br/>`"name": "Tesouro Direto"`<br />`}`<br /> `}` <br/>

- Atualizar uma série

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /series/| `PUT`  |`{`<br/>`"serieId": 1,`<br />`"newCost": 1000,`<br />`"newYield": 15,`<br />`"newDuration": 180,`<br />`"newTitle": "Eu sou o Homem de Ferro",`<br />`"newDescription": "Invista na poupança agora mesmo"`<br />`"newCategoryId": 1`<br />`}`|**Code:** 200 - OK<br />**Content:** <br />`{`<br />`"id": 1,`<br/>`"cost": 1000,`<br />`"yield": 15,`<br /> `"duration": 180,`<br/>`"title": "Eu sou o Homem de Ferro",`<br />`"description": "Invista na poupança agora mesmo",`<br />`"category": {` <br/> `"id": 1,`<br/>`"name": "Poupança"`<br />`}`<br /> `}` <br/>

- Remover uma série

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /series/:serieId| `DELETE`  |`-`|**Code:** 202 - Accepted<br />**Content:** <br />`{`<br /> `"message": "Série removida."`<br />`}`<br />

- Buscar por amigos

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /friends/| `GET`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`[`<br />`{`<br /> `"id": 2,`<br/> `"firstName": "Marcio"`<br/>`"lastName": "Costa",` <br/>`}`<br/>`]`<br />

- Criar uma amizade

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /friends/| `POST`  |<br />`{`<br /> `"friendId": 2`<br/>`}`<br/>|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `"message": "Amizade criada"`<br/>`}`<br/>

- Remover um amigo

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /friends/:friendId| `DELETE`  |`-`|**Code:** 202 - Accepted<br />**Content:** <br />`{`<br /> `"message": "Amigo removido."`<br/>`}`<br/>

- Buscar por investimentos

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /series/| `GET`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`[`<br />`{`<br /> `"serie": {`<br />`"id": 2,`<br/> `"title": "test"`<br/>`"id": 1,` <br/> `"startDate": "2020-11-15",` <br/> `"expirationDate": "2020-11-25,"`<br/> `"private": 0`<br/>`]`<br />

- Criar um investimento

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /investments/| `POST`  |`{`<br/>`"expirationDate": "2021-10-11",`<br/>`"privateBool": false, `<br/>`"serieId": 1 `<br/>`}`|**Code:** 201 - Created<br />**Content:** <br />`{`<br /> `"serie": {`<br /> `"id": 1,` <br/> `"title": "Meu Precioso,"`<br/>`}`<br />`"id": 1,` <br/> `"expirationDate": "2020-11-25",` <br/> `"private": false` <br/> `}`<br />

- Remover um investimento

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /invesments/:id| `DELETE`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `"message": "Investimento removido."`<br/>`}`<br/>

- Buscar por um post

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /posts/:id| `GET`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `"id": 1,`<br/> `"datePost": "2020-11-15"` <br/> `"title": "Meu primeiro investimento"` <br/> `"description": "Estou muito feliz por começar a investir"` <br/>`}`<br/>

- Buscar por posts dos amigos

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /posts/| `GET`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`[`<br/>`{`<br /> `"user": {`<br/> `"id": 4` <br/> `"firstName": "Joelma"` <br/> `"lastName": "Duarte"` <br/>`},`<br/> `"investments": [`<br/>`"serie": {`<br/>`"id": 1,`<br/>`"title": "Meu Precioso"`<br/> `"description": "Invista no Tesouro Direto com segurança"`<br/> `"category": 2`<br/>`}`<br/>`]`<br/> `]`

- Criar um post   

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /posts/| `POST`  |`{`<br/>`"title": "Comecei",`<br/>`"description": "Estou investindo agora!", `<br/>`"investmentId": 1 `<br/>`}`|**Code:** 201 - Created<br />**Content:** <br />`{`<br /> `"id": 3,`<br /> `"datePost": "2020-12-12",` <br/> `"title": "Meu Precioso,"`<br />`"description": "Estou investindo agora!",` <br/> `"investmentId": 1,` <br/> `"userId": 2` <br/> `}`<br />

- Remover um post

| Endpoint | Método | Corpo | Resposta |
|--|--|--|--|
| /posts/:id| `DELETE`  |`-`|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `"message": "Post removido."`<br/>`}`<br/>

