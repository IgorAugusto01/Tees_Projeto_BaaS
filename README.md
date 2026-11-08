# Tees_Projeto_BaaS
Projeto BaaS da disciplina Tópicos Especiais em Engenharia de Software
## To-Do List — Comparação entre Backend Tradicional e Firebase 

## 1. Sobre o projeto

Este projeto consiste em uma aplicação de gerenciamento de tarefas (To-Do List), desenvolvida com o objetivo de comparar duas abordagens de desenvolvimento de aplicações web:

- **Backend tradicional:** React no frontend, Python com FastAPI no backend e MySQL como banco de dados.
- **Backend como serviço (BaaS):** React integrado diretamente ao Firebase, utilizando Firebase Authentication e Cloud Firestore.

A aplicação possui uma interface compartilhada entre as duas implementações, permitindo selecionar qual abordagem será utilizada ao iniciar o sistema.

## 2. Tecnologias utilizadas

### Frontend
- React
- TypeScript
- Vite
- Axios
- Firebase SDK

### Backend tradicional
- Python 3.13
- FastAPI
- Uvicorn
- MySQL
- JWT para autenticação

### Backend Firebase
- Firebase Authentication
- Cloud Firestore

## 3. Pré-requisitos

Antes de iniciar o projeto, é necessário instalar:

| Tecnologia | Finalidade |
|---|---|
| Node.js | Execução do frontend React e gerenciamento de dependências com npm. |
| Python 3.13 | Execução do backend FastAPI. |
| MySQL Server | Banco de dados utilizado pelo backend tradicional. |
| MySQL Workbench (opcional) | Interface gráfica para administrar o banco de dados. |

**Importante:** Os arquivos `.bat` do projeto devem ser executados pelo Prompt de Comando (CMD) do Windows.

Não é necessário instalar manualmente as dependências do React ou Python, pois isso será realizado pelo script de instalação.

## 4. Configuração do banco de dados MySQL

Antes de executar o projeto, é necessário criar o banco de dados e suas respectivas tabelas.

### 4.1. Criar o banco de dados

Acesse o MySQL Workbench ou outro cliente MySQL e execute:

```sql
CREATE DATABASE todo_list;

USE todo_list;
```

### 4.2. Criar a tabela users

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3. Criar a tabela tasks

```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    completed TINYINT(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

A tabela `tasks` possui um relacionamento com a tabela `users`, permitindo associar cada tarefa ao usuário responsável.

## 5. Configuração do arquivo .env

Dentro da pasta `backend`, crie um arquivo chamado `.env`.

Esse arquivo contém as configurações de conexão com o banco de dados e os parâmetros de autenticação JWT.

Utilize o seguinte modelo:

```env
# Configurações do MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=todo_list

# Configurações JWT
SECRET_KEY=chave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Atenção:**

- `DB_USER`: informe o usuário configurado no seu MySQL.
- `DB_PASSWORD`: informe a senha definida durante a instalação do MySQL.
- `DB_NAME`: mantenha `todo_list`, conforme o banco criado anteriormente.
- `SECRET_KEY`: substitua o valor de exemplo por uma chave secreta própria e segura.

O arquivo `.env` contém informações privadas e não deve ser enviado ao GitHub.

## 6. Instalação das dependências

Após concluir os pré-requisitos e as configurações do banco de dados, acesse a pasta raiz do projeto pelo CMD.

Execute o arquivo:

```cmd
setup.bat
```

O script será responsável por:

1. Verificar a instalação do Python 3.13.
2. Criar o ambiente virtual Python (`.venv`) dentro da pasta `backend`.
3. Atualizar o gerenciador de pacotes pip.
4. Instalar as dependências Python especificadas no `requirements.txt`.
5. Instalar as dependências do frontend utilizando `npm install`.

A instalação precisa ser realizada apenas na primeira execução ou quando houver alterações nas dependências do projeto.

## 7. Executar o projeto

Após a instalação das dependências, execute pelo CMD, na pasta raiz do projeto:

```cmd
run.bat
```

O script abrirá automaticamente dois terminais independentes:

| Terminal | Descrição |
|---|---|
| Backend - FastAPI | Ativa o ambiente virtual `.venv` e inicia o servidor FastAPI utilizando Uvicorn. |
| Frontend - React | Inicia o servidor de desenvolvimento do React utilizando Vite. |

Os dois servidores funcionarão simultaneamente.

Para encerrar a aplicação, basta fechar os respectivos terminais.

## 8. Estrutura geral do projeto

```text
APP-TO-DO-list/
│
├── backend/
│   ├── .venv/
│   ├── app/
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── setup.bat
├── run.bat
└── README.md
```

## 9. Observações importantes

- O MySQL Server precisa estar instalado e em execução para utilizar a opção de backend tradicional.
- O Firebase possui sua própria configuração e não depende do banco MySQL.
- O arquivo `.env` é utilizado pelo backend tradicional.
- O ambiente virtual `.venv` é criado automaticamente pelo `setup.bat`.
- Não é necessário ativar manualmente o ambiente virtual para executar o projeto por meio do `run.bat`.
- Não compartilhe arquivos `.env`, senhas ou chaves privadas no repositório.

## 10. Objetivo da comparação

O projeto permite observar, na prática, as diferenças entre uma arquitetura tradicional, na qual o desenvolvedor administra o backend e o banco de dados, e uma arquitetura BaaS, na qual serviços gerenciados oferecem funcionalidades como autenticação e armazenamento de dados.

Ambas as abordagens utilizam a mesma interface e oferecem funcionalidades equivalentes de cadastro, autenticação e gerenciamento de tarefas.