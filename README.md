# Sistema de Ponto Eletrônico para Obras

Sistema completo para gerenciamento de ponto eletrônico em obras, com aplicativo mobile para registro de ponto e interface web para administração.

## Configuração do Ambiente

### Pré-requisitos

- Docker e Docker Compose
- Node.js 18+
- Java 17+
- Android Studio (para desenvolvimento mobile)

### Configuração Inicial

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/ponto-eletronico-obra.git
cd ponto-eletronico-obra
```

2. Inicie o banco de dados com Docker:
```bash
docker-compose up -d
```

3. Configure o backend:
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

4. Configure o frontend administrativo:
```bash
cd admin-frontend
npm install
npm start
```

5. Configure o aplicativo mobile:
```bash
cd mobile-app
npm install
npx react-native start
# Em outro terminal:
npx react-native run-android
```

### Acessos Padrão

1. Interface Administrativa:
- URL: http://localhost:3000
- Email: admin@admin.com
- Senha: admin123

2. PgAdmin (gerenciamento do banco de dados):
- URL: http://localhost:5051
- Email: admin@admin.com
- Senha: admin

3. Banco de Dados PostgreSQL:
- Host: localhost
- Porta: 5433
- Banco: ponto_eletronico
- Usuário: postgres
- Senha: postgres

### Estrutura do Projeto

```
.
├── backend/                 # Backend Spring Boot
│   ├── src/
│   └── pom.xml
├── admin-frontend/         # Frontend React
│   ├── src/
│   └── package.json
├── mobile-app/            # App React Native
│   ├── src/
│   └── package.json
└── docker-compose.yml
```

## Desenvolvimento

### Backend

O backend utiliza:
- Spring Boot 3.2
- Spring Security com JWT
- Spring Data JPA
- PostgreSQL
- Arquitetura Hexagonal

### Frontend Administrativo

O frontend administrativo utiliza:
- React 18
- Material-UI
- React Router
- Axios
- TypeScript

### Aplicativo Mobile

O aplicativo mobile utiliza:
- React Native
- React Navigation
- Geolocation
- Axios
- TypeScript

## Funcionalidades

1. Aplicativo Mobile:
- Login com email/senha ou PIN
- Registro de ponto com geolocalização
- Validação de distância da obra
- Histórico de registros

2. Interface Administrativa:
- Gestão de usuários
- Gestão de obras
- Relatórios de ponto
- Correção manual de registros

## Segurança

- Autenticação JWT
- Senhas criptografadas
- Validação de geolocalização
- Registro de alterações manuais

## Suporte

Para suporte, entre em contato através do email: seu-email@exemplo.com 