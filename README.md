# HealthMind — Conectando pacientes e profissionais de saúde mental

![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow?style=for-the-badge)

<p align="center">
  <img src="https://media.byissa.dev/healthmind/app_preview1.png" alt="preview" style="width:400px;"/>
  <img src="https://media.byissa.dev/healthmind/app_preview2.png" alt="preview" style="width:400px;"/>
  <img src="https://media.byissa.dev/healthmind/app_preview3.png" alt="preview" style="width:400px;"/>
</p>

<p align="center">
  <a href="#sobre">Sobre</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#arquitetura">Arquitetura</a> •
  <a href="#estrutura">Estrutura</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#design">Design System</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#team">Equipe</a> •
  <a href="#related-projects">Projetos relacionados</a> •
  <a href="#licenca">Licença</a>
</p>

O **HealthMind** é uma plataforma mobile de saúde mental que utiliza tecnologia para conectar pacientes e profissionais, promovendo cuidado emocional, bem-estar e acompanhamento psicológico de forma acessível, acolhedora e moderna.

<h2 id="sobre">📌 Sobre</h2>

O HealthMind foi idealizado como uma plataforma focada em continuidade terapêutica, incentivando autocuidado, consciência emocional e acompanhamento diário do bem-estar.

O aplicativo possui dois perfis de usuário com dashboards, fluxos e ferramentas independentes:

| Perfil | Foco |
|---|---|
| **Paciente** | Autocuidado emocional, diário, atividades, consultas, comunidade |
| **Profissional** | Gestão de pacientes, agenda, relatórios, evolução clínica, disponibilidade |

<h2 id="roadmap">🚧 Roadmap</h2>

### ✅ Implementado

**Base e autenticação**
- Sistema de autenticação completo (login, cadastro, sessão, JWT)
- Tema global light/dark/system com persistência

**Paciente**
- Dashboard do paciente
- Check-in emocional diário
- Diário emocional (criar, listar, privacidade por entrada)
- Atividades terapêuticas (meditação, hidratação, alongamento, escrita reflexiva)
- Insights emocionais — análise dos últimos 30 dias
- Comunidade com feed e criação de posts
- Encontrar profissional (match por sintomas + agendamento)
- Consultas e calendário interativo — botão "Entrar na Sala" navega para chamada simulada (somente consultas Online agendadas)
- Notificações
- Chat / Mensagens com profissionais e membros da comunidade (busca, filtros, ações por long press)
  - Modal de informações: status online, "Ver perfil" para todos os participantes não-suporte
  - Perfil público de profissional: avaliação, abordagens, áreas de atuação, disponibilidade
  - Perfil público de usuário/paciente: bio, interesses, conquistas (sem dados clínicos)
- Pagamentos — histórico de transações com cores contextuais (pendente amarelo, atrasado laranja), métodos de pagamento, detalhes com ações contextuais por tipo
- Perfil completo (conta, privacidade do diário, notificações, assinatura premium, ajuda)

**Profissional**
- Dashboard do profissional
- Gestão de pacientes:
  - Lista de pacientes com busca, filtros de risco e engajamento
  - Prontuário completo do paciente
  - Diário do paciente (leitura)
  - Consultas do paciente (histórico + detalhes)
  - Observações clínicas (criar, listar, detalhar — com categorias, prioridade e privacidade)
  - Histórico de pagamentos do paciente
  - Chat direto com o paciente
  - Adicionar paciente + contrato de serviço
- Agenda / Calendário (criar consulta, detalhes, gestão)
  - Botão "Entrar na chamada" navega para chamada simulada em consultas online e híbridas
  - Card de próxima consulta com acesso direto à chamada
- Painel de Evolução — visão geral de todos os pacientes com gráficos, alertas emocionais e IA de insights
  - Detalhes individuais com ações rápidas: abrir chat, ver prontuário, agendar consulta, nova observação
