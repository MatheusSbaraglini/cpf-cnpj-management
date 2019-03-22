Esse é um projeto responsável pelo cadastramento de usuários e seus CPF's/CNPJ's.

Foi desenvolvido em nodejs no backend com armazenamento no mongoDB e vuejs + bootstrap-vue no frontend.

Para o backend é possível acessar os endpoints responsáveis pela listagem, criação, edição e remoção desses usuários.

# Instalação

Primeiramente é necessário baixar o código fonte:
```sh
git clone https://github.com/MatheusSbaraglini/cpf-cnpj-management.git
```

Para executá-lo é necessário possuir o nodejs, o docker e o docker-compose instalados, caso não os tenha, é possível encontrá-los em:
    - https://nodejs.org/en/download/ - Nodejs
    - https://www.docker.com/products/docker-desktop - Docker
    - https://docs.docker.com/compose/install/#install-compose - Compose

Depois de possuir todos esses itens instalados e o repositório baixado para a máquina, será criado uma pasta com o nome do projeto, acesse ela:
```sh
cd cpf-cnpj-management/
```

Dentro dessa pasta, possuímos outras duas pastas, a `backend/` e a `frontend/`. 
#### Vamos rodar o backend.
```sh
cd backend/
```
Para testar a aplicação, execute o seguinte comando:
```sh
npm run test
```
Após os testes executarem, e nenhum estiver quebrado, vamos parar a execução da aplicação de testes e buildar o docker para criar as imagens dos serviços responsáveis pelo backend da aplicação, com os seguintes comandos.
```sh
ctrl + c
npm run build
```
Assim que o build das imagens estiver finalizado, já é possivel subir os containeres da aplicação executando o comando a seguir:
```sh
npm run start
```
com isso é possivel acessar o backend da aplicação, que está rodando na porta :3000.

#### Vamos rodar o frontend.
Após todas as etapas serem efetuadas com sucesso, vamos rodar o client da aplicação, para isso, volte para a raíz do projeto e acesse a pasta `frontend/`.
```sh
cd frontend/
```
Assim que estivermos na pasta do frontend, precisamos buildar a imagem responsável por ele, para isso execute:
```sh
npm run buildclient
```
Quando esse processo finalizar, já podemos subir o container que contém o client com o seguinte comando:
```sh
npm run start
```
Com isso é possível acessar a aplicação cliente através da porta :8080.

Na aplicação cliente, possuímos os seguintes paths:
    - `'/', '/home': listagem dos usuários.`
    - `'/status': informações da aplicação.`


# Detalhes dos endpoints

## GET `/api/v1/users` - lista todos usuários.
### Exemplo do response:
        {
            "message": "Sucesso.",
            "users": [
                {
                    "active": true,
                    "_id": "5c94794adce3dfce007f540d",
                    "name": "nome",
                    "cpf": "23555617028",
                    "createdAt": "2019-03-22T05:57:30.051Z",
                    "__v": 0
                },
                {
                    "active": true,
                    "_id": "5c947955dce3dfe7977f540e",
                    "name": "nome1",
                    "cpf": "20490696007",
                    "createdAt": "2019-03-22T05:57:41.233Z",
                    "__v": 0
                }
            ]
        }

## GET `/api/v1/users/:id` - lista um usuário específico pelo seu id.
### Exemplo do response:
        {
            "message": "Sucesso.",
            "user": {
                "active": true,
                "_id": "5c94794adce3dfce007f540d",
                "name": "nome",
                "cnpj": "92693650000188",
                "createdAt": "2019-03-22T05:57:30.051Z",
                "__v": 0
            }
        }
    
## POST `/api/v1/users` - Cria um novo usuário.
### Exemplo do body:
    {
        "name":"nome criado",
        "cpf":"09169323038"
    }
### Exemplo do response:
    {
        "message": "Usuário criado com sucesso.",
        "user": {
            "active": true,
            "_id": "5c947c35dce3df61b97f540f",
            "name": "nome criado",
            "cpf": "09169323038",
            "createdAt": "2019-03-22T06:09:57.860Z",
            "__v": 0
        }
    }

## PUT/PATCH `/api/v1/users/:id` - Altera um usuário específico.
### Exemplo do body:
    {
        "name":"nome alterado",
        "cpf":"09169323038"
    }

### Exemplo do response:
    {
        "message": "Usuário alterado com sucesso.",
        "user": {
            "active": true,
            "_id": "5c947c35dce3df61b97f540f",
            "name": "nome alterado",
            "cpf": "09169323038",
            "createdAt": "2019-03-22T06:09:57.860Z",
            "__v": 0
        }
    }

## DELETE `/api/v1/users/:id` - Remove um usuário.
### Exemplo do response:
    {
        "message": "Usuário removido com sucesso."
    }

## GET `/api/v1/status` - Retorna quantidade de requests efetuados e o uptime do servido.
### Exemplo do response:
    {
        "message": "API status!",
        "requests": 10,
        "uptime": "00:35:10"
    }