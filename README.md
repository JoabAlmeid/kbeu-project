# 🛒 KBEU – E-commerce Fullstack com Node.js, React e MongoDB

Projeto fullstack de e-commerce desenvolvido como parte do meu portfólio profissional, com foco em boas práticas de API REST, autenticação segura, escalabilidade e experiência do usuário.

## 🚀 Visão Geral

O **KBEU** é uma loja virtual com funcionalidades completas de backend e frontend, incluindo:

- Catálogo de produtos
- Autenticação de usuários com JWT
- Carrinho de compras
- Checkout com Stripe
- Upload de imagens com Cloudinary
- Sessões com Redis
- Painel de administrador

---

## 🧰 Tecnologias Utilizadas

### Backend

- **Node.js**
- **Express**
- **MongoDB** + Mongoose
- **JWT** para autenticação
- **Redis** (ioredis) para sessões e cache
- **Cloudinary** para armazenamento de imagens
- **Stripe API** para pagamentos
- **Dotenv**, **Cookie-parser**, **Bcryptjs** para segurança

### Frontend

- **React.js**
- **Vite**
- **Axios** para chamadas à API
- **CSS/Styled Components**

---

## 📁 Estrutura de Pastas

```bash
kbeu-project/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/

🔐 Autenticação

    Login, cadastro e proteção de rotas com JWT.

    Cookies seguros (httpOnly).

    Hash de senhas com Bcrypt.

🛠️ Scripts Disponíveis

# Iniciar servidor backend em modo dev
npm run dev

# Build completo do frontend
npm run build

# Iniciar app em produção
npm start

📦 Instalação Local

git clone https://github.com/seu-usuario/kbeu.git
cd kbeu-project
npm install
npm run dev

✅ Variáveis do .env necessárias para rodar localmente:
PORT= a porta que vai rodar o localhost
MONGO_URI= chave do Mongodb
retryWrites= "senha" do cluster do Mongodb
UPSTASH_REDIS_URL= chave do Redius pela plataforma Upstash

ACCESS_TOKEN_SECRET && REFRESH_TOKEN_SECRET=  ambos são definidos durante a execução

CLOUDINARY_CLOUD_NAME= conexão com o seu estoque da Cloudinary
CLOUDINARY_API_KEY= chave da API
CLOUDINARY_API_SECRET= "senha" do seu estoque do Cloudinary

STRIPE_SECRET_KEY= "senha" do Stripe
PUBLIC_STRIPE_KEY= chave de API pública do Stripe

CLIENT_URL= seu localhost com a porta que vai usar
NODE_ENV=development (torna dinâmico quando lança pro prod)

💼 Por que este projeto importa?

Este projeto mostra minha capacidade de:

    Trabalhar com stack completa JS (MERN-like)

    Integrar serviços externos (Stripe, Cloudinary)

    Criar APIs seguras e escaláveis

    Estruturar projetos modulares, seguindo boas práticas

    Resolver problemas do mundo real com código limpo

📬 Contato

Se quiser discutir sobre esse projeto ou oportunidades:

    Email: joabalmeida.dev@gmail.com

    LinkedIn: linkedin.com/in/joab-almeida/

    GitHub: https://github.com/JoabAlmeid

    💡 Projeto desenvolvido com dedicação para demonstrar minhas habilidades como desenvolvedor backend e fullstack júnior.
```
