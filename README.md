# LibQuality Backend
Busque por métricas e histórico de repositórios do GitHub

## Referência das rotas

### Issues:
* Métricas das issues: `GET /issues?owner=<repo_owner>&repo=<repo_name>&user=<username>`

### Histórico de métricas:
* Obter histórico diário de métricas: `GET /issues?owner=<repo_owner>&repo=<repo_name>&user=<username>`
* Adicionar repositório para ser monitorado: `POST /history/repo?owner=<repo_owner>&repo=<repo_name>`
* Remover repositório do histórico: `DELETE /history/repo?owner=<repo_owner>&repo=<repo_name>`

## Arquitetura
Imagem da arquitetura e dependências importantes

## Execução
Premissa: é necessário ter instalado docker

Faça a instalação de dependências
`yarn`

Crie um arquivo com nome `.env` e o preencha seguindo o padrão que pode ser encontrado no arquivo `.sample.env`

### Desenvolvimento:
Inicie o banco de dados
`docker-compose -f docker-compose.dev.yml up`

Execute as migrations para criar as tabelas no banco
`yarn migrate:dev`

Inicie a aplicação do backend
`yarn start`

### Deploy em produção:
Faça o buid da imagem node de acordo com o Dockerfile e envie a imagem para o servidor de deploy
`docker build -t lib_quality_node .`

Caso seja ao primeiro deploy, no servidor, crie o volume docker externo
`docker volume create --name=postgres_db`

Inicie os serviços da aplicação
`docker-compose up`

Caso seja ao primeiro deploy, execute as migrations para criar as tabelas no banco
`yarn migrate`

Se deseja alterar o nome do build da imagem ou do volume do banco faça também a mudança no arquivo `docker-compose.yml`

## Testes