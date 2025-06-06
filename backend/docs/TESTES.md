# Documentação de Testes - Sistema de Ponto Eletrônico

## Visão Geral

Este documento descreve os procedimentos para testar os serviços do sistema de ponto eletrônico. Os testes são divididos em duas categorias principais:

1. Testes Unitários
2. Testes de Integração

## Pré-requisitos

- Java 17 ou superior
- Maven 3.8 ou superior
- JUnit 5
- Mockito
- H2 Database (para testes de integração)

## Estrutura dos Testes

### 1. Testes Unitários

Os testes unitários estão localizados em `src/test/java` e seguem a mesma estrutura de pacotes do código fonte.

#### 1.1 AuthService

O `AuthServiceTest` verifica:
- Login com credenciais válidas
- Login com credenciais inválidas
- Login com usuário inativo
- Validação de token JWT
- Geração de token JWT

Para executar:
```bash
mvn test -Dtest=AuthServiceTest
```

#### 1.2 DashboardService

O `DashboardServiceTest` verifica:
- Contagem total de funcionários
- Contagem de obras ativas
- Registros do dia
- Alertas de registros fora do raio
- Listagem dos últimos registros
- Ranking de obras por número de funcionários
- Status de presença dos funcionários

Para executar:
```bash
mvn test -Dtest=DashboardServiceTest
```

#### 1.3 RegistroPontoService

O `RegistroPontoServiceTest` verifica:
- Registro de ponto dentro do raio permitido
- Registro de ponto fora do raio (deve falhar)
- Registro manual de ponto
- Busca de registros por período

Para executar:
```bash
mvn test -Dtest=RegistroPontoServiceTest
```

### 2. Testes de Integração

Os testes de integração verificam a interação entre os componentes do sistema.

#### 2.1 Configuração

1. Adicione as dependências no `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

2. Configure o banco de dados de teste em `src/test/resources/application-test.properties`:
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

#### 2.2 Execução dos Testes

Para executar todos os testes:
```bash
mvn clean test
```

Para executar uma classe específica:
```bash
mvn test -Dtest=NomeDoTeste
```

## Cenários de Teste

### 1. Autenticação

1. **Login com Sucesso**
   - Credenciais válidas
   - Usuário ativo
   - Token JWT gerado corretamente
   - Informações do usuário retornadas

2. **Falhas de Login**
   - Credenciais inválidas
   - Usuário inativo
   - Email não cadastrado

3. **Validação de Token**
   - Token válido
   - Token expirado
   - Token inválido
   - Token malformado

### 2. Dashboard

1. **Dados Completos**
   - Verifica se todos os campos do dashboard são preenchidos corretamente
   - Valida o formato das datas e números
   - Confirma a ordenação dos registros

2. **Sem Dados**
   - Verifica o comportamento quando não há registros
   - Valida que as listas retornam vazias
   - Confirma que os contadores retornam zero

### 3. Registro de Ponto

1. **Registro Normal**
   - Funcionário dentro do raio da obra
   - Horário dentro do expediente
   - Todos os campos obrigatórios preenchidos

2. **Validações de Localização**
   - Funcionário fora do raio da obra
   - Coordenadas inválidas
   - Obra sem localização definida

3. **Registro Manual**
   - Criação de registro retroativo
   - Validação de horários
   - Preenchimento da observação

### 4. Relatórios

1. **Exportação**
   - Formato correto do arquivo
   - Todos os dados necessários incluídos
   - Agrupamento por funcionário

## Cobertura de Testes

Para gerar o relatório de cobertura:
```bash
mvn clean test jacoco:report
```

O relatório será gerado em `target/site/jacoco/index.html`

## Boas Práticas

1. **Nomenclatura**
   - Use nomes descritivos para os testes
   - Siga o padrão: `metodo_cenario_resultadoEsperado`

2. **Organização**
   - Use o padrão AAA (Arrange, Act, Assert)
   - Separe os testes em métodos pequenos e focados
   - Use `@BeforeEach` para configuração comum

3. **Mocks**
   - Mock apenas o necessário
   - Use `verify()` para confirmar chamadas
   - Configure retornos específicos para cada teste

## Troubleshooting

### Problemas Comuns

1. **Teste Falha por Timezone**
   - Use `ZonedDateTime` ou configure timezone nos testes
   - Compare apenas as partes relevantes das datas

2. **Teste Intermitente**
   - Evite depender de dados aleatórios
   - Configure seed para geradores de números
   - Use `@DirtiesContext` quando necessário

3. **Erro de Conexão com H2**
   - Verifique URL do banco
   - Confirme se H2 está no classpath
   - Verifique configurações de schema

4. **Erro de JWT**
   - Verifique a chave secreta nos testes
   - Configure tempo de expiração adequado
   - Use tokens diferentes para cada teste

## Manutenção

1. **Atualização de Testes**
   - Atualize os testes quando mudar a lógica
   - Mantenha documentação sincronizada
   - Revise cobertura periodicamente

2. **Revisão de Código**
   - Use checkstyle para padrões
   - Revise testes em PRs
   - Mantenha testes legíveis 