- Chat / Mensagens com pacientes e colegas (busca, filtros, ações por long press)
  - Modal de informações: status online contextual, "Ver perfil" para todos os participantes não-suporte
  - Perfil público de profissional: avaliação, abordagens, áreas de atuação, disponibilidade, botão de agendamento
  - Perfil público de paciente/usuário: dados públicos limitados, sem informações clínicas
- Pagamentos — earnings chart, transações com exibição correta de valores negativos (assinaturas), cobranças extras, repasses
  - Assinaturas da plataforma com badge visual e ação exclusiva de exportar comprovante
  - Botão "Abrir chat" exibido apenas em pagamentos vinculados a pacientes
- Relatórios — dashboard com gráficos agregados, tabela de pacientes, relatório individual exportável
  - Compartilhamento direto para o chat do paciente
- Disponibilidade — horários semanais, pausas, exceções, tipos de consulta, regras de agendamento
- Notificações
- Perfil (conta, disponibilidade, notificações, assinatura, ajuda)

**Hooks e utilitários transversais**
- `usePatientQuickActions` — navegação centralizada para chat, prontuário, agendamento e observação por paciente
- `useCallActions` — navegação centralizada para chamada simulada (voz ou vídeo), reutilizado por Chat, Agenda e Detalhes da consulta
- `paymentHelpers` — `getPaymentActions`, `getPaymentVisualVariant`, `isSubscriptionPayment` isolando lógica da UI
- `conversationInfoConfig` — config centralizada do modal de chat por papel e tipo de conversa, com `getParticipantProfileRoute`

**Respiração guiada**
- Respiração guiada interativa (animação sincronizada, presets, timer)

### 🔄 Planejado

- Integração real com API HealthMind
- Push notifications reais
- Videochamada nas consultas
- Gamificação emocional
- Integração com smartwatch
- Recomendações baseadas em IA real
- Modo offline com sincronização
- Upload de foto de perfil e documentos
- Integração com gateway de pagamento
- WebSocket para chat em tempo real

<h2 id="tecnologias">🧪 Tecnologias</h2>

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile multiplataforma |
| Expo | ~54.0 | Toolchain, build e plugins nativos |
| TypeScript | ~5.9 | Tipagem estática |
| Expo Router | ~6.0 | Navegação file-based com grupos e layouts |
| NativeWind | ^4.2 | TailwindCSS para React Native |
| React | 19.1 | Biblioteca de UI |
| React Native Reanimated | ~4.1 | Animações de alta performance |
| React Native SVG | — | Gráficos vetoriais (charts de humor, barras, linhas) |
| Expo Linear Gradient | ~15.0 | Gradientes em botões e cards |
| Expo Secure Store | ~15.0 | Armazenamento seguro do token JWT |
| AsyncStorage | ^2.2 | Persistência leve de dados locais |
| React Context API | nativa | Estado global (auth, tema, navegação) |
| ViaCEP | — | Autocomplete de endereço por CEP |

<h2 id="arquitetura">🏗️ Arquitetura</h2>

O projeto segue Clean Architecture com separação clara de responsabilidades:

```
UI (screens + components)
        │
        ▼
   Controllers / Hooks    ← estado de tela, handlers, lógica de apresentação
        │
        ▼
     Services             ← acesso a dados (API real ou fake JSON)
        │
        ▼
  Data / Domain           ← tipos, entidades, contratos de repositório
```

Princípios aplicados: Clean Architecture, SOLID, componentização reutilizável, separação de responsabilidades.

Padrão de dados fake: `JSON → Service (com delay simulado) → Hook → Screen` — arquitetura pronta para substituição por chamadas reais à API sem alterar a camada de UI.

<h2 id="estrutura">📁 Estrutura</h2>

