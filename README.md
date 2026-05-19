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
  <a href="#design">Design System</a> •
  <a href="#getting-started">Getting Started</a> •
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
- Consultas e calendário interativo
- Notificações
- Chat / Mensagens com profissionais (busca, filtros, ações por long press)
- Pagamentos — histórico de transações e métodos de pagamento
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
- Painel de Evolução — visão geral de todos os pacientes com gráficos, alertas emocionais e IA de insights
- Detalhes de evolução individual por paciente
- Chat / Mensagens com pacientes (busca, filtros, ações por long press)
- Pagamentos — earnings chart, transações, cobranças extras, repasses
- Relatórios — dashboard com gráficos agregados, tabela de pacientes, relatório individual exportável
- Disponibilidade — horários semanais, pausas, exceções, tipos de consulta, regras de agendamento
- Notificações
- Perfil (conta, disponibilidade, notificações, assinatura, ajuda)

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
├── assets/                        # Assets do projeto
├── config/
│   └── env.ts                     # Configuração de URL da API
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
│   │   ├── ThemeContext.tsx       # Contexto e hooks
│   │   └── index.ts
│   └── types/
│       └── index.ts               # Tipos globais
├── data/
│   └── fake/                      # JSONs de dados mockados para desenvolvimento
├── domain/                        # Camada de domínio/regras de negócio
│   ├── entities/
│   ├── repositories/
│   └── ...
├── hooks/                         # Hooks de dados por feature 
├── types/                         # Tipos de domínio por módulo 
├── presentation/                  # Camada de UI
│   ├── components/                # Componentes reutilizáveis por domínio
│   │   ├── ui/                    # Design system base
│   │   └── ...
│   ├── context/                   # Contextos React de navegação e estado compartilhado
│   ├── controllers/               # Hooks de lógica de tela 
│   │   └── ...
│   └── screens/                   # Telas organizadas por feature
│       ├── auth/                  # Login e cadastro
│       ├── onboarding/
│       │   ├── public/            # Onboarding introdutório 
│       │   └── profile/           # Onboarding de dados do paciente e profissional
│       └── ...
└── services/                      # Acesso a dados 
    ├── auth/                      # AuthService + gerenciamento de token
    ├── api/                       # ApiService base (fetch com headers JWT)
    └── ...

app/                               # Expo Router — rotas file-based
├── (auth)/                        # Rotas públicas (login, cadastro)
└── (protected)/                   # Rotas protegidas (requer JWT)
    ├── (tabs)/                    # Tab bar principal
    └── ...                        # Rotas em stack (paciente e profissional)
    └── screens/                   # Telas organizadas por feature
        └── ...               
                              
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
Lista de conversas com busca, filtros (todos, não lidos, profissionais), contagem de não lidos e ações por long press (silenciar, fixar, marcar como lida, apagar). Conversa individual com agrupamento por data, indicador de digitação e resposta automática simulada.

#### 💳 Pagamentos
Resumo financeiro com total pago, próxima cobrança e saldo. Histórico de transações com filtros por status. Métodos de pagamento cadastrados. Tela de detalhes com timeline de status.

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
Calendário de consultas com visualização mensal/semanal. Criar nova consulta com seleção de paciente (modal), data com máscara DD/MM/AAAA, horário, duração, formato e valor.

#### 📈 Painel de Evolução
Dashboard clínico com:
- Gráfico de humor agregado da carteira (filtros: 7d, 30d, 90d)
- Insights gerados por IA (simulados)
- Alertas emocionais com dismiss
- Tabela de pacientes com tendência de humor, nível de risco e engajamento
- Detalhes individuais por paciente: scores, metas, emoções recorrentes, atividades, hábitos

#### 💬 Chat / Mensagens
Mesmo módulo do paciente, adaptado para o perfil profissional. Filtros incluem "pacientes" e "colegas".

#### 💰 Pagamentos
Resumo financeiro com total recebido, a receber e pendente. Earnings chart semanal (barras SVG com destaque no maior valor). Histórico de transações, cobranças extras e configuração de repasse.

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
- Ações: exportar, imprimir, compartilhar

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

# URL da API em desenvolvimento
EXPO_PUBLIC_API_URL_DEV=http://SEU_IP_LOCAL:3333

# URL da API em produção
EXPO_PUBLIC_API_URL_PROD=https://api.healthmind.com
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

<h2 id="related-projects">🔗 Projetos relacionados</h2>

🧱 Repositório da API backend disponível <a href="https://github.com/issagomesdev/HealthMind-api">aqui</a>.

<h2 id="licenca">📄 Licença</h2>

Projeto desenvolvido para fins acadêmicos, demonstração técnica e evolução da plataforma HealthMind.
