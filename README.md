# NLW HEAT

# Sobre o TS

Instalamos o typescript como dependência de desenvolvimento com o yarn (dá quase na mesma com o npm) usando o comando `yarn add -D typescript`

Usamos `yarn tsc --init` para conseguir nosso tsconfig prontinho e só alteramos a versão para qual os arquivos typescript são compilados. Nessa caso vamos usar o es2017, afinal não temos que nos preocupar com suporte em browser pois estamos criando um projeto node. Mudamos também o modo strict para false pois já estamos usando o typescript etc e tal.

# Sobre os tipos

A maioria das bibliotecas e frameworks oferecem os tipos em um pacote separado. Felizmente costumam seguir um padrão: `@types/pacote`. Assim como o typescript, queremos instalar esses tipos apenas como dependência de desenvolvimento, então usamos `yarn add -D @types/pacote`.

# Sobre a autenticação com o github

## Conseguindo permissão para autenticar usuários com gh

É extremamente simples. Nós podemos permitir a autenticação com o github facilmente.

- Primeiramente precisamos criar uma nova aplicação no nosso [painel do github](https://github.com/settings/developers) na parte de OAuth Apps.
- Inserimos então duas URLs: Uma da rota raiz do app e outra para onde o github vai redirecionar o usuário (callback url)

## Utilizando a autenticação

Precisamos do ID e da chave que o github nos dá quando criamos nosso app no painel:

- GITHUB_CLIENT_SECRET
- GITHUB_CLIENT_ID

Nunca deixe o segredo seco no código e também não coloque isso num repositório público. Use um ".env" para guardar os segredos e um ".gitignore" para dizer ao git não rastrear o arquivo ".env".

Então... O usuário acessa uma rota na nossa aplicação, ai redirecionamos ele para a rota do github.

`/login` **>** `http://github.com/login/oauth/authorize?client_id=GITHUB_CLIENT_ID`

Quando acessamos essa rota ai o nosso usuário é jogado de volta naquela rota de callback com o parametro na url chamado "code", pegamos esse code e passamos para uma outra url:

`http://github.com/login/oauth/access_token` que tem parametros como o client id, o client secret e também o código do usuário que recebemos na url anteriormente.

Fazendo uma requisição para essa url conseguimos de volta o token para acessar os dados do usuário pelo link da api, passando o token no header de autorização.

`https://api.github.com/user`

# Prisma
O prisma é um ORM que faz tanta magia que chega me assusta. Ele é o responsável por cuidar do banco de dados pra gente. Na raiz do nosso projeto há uma pasta prisma com um arquivo schema.prisma que usamos para configurar nosso banco de dados.

## Migrations
Migrations do prisma são ainda mais mágicas e criam o UP/DOWN com magia mágica extra. 

Criamos uma migration com `yarn prisma migrate dev` e depois damos um nome pra ela no prompt que aparece. 

## Prisma client
Para obter conexão com nosso banco usamos o prisma client.