```
src/
├── config/
│   └── env.ts                     # Configuração de ambiente e URL da API
├── core/
│   ├── auth/
│   │   └── AuthContext.tsx        # Contexto global de autenticação e sessão
│   ├── theme/
│   │   ├── colors.ts              # Paleta de cores (tokens light/dark)
│   │   ├── ThemeContext.tsx       # Contexto e hook useTheme
│   │   └── index.ts
│   └── types/
│       └── index.ts               # Tipos globais compartilhados
├── data/
│   └── fake/                      # JSONs de dados mockados por módulo
├── hooks/                         # Hooks de lógica e dados por feature
├── types/                         # Tipos de domínio por módulo
├── utils/                         # Funções utilitárias e helpers
├── services/                      # Acesso a dados (fake JSON ou API real)
└── presentation/
    ├── components/                # Componentes reutilizáveis por domínio
    │   └── ui/                    # Design system base (AppText, AppCard, TopBar…)
    └── screens/                   # Telas organizadas por feature

app/                               # Expo Router — rotas file-based
├── _layout.tsx                    # Layout raiz (fontes, contextos, splash)
├── (auth)/                        # Rotas públicas (login, cadastro)
│   └── _layout.tsx
└── (protected)/                   # Rotas protegidas (requer JWT)
    ├── _layout.tsx                # Guard de autenticação
    └── (tabs)/                    # Tab bar principal
        └── _layout.tsx
```

<h2 id="funcionalidades">✨ Funcionalidades</h2>

### Paciente

#### 🏠 Dashboard
Visão geral personalizada com saudação, streak de check-ins, acesso rápido às principais funcionalidades e cards de bem-estar.

#### 😊 Check-in emocional
Registro diário de humor com seleção de emoções, nível de estresse (slider) e observações livres. Histórico visual de check-ins recentes.

#### 📖 Diário emocional
Espaço seguro para registrar sentimentos e reflexões. Controle de privacidade por entrada: apenas você, profissional autorizado ou público. Filtros e busca.

#### 🧘 Atividades terapêuticas
Sugestões diárias de meditação, alongamento, hidratação, escrita reflexiva e autocuidado. Progresso e biblioteca de conteúdos.

#### 📊 Insights emocionais
Análise dos últimos 30 dias: emoções mais frequentes, evolução do humor, padrões comportamentais e recomendações.

#### 👩‍⚕️ Encontrar profissional
Fluxo completo: seleção de sintomas → análise inteligente → lista de profissionais recomendados → agendamento de consulta.

#### 📅 Consultas e calendário
Calendário interativo com datas destacadas, visualização de horários, criação, reagendamento e cancelamento de consultas.

#### 💬 Chat / Mensagens
Lista de conversas com busca, filtros (todos, não lidos, profissionais, comunidade), contagem de não lidos e ações por long press (silenciar, fixar, marcar como lida, apagar). Conversa individual com agrupamento por data, indicador de digitação, chamadas de voz e vídeo simuladas.

Modal de informações da conversa:
- Status online do participante (Online / Offline / Visto por último) para todas as conversas exceto suporte
- "Ver perfil" disponível para profissionais, pacientes e membros da comunidade
- Ações clínicas contextuais mantidas (prontuário, evolução, agendar — somente profissional com paciente)
- Suporte: sem status online, sem "Ver perfil"

**Perfil público de profissional** — avaliação (nota e número de reviews), anos de experiência, bio, abordagens terapêuticas, áreas de atuação, tipos de atendimento, próxima disponibilidade, botões de chat e agenda.

**Perfil público de usuário/paciente** — bio, interesses/temas de cuidado, data de entrada na plataforma, conquistas e badges. Sem dados clínicos, diário, prontuário ou alertas emocionais.

#### 💳 Pagamentos
Resumo financeiro com total pago, próxima cobrança e saldo. Histórico de transações com cores contextuais por status: verde (pago), amarelo (pendente), laranja (atrasado), vermelho (valores negativos). Métodos de pagamento cadastrados. Tela de detalhes com timeline de status e ações contextuais por tipo de transação.

#### 👤 Perfil e configurações
Edição de dados pessoais, privacidade do diário, preferências de notificações, plano de assinatura premium e central de ajuda com FAQ.

### Profissional

#### 🏠 Dashboard profissional
Visão geral com métricas de pacientes ativos, consultas do mês, avaliação e notificações recentes. Cards de ação rápida.

