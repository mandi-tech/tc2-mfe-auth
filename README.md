# Tech Challenge - Fase 2 | MFE Auth

O **tc2-mfe-auth** é o microfrontend responsável pelos **fluxos de autenticação e gerenciamento de sessão** do projeto **Tech Challenge – Fase 2**.

Este módulo é carregado pelo Shell e compartilha o estado de autenticação com os demais microfrontends.

<br />

## 🧱 Responsabilidades

- Login e logout
- Validação de credenciais
- Integração com provedor de autenticação
- Compartilhamento de sessão com o Shell

<br />

## 🧩 Integração

Este microfrontend é consumido por:
- [tc2-mfe-shell](https://github.com/mandi-tech/tc2-mfe-shell)

<br />

## 🚀 Development server

Este projeto foi gerado utilizando o **Angular CLI v20.3.9**.

Para iniciar o servidor de desenvolvimento:

```bash
ng serve

# A aplicação estará disponível em:
# http://localhost:4200/
```
O app será recarregado automaticamente ao alterar os arquivos fonte.

<br />

## 📦 Build

Para gerar o build de produção:

```bash
ng build

# Os artefatos serão gerados no diretório dist/.
```

<br />

## 📘 Documentação

A documentação completa da arquitetura e padrões do projeto está disponível em:

➡️ [tc2-documentation](https://github.com/mandi-tech/tc2-documentation)

<br />

## 📄 Licença

Projeto desenvolvido para o Tech Challenge – Fase 2.
