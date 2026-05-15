# HealthMind — Conectando pacientes e profissionais de saúde mental

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

O **HealthMind** é uma plataforma mobile de saúde mental que utiliza tecnologia para conectar pacientes e profissionais, promovendo cuidado emocional, bem-estar e acompanhamento psicológico de forma acessível, acolhedora e moderna.

O aplicativo combina funcionalidades como:
- monitoramento emocional
- diário emocional
- atividades terapêuticas
- respiração guiada
- comunidade de apoio
- acompanhamento de consultas
- análise comportamental
- recomendações inteligentes

Tudo isso por meio de uma experiência intuitiva, humanizada e emocionalmente segura.

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
- Login e cadastro com feedback de erro via toast animado
- Controle de sessão
- Tema global (light/dark/system)
- Dashboard do paciente
- Dashboard do profissional
- Check-in emocional
- Diário emocional
- Biblioteca de conteúdos
- Atividades terapêuticas
- Respiração guiada interativa
- Comunidade com feed
- Sistema de notificações
- Configurações de perfil
- Controle de privacidade do diário
- Sistema de planos Premium
- Central de ajuda
- Encontrar profissional
- Fluxo de agendamento de consultas
- Calendário de consultas

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

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile multiplataforma |
| Expo | ~54.0 | Toolchain e build |
| TypeScript | ~5.9 | Tipagem estática |
| Expo Router | ~6.0 | Navegação file-based |
| NativeWind | ^4.2 | TailwindCSS para React Native |
| React | 19.1 | Biblioteca de UI |
| React Native Reanimated | ~4.1 | Animações de alta performance |
| React Native `Animated` API | nativa | Animações da barra de progresso e toasts |
| Expo Image Picker | ~17.0 | Seleção de imagens da galeria |
| Expo Linear Gradient | ~15.0 | Gradientes nos botões |
| Expo Secure Store | ~15.0 | Armazenamento seguro do token JWT |
| AsyncStorage | ^2.2 | Persistência leve de dados locais |
| React Context API | nativa | Estado global (auth, tema) |
| ViaCEP | — | Autocomplete de endereço por CEP |

<h2 id="arquitetura">🏗️ Arquitetura</h2>

O projeto segue:
- Clean Architecture
- SOLID
- Componentização reutilizável
- Separação clara de responsabilidades

<h2 id="estrutura">📁 Estrutura</h2>

    src/
    ├── assets/                        # Assets do projeto
    ├── config/
    │   └── env.ts                     # Confguração de URL da API por ambiente (dev/prod)
    ├── core/                          # Núcleo da aplicação — agnóstico de UI
    │   ├── auth/
    │   │   └── AuthContext.tsx        # Contexto global de autenticação e sessão
    │   ├── constants/
    │   │   ├── api.ts                 # Rotas da API
    │   │   ├── navigation.ts          # Nomes das rotas de navegação
    │   │   └── routes.ts              # Constantes de paths
    │   ├── theme/
    │   │   ├── colors.ts              # Paleta de cores (light/dark)
    │   │   ├── spacing.ts             # Escala de espaçamento
    │   │   ├── ThemeContext.tsx        # Contexto e hook useTheme()
    │   │   └── index.ts
    │   └── types/
    │       └── index.ts               # Tipos globais (UserRole, GenderType, AuthResult…)
    ├── data/
    │   └── fake/                      # JSONs de dados mockados para desenvolvimento
    ├── domain/                        # Camada de domínio — regras de negócio puras
    │   ├── entities/
    │   ├── repositories/
    │   └── ...
    ├── presentation/                  # Camada de UI
    │   ├── components/                # Componentes reutilizáveis por domínio
    │   │   ├── ui/                    # Design system base
    │   │   │   └── ...
    │   │   └── ...
    │   ├── controllers/               # Hooks de lógica de tela (estado + handlers)
    │   │   └── ...                   
    │   │
    │   └── screens/                   # Telas organizadas por feature
    │       ├── auth/                  # Login e cadastro
    │       ├── onboarding/
    │       │   ├── public/            # Onboarding introdutório (pré-login)
    │       │   └── profile/           # Onboarding de dados do paciente e profissional
    │       └── ...
    └── services/                      # Acesso a dados — API real ou mock
        ├── auth/                      # AuthService + gerenciamento de token
        ├── api/                       # ApiService base (fetch com headers JWT)
        └── ...

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

```bash
git clone https://github.com/issagomesdev/HealthMind
cd HealthMind

npm install
```

### Rodando o projeto

    npx expo start

### Configuração do NativeWind

Instalar dependências:

    npm install nativewind
    npm install --save-dev tailwindcss

Gerar config:

    npx tailwindcss init

### Ambiente

Copie o arquivo de exemplo e preencha as variáveis:

    cp .env.example .env

Variáveis disponíveis:

    # Ambiente: development | production
    EXPO_PUBLIC_APP_ENV=development

    # URL da API em desenvolvimento
    EXPO_PUBLIC_API_URL_DEV=http://SEU_IP_LOCAL:3333

    # URL da API em produção
    EXPO_PUBLIC_API_URL_PROD=https://api.healthmind.com

#### Como trocar de ambiente

Para desenvolvimento local, mantenha `EXPO_PUBLIC_APP_ENV=development`.
Para apontar para a API de produção, altere para `EXPO_PUBLIC_APP_ENV=production`.
A seleção da URL é feita automaticamente em `src/config/env.ts`.

#### Como configurar o IP local (desenvolvimento no celular/emulador)

Nunca use `localhost` no React Native, dentro de um dispositivo físico ou emulador,
`localhost` aponta para o próprio aparelho, não para a sua máquina.

**Dispositivo físico (Expo Go):** use o IP da sua máquina na rede Wi-Fi:

    # Windows
    ipconfig | findstr "IPv4"

    # Mac/Linux
    ifconfig | grep "inet "

    Exemplo: EXPO_PUBLIC_API_URL_DEV=http://192.168.1.100:3333

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

<h2 id="related-projects">🔗 Related Projects</h2>

🧱 Repositório da API backend disponível <a href="https://github.com/issagomesdev/HealthMind-api">aqui</a>.

<h2 id="licenca">📄 Licença</h2>

Projeto desenvolvido para fins acadêmicos, demonstração técnica e evolução da plataforma HealthMind.