#### 👥 Gestão de pacientes
Lista de pacientes com busca, filtros por risco e engajamento. Para cada paciente, prontuário completo com:

- **Prontuário** — dados clínicos, queixas, plano terapêutico, risco e status
- **Diário** — leitura do diário emocional do paciente (com filtros e visualização detalhada)
- **Consultas** — histórico de consultas, status e detalhes
- **Observações clínicas** — criar e gerenciar anotações com categoria (Evolução, Sessão, Alerta, Plano terapêutico…), prioridade (Baixa → Urgente), tags e privacidade
- **Pagamentos** — histórico financeiro do paciente e cobranças extras
- **Chat** — conversa direta com o paciente

#### 📅 Agenda
Calendário de consultas com visualização mensal/semanal. Criar nova consulta com seleção de paciente (modal), data com máscara DD/MM/AAAA, horário, duração, formato e valor. Card de próxima consulta com acesso direto a detalhes e entrada na chamada. Botão "Entrar na chamada" exibido para consultas online e híbridas — navega para a tela de chamada simulada sem depender de link externo.

#### 📈 Painel de Evolução
Dashboard clínico com:
- Gráfico de humor agregado da carteira (filtros: 7d, 30d, 90d)
- Insights gerados por IA (simulados)
- Alertas emocionais com dismiss
- Tabela de pacientes com tendência de humor, nível de risco e engajamento
- Detalhes individuais por paciente: scores, metas, emoções recorrentes, atividades, hábitos
- Ações rápidas por paciente: abrir chat direto, ver prontuário, agendar consulta, registrar observação clínica

#### 💬 Chat / Mensagens
Mesmo módulo do paciente, adaptado para o perfil profissional. Filtros incluem "pacientes" e "colegas". Modal de informações com status online, ações clínicas contextuais (prontuário, evolução, agendamento, check-in) e acesso ao perfil público do participante.

#### 💰 Pagamentos
Resumo financeiro com total recebido, a receber e pendente. Earnings chart semanal (barras SVG com destaque no maior valor). Histórico de transações com cores contextuais por status e exibição correta de valores negativos (assinaturas da plataforma). Cobranças extras e configuração de repasse.

Tela de detalhes da transação:
- Badge "Assinatura" em roxo para pagamentos de plano/renovação/upgrade
- "Saída financeira" com valor em vermelho para transações negativas
- Botão "Abrir chat" exibido somente quando a transação está vinculada a um paciente
- Ações contextuais isoladas em `paymentHelpers` — sem lógica espalhada na UI

#### 📋 Relatórios
Dashboard com:
- Filtro de período (7d, 30d, 90d, 12m)
- 6 cards de resumo com skeleton loading
- Gráficos: evolução de humor (linha + área SVG), aderência a atividades (barras), frequência do diário (barras), distribuição de emoções (barras horizontais)
- Tabela de pacientes com busca e filtro por status (Estável, Atenção, Crítico)

Relatório individual por paciente:
- Hero card com métricas
- Gráfico de humor individual
- Emoções, temas e gatilhos frequentes
- Atividades e consultas
- Notas clínicas (privadas, com toggle de visibilidade)
- Ações: exportar, imprimir, compartilhar com paciente (navega diretamente para o chat)

#### 🕐 Disponibilidade
Configuração completa de agenda:
- **Horários semanais** — ativar/desativar cada dia, múltiplos intervalos por dia, copiar horários
- **Pausas** — intervalo mínimo entre consultas (0–45 min), horário de almoço, limite diário e consecutivo
- **Duração padrão** — 30, 45, 50, 60 ou 90 minutos
- **Formato** — Online, Presencial ou Híbrido (com endereço e link de videoconferência)
- **Tipos de consulta** — Avaliação inicial, Acompanhamento, Retorno, Emergencial, Orientação breve, Supervisão (cada um com duração, valor e formato)
- **Regras de agendamento** — antecedência mínima/máxima, reagendamento e cancelamento pelo paciente, confirmação manual, modo automático
- **Exceções e bloqueios** — bloquear datas e períodos específicos (Viagem, Férias, Evento, Compromisso pessoal)
- **Preview** — prévia dos próximos horários disponíveis

