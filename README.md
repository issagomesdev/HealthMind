# HealthMind — Aplicativo de Apoio à Saúde Mental

![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow?style=for-the-badge)

<p align="center">
  <a href="#sobre">Sobre</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#arquitetura">Arquitetura</a> •
  <a href="#estrutura">Estrutura</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#getting-started">Getting Started</a>
</p>

O **HealthMind** é um aplicativo mobile de apoio à saúde mental desenvolvido para auxiliar usuários em sua jornada emocional, funcionando como suporte complementar ao acompanhamento psicológico.

O app combina:
- monitoramento emocional
- diário emocional
- atividades terapêuticas
- respiração guiada
- comunidade
- acompanhamento de consultas
- análise comportamental
- recomendações inteligentes

Tudo isso através de uma experiência acolhedora, moderna e emocionalmente segura.

<h2 id="sobre">📌 Sobre</h2>

O HealthMind foi idealizado como uma plataforma focada em continuidade terapêutica, incentivando:
- autocuidado
- consciência emocional
- constância em hábitos saudáveis
- acompanhamento diário do bem-estar

O aplicativo possui dois tipos principais de usuários:
- **Paciente**
- **Profissional**

Cada perfil possui dashboard e funcionalidades específicas.

<h2 id="roadmap">🚧 Roadmap</h2>

### ✅ Implementado

- Splash Screen adaptável para light/dark mode
- Sistema de autenticação
- Login e cadastro
- Controle de sessão
- Tema global (light/dark/system)
- BottomTabBar dinâmica por role
- SideMenu/Drawer
- Dashboard do paciente
- Dashboard do profissional
- Check-in emocional
- Diário emocional
- Upload de imagem no diário
- Biblioteca de conteúdos
- Atividades terapêuticas
- Respiração guiada interativa
- Comunidade com feed
- Sistema de notificações
- Perfil/configurações
- Controle de privacidade do diário
- Sistema de planos Premium
- Central de ajuda
- Encontrar profissional
- Fluxo de agendamento de consultas
- Calendário de consultas
- Arquitetura preparada para API real

### 🔄 Planejado

- Integração real com IA
- Videochamada nas consultas
- Chat entre paciente e profissional
- Gamificação emocional
- Integração com smartwatch
- Sistema avançado de insights emocionais
- Recomendações baseadas em IA
- Push notifications reais
- Sincronização em nuvem
- Modo offline
- Integração com pagamentos

<h2 id="tecnologias">🧪 Tecnologias</h2>

- Expo
- React Native
- TypeScript
- NativeWind
- Expo Router
- React Navigation
- React Native Reanimated
- Expo Image Picker
- React Context API
- JSON Mock Data
- Clean Architecture
- SOLID Principles

<h2 id="arquitetura">🏗️ Arquitetura</h2>

O projeto segue:
- Clean Architecture
- SOLID
- Componentização reutilizável
- Separação clara de responsabilidades

<h2 id="estrutura">📁 Estrutura</h2>

    src/
    ├── app/
    │   ├── routes/
    │   └── navigation/
    │
    ├── assets/
    │
    ├── core/
    │   ├── constants/
    │   ├── theme/
    │   │   ├── light.ts
    │   │   ├── dark.ts
    │   │   ├── ThemeContext.tsx
    │   │   └── index.ts
    │   │
    │   ├── types/
    │   └── utils/
    │
    ├── data/
    │   │
    │   └── repositories/
    │
    ├── domain/
    │   ├── entities/
    │   ├── repositories/
    │   └── usecases/
    │
    ├── presentation/
    │   ├── screens/
    │   │
    │   ├── controllers/
    │   │
    │   └── components/
    │       ├── ui/
    │       ├── layout/
    │       ├── forms/
    │       ├── navigation/
    │       ├── mood/
    │
    ├── services/
    │
    └── hooks/

<h2 id="funcionalidades">✨ Funcionalidades</h2>

### 🧠 Check-in emocional

Registro diário de humor com:
- emoções
- nível de estresse
- observações pessoais

### 📖 Diário emocional

Espaço seguro para:
- registrar sentimentos
- anexar imagens
- acompanhar evolução emocional

Controle de privacidade:
- apenas você
- profissionais autorizados
- público

### 🌬️ Respiração guiada

Sessões terapêuticas interativas com:
- animação sincronizada
- presets respiratórios
- timer
- experiência imersiva

### 🧘 Atividades terapêuticas

Sugestões de:
- meditação
- alongamento
- hidratação
- autocuidado
- escrita reflexiva

### 📊 Insights emocionais

Análise mockada dos últimos 30 dias:
- emoções mais frequentes
- evolução emocional
- recomendações
- conclusões positivas

### 👩‍⚕️ Encontrar profissional

Fluxo completo:
- seleção de sintomas
- análise inteligente
- recomendação de profissionais
- agendamento de consulta

### 📅 Consultas e calendário

- calendário interativo
- datas destacadas
- horários disponíveis
- reagendamento
- cancelamento mockado

### 👥 Comunidade

Feed social focado em apoio emocional:
- posts
- comentários
- tópicos populares
- ambiente seguro

### 🔔 Notificações

Exemplos:
- check-in diário
- lembretes
- consultas
- atividades recomendadas
- respostas da comunidade

### 👤 Perfil e configurações

- edição de perfil
- preferências
- privacidade
- notificações
- assinatura premium
- central de ajuda

<h2 id="getting-started">▶️ Getting Started</h2>

### Pré-requisitos

- Node.js
- npm ou yarn
- Expo CLI
- Android Studio ou Xcode
- Expo Go (opcional)

### Instalação

Clone o projeto:

    npm install

### Rodando o projeto

    npx expo start

### Rodando Android

    npx expo run:android

### Rodando iOS

    npx expo run:ios

### Configuração do NativeWind

Instalar dependências:

    npm install nativewind
    npm install --save-dev tailwindcss

Gerar config:

    npx tailwindcss init

### Ambiente

Criar arquivo:

    .env

Exemplo:

    EXPO_PUBLIC_API_URL=http://localhost:8080

<h2 id="design-system">🎨 Design System</h2>

### Light Mode

- Primary: #2D3E50
- Secondary: #2A9D8F
- Accent: #4C78D9
- Success: #6DBF7B

### Dark Mode

- Background: #0F172A
- Surface: #111827
- Text: #F9FAFB

### Tipografia

- Poppins
- Inter

### Estilo visual

- Interface acolhedora
- Cards arredondados
- Sombras suaves
- Gradientes teal → azul
- Muito espaço negativo
- UI emocionalmente confortável

<h2 id="licenca">📄 Licença</h2>

Projeto desenvolvido para fins acadêmicos, estudos e evolução do produto HealthMind.