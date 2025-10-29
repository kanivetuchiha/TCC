para iniciar o projeto no navegador abra dois terminais. no primeiro digite o caminho do projeto mais /back,
depois inicie com npm run dev.
no segundo terminal insira o caminho do projeto mais /front e dê npm run dev e click no link fornecido.
para que a API funcione corretamente abra o arquivo TCC/back/constrollers/controllers.js e altere o seguinte codigo entre as linhas 9 e 15: 
const pool = new Pool({
  user: "/*seu usuario*/",
  host: "localhost",
  database: "fazenda",
  password: "/*sua senha*/",
  port: /*sua porta*/,
});

PS:é nescessario instalar o postgreSQL e o pgadmin para criar o banco de dados

após isso abra o pgadmin e crie o seguinte banco com a seguinte tabela:

create database fazenda

use fazenda

create table bois(
    boi_id serial primary key,
    codigo_uni varchar,
    peso numeric (10,2),
    tipo varchar,
    pelagem varchar,
    raca varchar
    posicao int,
    foto bytea 
)

terminado esse ultimo passo o site esta pronto para uso :)