#### 👤 Perfil profissional
Dados de conta, disponibilidade, notificações, assinatura e central de ajuda específica para profissionais.

#### 🌬️ Respiração guiada
Sessões interativas com animação sincronizada de expansão/contração, presets respiratórios (4-7-8, box breathing, relaxamento) e timer configurável.

<h2 id="design">🎨 Design System</h2>

### Paleta de cores

| Token | Light | Dark |
|---|---|---|
| `primary` | `#2D3E50` | `#F9FAFB` |
| `secondary` | `#2A9D8F` | `#2A9D8F` |
| `accent` | `#4C78D9` | `#4C78D9` |
| `background` | `#F9FAFB` | `#0F172A` |
| `surface` | `#FFFFFF` | `#111827` |
| `content` | `#1F2937` | `#F9FAFB` |
| `subtle` | `#6B7280` | `#9CA3AF` |
| `error` | `#EF4444` | `#F87171` |

### Convenção de estilos

- **NativeWind `className`** — layout estático, utilitários de espaçamento, flex, border-radius
- **`style={{ ... }}`** — cores dinâmicas via tokens `colors.*` do `useTheme()` (não hardcoded)
- **Componentes base**: `AppText`, `AppCard`, `TopBar`, `LoadingState`, `ConfirmActionModal`

### Tipografia

- Poppins (headings)
- Inter (corpo)

### Visual

- Interface acolhedora e emocionalmente segura
- Cards arredondados com bordas suaves
- Gráficos SVG nativos (sem biblioteca de charts externa)
- Gradientes teal → azul
- Espaço negativo generoso
- Animações fluidas (Reanimated)

<h2 id="getting-started">▶️ Getting Started</h2>

### Pré-requisitos

- Node.js 18+
- npm
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (emulador Android) ou Xcode (simulador iOS)
- Expo Go no celular (opcional)

### Instalação

```bash
git clone https://github.com/issagomesdev/HealthMind
cd HealthMind
npm install
```

### Rodando o projeto

```bash
npx expo start
```

Opções após iniciar:
- `a` — abrir no emulador Android
- `i` — abrir no simulador iOS
- `w` — abrir no navegador (web)
- Escanear o QR code com o Expo Go

### Variáveis de ambiente

```bash
cp .env.example .env
```

```env
# Ambiente: development | production
EXPO_PUBLIC_APP_ENV=development

# URL da API em desenvolvimento (IP local da máquina na rede Wi-Fi)
EXPO_PUBLIC_API_URL_DEV=http://0.0.0.0:3333

# URL da API em produção
EXPO_PUBLIC_API_URL_PROD=https://api.url
```

> **Por que não usar `localhost`?**  
> Em dispositivos físicos ou emuladores, `localhost` aponta para o próprio aparelho, não para sua máquina. Use o IP local da sua rede Wi-Fi.

```bash
# Descobrir seu IP local:

# Windows
ipconfig | findstr "IPv4"

# Mac / Linux
ifconfig | grep "inet "
```

Exemplo: `EXPO_PUBLIC_API_URL_DEV=http://192.168.1.100:3333`

A seleção da URL correta é feita automaticamente por `src/config/env.ts` com base em `EXPO_PUBLIC_APP_ENV`.

---

### Variáveis de ambiente no EAS Build

O arquivo `.env` funciona normalmente em **desenvolvimento local**. O `npx expo start` e o Expo Go leem o `.env` diretamente da sua máquina.

**Porém, builds gerados pelo EAS são compilados nos servidores da Expo** — e não têm acesso ao `.env` local. Por isso, as variáveis precisam ser declaradas no `eas.json` (para versões versionadas) ou via **EAS Secrets/Environment Variables** no painel da Expo (para valores sensíveis).

