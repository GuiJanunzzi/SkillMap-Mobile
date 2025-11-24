# 🚀 SkillMap: O Futuro do Trabalho

![Status](https://img.shields.io/badge/status-concluído-brightgreen)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)

Aplicativo mobile desenvolvido para a **Global Solution 2025/2**, com foco no desafio **“O Futuro do Trabalho”**.  
O SkillMap auxilia profissionais no processo de **Upskilling** e **Reskilling**, utilizando **Inteligência Artificial** para apoiar decisões de desenvolvimento de carreira.

---

## 👥 Integrantes

| Nome | RM | GitHub |
|------|------|--------|
| **Caike Dametto** | RM558614 | [Dametto98](https://github.com/Dametto98) |
| **Guilherme Janunzzi** | RM558461 | [GuiJanunzzi](https://github.com/GuiJanunzzi) |

---

## 🎯 Proposta

**SkillMap** é uma plataforma mobile que empodera profissionais diante das transformações do mercado de trabalho.  
O app permite que o usuário:

- Mapeie suas **habilidades atuais** (Upskilling)  
- Defina suas **metas de aprendizado** (Reskilling)  
- Conecte seu perfil às **demandas futuras do mercado**  

Seu grande diferencial é o **Mentor de Carreira com IA**, que analisa o perfil do usuário e cria recomendações estratégicas usando **Inteligência Artificial Generativa**.

---

## ▶️ Demonstração do Aplicativo

📽 Assista ao vídeo demonstrativo:  
**[Link para o vídeo no YouTube](https://youtu.be/xSvCJ1wJMKo)**  

---

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- ✅ **Login com JWT**  
- ✅ **Cadastro com validação de senha e e-mail**  
- ✅ **Tratamento de erros amigável**  

### 💼 Gestão de Carreira (CRUD)
- **Minhas Habilidades (Upskilling)**  
- **Metas de Aprendizado (Reskilling)**  
- ✏️ Editar e remover habilidades e metas  

### 🤖 Inteligência Artificial (Disruptive Architectures)
- Integração com **Google Gemini** via **Spring AI**  
- Conselhos personalizados de carreira analisando gaps entre habilidades e objetivos  
- Engenharia de Prompt com personas e contexto  

### 🎨 Interface e Usabilidade
- Design moderno e responsivo  
- Activity indicators e alertas nativos  
- Tela "Sobre" com versão, hash de commit e informações do time  

---

## 🛠️ Tecnologias Utilizadas

### 📱 Frontend (Mobile)
- React Native (Expo)  
- React Navigation (Stack Navigation)  
- Axios  
- Context API  
- Lucide React Native / Vector Icons  

### ☕ Backend (Java)
- Java 17 + Spring Boot 3  
- Spring AI (Google Gemini)  
- Spring Security + JWT  
- Spring Data JPA  
- Oracle Database
- Maven  

### ☁️ DevOps & Cloud
- Azure DevOps (CI/CD)  
- Azure Web Apps (API)  
- Firebase App Distribution (APK)  

---

## 📁 Estrutura de Pastas (Mobile)


```
assets/         # logo do aplicativo
src/            # Código-fonte principal
├── contexts/   # Contexto de Autenticação (AuthContext)
├── routes/     # Configuração de navegação
├── screens/    # Telas do aplicativo
│ ├── App/      
│ └── Auth/        
└── services/   # Configuração do Axios (api.js)
```

---

## 🚀 Como Executar o Projeto

### 🖥 Backend (API)

O backend da aplicação (API Java/Spring Boot) já está implantado na plataforma de nuvem **Render** e o aplicativo mobile já está configurado para se conectar a ela.

> **Nota sobre o Deploy:** A API está hospedada no plano gratuito do Render. Se o servidor ficar inativo por um período, ele pode "dormir" para economizar recursos. A primeira requisição feita pelo app (como o login) pode demorar 50 segundos ou mais para "acordar" o servidor. Após a primeira conexão, a aplicação funcionará em velocidade normal.


---

### 📱 Frontend (Mobile)

Para executar o aplicativo em um ambiente de desenvolvimento local (conectado à API na nuvem):

**Pré-requisitos:**
- Node.js
- Expo CLI
- Emulador Android (Android Studio) ou o app Expo Go em um dispositivo físico

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/GuiJanunzzi/SkillMap-Mobile.git
    ```
2.  **Navegue até a pasta do projeto mobile:**
    ```bash
    cd SkillMap-Mobile
    ```
3.  **Instale as Dependências:**
    ```bash
    npm install
    ```
4.  **Execute o Aplicativo:**
    ```bash
    npm start
    ```
5.  Abra o aplicativo no seu ambiente de teste:
    - Pressione `a` para abrir no Emulador Android.
    - Ou escaneie o QR Code com o app Expo Go no seu celular físico.

## Download do APK

Se desejar, também é possível fazer o download do APK do aplicativo finalizado, já com todas as integrações configuradas.

**[Link para download do APK](https://expo.dev/accounts/guijanunzzi/projects/SkillMap/builds/94ade1e5-cb85-48f6-b15e-0f59cb39e8e6)**

## 📅 Licença

SkillMap © 2025 - FIAP Global Solution.
Todos os direitos reservados.

