# GitHub Finder

Aplicação web desenvolvida com **React e TypeScript** para pesquisar perfis públicos do GitHub e explorar seus repositórios.

O projeto utiliza a API REST do GitHub para consultar informações em tempo real, oferecendo filtros, ordenação, paginação e uma interface responsiva com suporte aos temas claro e escuro.

**[Acessar aplicação](https://github-finder-chi-hazel.vercel.app/)**

## Funcionalidades

- Pesquisa de usuários pelo nome de usuário do GitHub.
- Visualização de avatar, nome, biografia, empresa, localização e site pessoal.
- Estatísticas de seguidores, contas seguidas e repositórios públicos.
- Exibição de até 100 repositórios públicos por pesquisa.
- Pesquisa de repositórios por nome ou descrição.
- Filtro por linguagem de programação.
- Ordenação por data de atualização, estrelas ou nome.
- Identificação e opção para ocultar repositórios que são forks.
- Paginação dos resultados.
- Formatação de datas e números.
- Tema claro e escuro, com preferência salva no navegador.
- Armazenamento do último usuário pesquisado.
- Indicadores de carregamento e mensagens de erro.
- Layout responsivo para computadores, tablets e celulares.

## Tecnologias utilizadas

- **React:** construção da interface utilizando componentes e hooks.
- **TypeScript:** tipagem dos dados, propriedades e funções.
- **Vite:** ambiente de desenvolvimento e build.
- **CSS:** estilização, temas, Flexbox, Grid e responsividade.
- **GitHub REST API:** consulta de perfis e repositórios públicos.
- **LocalStorage:** persistência das preferências do usuário.

## Como executar

É necessário ter Node.js e npm instalados.

**1. Clone o repositório:**

`git clone https://github.com/gagaau/github-finder.git `

**2. Entre na pasta:**

`cd github-finder`

**3. Instale as dependências:**

`npm install`

**4. Inicie o servidor de desenvolvimento:**

`npm run dev`

Acesse o endereço local exibido no terminal.

### Outros comandos

- `npm run build` — gera a versão de produção.
- `npm run preview` — permite visualizar o build localmente.
- `npm run lint` — executa a análise estática do código.

## Observações

O projeto utiliza os endpoints públicos da API do GitHub, sem exigir login.

As consultas estão sujeitas aos limites de requisições da API. Os filtros e a paginação operam sobre os repositórios carregados, limitados aos 100 mais recentemente atualizados por pesquisa.

Repositórios privados não são exibidos.

## Captura de tela

![Interface do GitHub Finder](./screenshots/github-finder.png)

## Autor

Desenvolvido por **Gabriel Henrique**.

Projeto criado para prática de desenvolvimento frontend e composição do portfólio profissional.