| Contexto | Onde definir as variáveis |
|---|---|
| `npx expo start` / Expo Go | `.env` local |
| `eas build --profile preview` | `eas.json` → `build.preview.env` |
| `eas build --profile production` | `eas.json` → `build.production.env` ou EAS Secrets |

#### Exemplo de `eas.json` com variáveis por perfil

```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" },
      "env": {
        "EXPO_PUBLIC_APP_ENV": "production",
        "EXPO_PUBLIC_API_URL_DEV": "http://0.0.0.0:3333",
        "EXPO_PUBLIC_API_URL_PROD": "https://api.url"
      }
    },
    "production": {
      "android": { "buildType": "app-bundle" },
      "env": {
        "EXPO_PUBLIC_APP_ENV": "production",
        "EXPO_PUBLIC_API_URL_PROD": "https://api.url"
      }
    }
  }
}
```

> **⚠️ Atenção:** Se as variáveis não forem configuradas no EAS Build, o app compilado receberá URLs vazias/`undefined`, causando erros como:
> ```
> Invalid URL: /auth/login
> ```
> O app pode funcionar corretamente no Expo Go (lê o `.env` local) e falhar no APK gerado pelo EAS (sem acesso ao `.env`). Sempre verifique o `eas.json` antes de gerar um build.

### Dados fake

Exceto autenticação, o restante do app atualmente funciona com dados mockados — nenhuma API é necessária para rodar em desenvolvimento.

Os módulos utilizam JSONs em `src/data/fake/` através de services com delay simulado, mantendo a mesma interface que será usada futuramente com a API real.

#### Atualmente integrados à API

- Login
- Cadastro
- Autenticação do usuário
- Persistência de sessão

#### Atualmente mockados/fake

- Pacientes
- Agenda
- Chat
- Painel de evolução
- Pagamentos
- Perfil
- Notificações
- Diário
- Comunidade
- Demais módulos do app

Essa abordagem permite:
- desenvolver a UI independentemente do backend;
- validar fluxos completos de UX;
- acelerar prototipação;
- manter a arquitetura preparada para integração real.

Para conectar os demais módulos à API futuramente:
- basta apontar `EXPO_PUBLIC_API_URL_DEV` para o servidor correto;
- substituir os services fake pelos services reais;
- a camada de UI não precisa de alterações.

<h2 id="team">👥 Equipe</h2>

| Nome | Papel | LinkedIn |
|---|---|---|
| Hayssa Gomes | Desenvolvimento Mobile & Produto | [LinkedIn](https://www.linkedin.com/in/issagomesdev) |
| Vitoria Inacia | Produto, Pesquisa & Experiência | [LinkedIn](https://www.linkedin.com/in/vitoria-inacia-0a1086250) |
| Kelvson Nilson | Desenvolvimento & Solução Técnica | [LinkedIn](https://www.linkedin.com/in/kelvson-nilson-129751286/) |
| Leticia Oliveira | Pesquisa, Estratégia & Experiência | [LinkedIn](https://www.linkedin.com/in/-leticiaoliveira/) |
| Arthur Santo | Produto, Tecnologia & Apresentação | [LinkedIn](https://www.linkedin.com/in/arthur-santo-b8651a2b6/) |

<h2 id="related-projects">🔗 Projetos relacionados</h2>

| Projeto | Descrição | Link |
|---|---|---|
| **HealthMind Page** | Landing page oficial do HealthMind, desenvolvida com React, Vite, TypeScript e Tailwind CSS | <a href="https://github.com/issagomesdev/HealthMindPage">Acessar repositório</a> |
| **HealthMind API** | Backend/API do ecossistema HealthMind, responsável pela autenticação, regras de negócio e integração com dados | <a href="https://github.com/issagomesdev/HealthMind-api">Acessar repositório</a> |

<h2 id="licenca">📄 Licença</h2>

Projeto desenvolvido para fins acadêmicos, demonstração técnica e evolução da plataforma HealthMind.
