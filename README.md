# Caderneta de Vendas

Duas páginas, um banco:

- `index.html` é o **catálogo dos clientes**. É o link que você compartilha. Só mostra foto, nome, marca e preço.
- `admin/index.html` é o **seu sistema**, com e-mail e senha: catálogo, vendas, clientes, carteira, painel e DRE.
- `schema.sql` cria o banco. `seed.sql` coloca nele os seus produtos e as 26 vendas já lançadas.
- `config.js` guarda o endereço do seu Supabase. `img/` tem as fotos dos produtos.

## Passo a passo

### 1. Supabase: criar o banco
1. Em supabase.com, **New project**. Escolha um nome, anote a senha do banco e use a região *South America (São Paulo)*.
2. Abra **SQL Editor > New query**, cole o conteúdo de `schema.sql` e clique em **Run**.
3. Faça o mesmo com `seed.sql`. Em **Table Editor** você deve ver 20 linhas em `products` e 26 em `sales`.

### 2. Supabase: criar o seu usuário
1. **Authentication > Users > Add user > Create new user**.
2. Digite jhonnyguedespereira@gmail.com e a senha que você quer usar. Marque **Auto Confirm User**.
3. Em **Authentication > Sign In / Providers**, desligue **Allow new users to sign up**. Assim ninguém mais consegue criar conta.

A senha não fica em nenhum arquivo. Ela existe só no Supabase.

### 3. Pegar os dois dados do projeto
1. Abra **Settings > API Keys** (ou o botão **Connect**).
2. Copie a **Project URL** e a chave pública: **Publishable key** (`sb_publishable_...`) ou, se aparecer, a **anon** (`eyJ...`).
3. Abra o `config.js` e troque os dois valores. Nunca use a chave `secret` ou `service_role`.

### 4. GitHub: publicar
1. Crie um repositório novo (pode ser público). Ex.: `loja`.
2. **Add file > Upload files** e arraste o conteúdo desta pasta: `index.html`, `config.js`, a pasta `admin` e a pasta `img`. Clique em **Commit changes**.
3. Em **Settings > Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve. Em 1 ou 2 minutos o endereço aparece lá.

### 5. Usar
- Clientes: `https://SEU-USUARIO.github.io/loja/`
- Você: `https://SEU-USUARIO.github.io/loja/admin/`. Entre com e-mail e senha e salve nos favoritos.

Se um dia a página do cliente mostrar "Não foi possível carregar o catálogo", confira o `config.js`. Se a chave nova não funcionar, tente a outra (anon ou publishable).

## Foto de produto novo
Produto cadastrado no sistema aparece com a inicial no lugar da foto. Para ter foto, coloque um arquivo `NOME.jpg` na pasta `img` do GitHub e escreva `NOME` no campo `img` do produto, na tabela `products` do Supabase (Table Editor), dentro do json `data`.
