/* express eh um framework minimalista para construcao
de aplicativos web e APIs no Node. ele facilita a criação e
a  configuração de servidores HTTP fornecendo uma estrutura
simplista para criação de rotas, manipulação de requisiçõs e
respostas e gerenciaento de middleware */

//middleware sempre ira receber tres argumentos sua assinatura padrao (req, res, next)

//importando o express
import express from 'express';
//instancia que representa a aplicacao web, onde eu definirei as rotas, logica do servior e middleware
const app = express();
//definindo a porta do servidor
const port = 3000;

// adicionando o middleware para analisar JSON e permitir que ele interprete corretamente o corpo das requisições json.
app.use(express.json()); //permitindo que eu acesse e manipule os dados do corpo da requisicao

//1) ETAPA 1 DO TRABALHO

//configurando uma rota get para responder com uma mensgem de boas-vindas
//req = request   res = response
app.get('/', (req, res) => {
  res.send('Bem-vindo ao Express!'); //enviando uma mensagem de boas-vindas(um response)
});

// 2) ETAPA 2 DO TRABALHO
// definindo uma rota dinâmica para cumprimentar um usuario especifico
app.get('/saudacao/:nome', (req, res) => {
  const nomeUsuario = req.params.nome; // pegando o parâmetro nome da URL utilizando o req.params.(parametro)
  res.send(`Olá, ${nomeUsuario}! Seja bem-vindo ao Express!`); // enviando uma mensagem personalizada
});

//3) ETAPA 3 DO TRABALHO

// middleware de autenticação fake
const autenticarToken = (req, res, next) => {
  const token = req.headers['x-access-token']; // acessando o token no cabeçalho da requisição
  
  if (!token) {
    return res.status(401).send('Acesso não autorizado: Token não fornecido.'); // disparando o erro 401
  }

  // validando o token
  if (token === 'meu-token-seguro') { 
    next(); // valida e segue para a rota correspondente
  } else {
    res.status(401).send('Acesso não autorizado: Token inválido.'); //responde com o erro 401
  }
};

// aplicando o middleware de autenticação fake a uma rota /protegida
app.get('/protegida', autenticarToken, (req, res) => {
  res.send('Você acessou uma rota protegida com sucesso!');
});

//4) ETAPA 4 DO TRABALHO

// criando uma lista de produtos
const produtos = [
  { id: 1, nome: 'Camiseta', categoria: 'Vestuário' },
  { id: 2, nome: 'Calça', categoria: 'Vestuário' },
  { id: 3, nome: 'Tênis', categoria: 'Calçados' },
  { id: 4, nome: 'Relógio', categoria: 'Acessórios' }
];

// rota GET que filtra os produtos com base em query params
app.get('/produtos', (req, res) => {
  const { nome, categoria } = req.query; // utilizando o request para solicitar os parâmetros da query
  
  // inicializamos a var produtosFiltrados recebendo a lista inteira de produtos para depois aplicarmos os filtros
  let produtosFiltrados = produtos;

  //se for nome
  if (nome) {
    //filter percorre a lista e cria uma nova lista atualizada com as verificações, iterando posteriormente sobre ela
    //produto => corresponde a leitura "para cada item chamado "produto""
    produtosFiltrados = produtosFiltrados.filter(produto => produto.nome.toLowerCase().includes(nome.toLowerCase()));
  }

  //se for categoria
  if (categoria) {
    produtosFiltrados = produtosFiltrados.filter(produto => produto.categoria.toLowerCase().includes(categoria.toLowerCase()));
  }

  res.json(produtosFiltrados); // enviando a resposta, ou seja, enviando a lista filtrada como resposta JSON
});

// 5) ETAPA 5 DO TRABALHO e EXERCÍCIO 6:

// middleware de validação de dados para a rota POST
const validarProduto = (req, res, next) => {
  const { nome, categoria } = req.body;

  // Verificando se o nome está presente e é uma string não vazia
  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).send('Dados inválidos: Nome é obrigatório e deve ser uma string não vazia.'); // resposta 400 para o usuário indicando o erro
  }

  // Verificando se a categoria está presente e é uma string não vazia
  if (!categoria || typeof categoria !== 'string' || categoria.trim() === '') {
    return res.status(400).send('Dados inválidos: Categoria é obrigatória e deve ser uma string não vazia.'); // resposta 400 para o usuário indicando o erro
  }

  next(); // se a validação passar, continue para o próximo middleware ou rota
};

// rota POST para adicionar um novo produto
let nextId = 5; // próximo ID a ser atribuído

// chamando aqui a validação com middleware EX 6
app.post('/produtos', validarProduto, (req, res) => {
  const novoProduto = req.body; // request para pegar o corpo da requisição e armazenar na variável novoProduto
  
  novoProduto.id = nextId++; // atribuindo um ID único e incrementando o próximo ID
  produtos.push(novoProduto); // adicionando o novo produto à lista
  res.status(201).json(novoProduto); // retornando o novo produto com o ID adicionado
});

// 7) ETAPA 7 DO TRABALHO

// app.use é utilizado para registrar funções middleware que serão executadas em todas as requisições que passam pelo servidor, independentemente do método HTTP (GET, POST, etc.) e da rota.
app.use((err, req, res, next) => {
  console.error(err.stack); // logando o erro no console

  res.status(500).json({
    status: 'error',
    message: 'Ocorreu um erro interno no servidor.',
    details: err.message // opcional: enviar detalhes do erro
  });
});

//iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
