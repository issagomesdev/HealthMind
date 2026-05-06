<h1 align="center">
  HealthMind
</h1>

<p align="center">
  <img alt="Expo" src="https://img.shields.io/badge/Expo-54.0-000020?style=flat-square&logo=expo&logoColor=white" />
  <img alt="React Native" src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="NativeWind" src="https://img.shields.io/badge/NativeWind-4.2-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  Companion de saúde mental · cuidado diário em um só lugar
</p>

---

## Sobre o projeto

O **HealthMind** é um aplicativo mobile de saúde mental desenvolvido com Expo e React Native. Ele conecta pacientes e profissionais de saúde em uma experiência unificada — registro de humor, diário terapêutico, exercícios guiados de respiração, agendamento de consultas, comunidade de apoio e muito mais.

A arquitetura segue os princípios de **Clean Architecture** e **SOLID**, com camadas bem definidas (Screen → Controller → Service → Data) que permitem a substituição dos dados fake por uma API real sem impacto nas telas.

### Funcionalidades implementadas

- [x] Onboarding de boas-vindas
- [x] Autenticação (login / cadastro) com persistência segura via `expo-secure-store`
- [x] Dashboard adaptativo por perfil (Paciente / Profissional)
- [x] Menu lateral animado (SideMenu) com navegação global
- [x] Check-in de humor diário com 5 níveis
- [x] Diário terapêutico — criação, filtros e listagem
- [x] Hub de atividades com conteúdos em cards
- [x] Comunidade — feed de posts e criação de publicação
- [x] Respiração guiada — 4 presets, animação de círculo, timer preciso, vibração e conclusão
- [x] Consultas — calendário customizado, lista de consultas, detalhes e reagendamento
- [x] Busca de profissionais — wizard em 3 etapas (filtros → lista → perfil)
- [x] Notificações — feed agrupado por período, badge ao vivo via subscriber pattern
- [x] Insights de humor — análise dos últimos 30 dias com gráfico de linhas e AI summary
- [x] Configurações — tema claro/escuro, navegação para subseções, logout com confirmação
- [x] Perfil — edição de conta, privacidade, notificações, plano e central de ajuda
- [x] Suporte completo a dark mode via NativeWind

---

## Tecnologias

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Runtime | Expo | ~54.0.33 |
| Framework | React Native | 0.81.5 |
| Linguagem | TypeScript | ~5.9.2 |
| Roteamento | expo-router | ~6.0.23 |
| Estilização | NativeWind (Tailwind CSS) | ^4.2.3 |
| Animações | react-native-reanimated | ~4.1.1 |
| Gráficos | react-native-svg | ^15.15.4 |
| Gradientes | expo-linear-gradient | ~15.0.8 |
| Ícones | @expo/vector-icons (Ionicons) | ^15.0.3 |
| Armazenamento | expo-secure-store | ~15.0.8 |
| Imagens | expo-image-picker | ~17.0.11 |

---

## Estrutura do projeto

```
HealthMind/
├── app/                              # expo-router — rotas baseadas em arquivos
│   ├── _layout.tsx                   # Root layout (SplashScreen + AuthContext)
│   ├── index.tsx                     # Redirect inteligente (auth → onboarding → home)
│   ├── onboarding.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (protected)/
│       ├── _layout.tsx               # Stack + SideMenu global
│       ├── (tabs)/                   # Bottom tab navigation
│       │   ├── home.tsx
│       │   ├── diary.tsx
│       │   ├── activities.tsx
│       │   ├── community.tsx
│       │   ├── profile.tsx
│       │   ├── calendar.tsx          # Tab exclusivo: profissional
│       │   └── patients.tsx          # Tab exclusivo: profissional
│       ├── settings.tsx
│       ├── checkin.tsx
│       ├── breathing.tsx
│       ├── appointments.tsx
│       ├── notifications.tsx
│       ├── mood-insights.tsx
│       ├── find-professional.tsx
│       ├── diary-create.tsx
│       ├── community-create.tsx
│       ├── profile-account.tsx
│       ├── profile-privacy.tsx
│       ├── profile-notifications.tsx
│       ├── profile-subscription.tsx
│       └── profile-help.tsx
│
├── src/
│   ├── core/
│   │   ├── auth/                     # AuthContext + useAuth hook
│   │   ├── constants/                # ROUTES centralizadas
│   │   ├── theme/                    # ThemeContext, paleta de cores, dark mode
│   │   └── types/                    # Tipos globais do domínio (User, MoodType…)
│   │
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── usecases/
│   │
│   ├── data/
│   │   └── fake/                     # JSON fake data (API-ready)
│   │
│   ├── services/                     # Camada de serviços — um por módulo
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── diary/
│   │   ├── mood/
│   │   ├── breathing/
│   │   ├── appointments/
│   │   ├── notifications/
│   │   ├── professionals/
│   │   ├── activities/
│   │   ├── community/
│   │   ├── profile/
│   │   ├── settings/
│   │   ├── subscription/
│   │   ├── progress/
│   │   ├── contents/
│   │   └── api/
│   │
│   └── presentation/
│       ├── components/               # Componentes reutilizáveis por domínio
│       │   ├── ui/                   # AppText, AppCard, AppButton, AppInput, AppHeader
│       │   ├── layout/               # ScreenContainer
│       │   ├── navigation/           # TopBar, SideMenu, NotificationBell
│       │   ├── dashboard/            # GreetingHeader, MoodSelector, ActivityCard…
│       │   ├── breathing/            # BreathingCircle, PhaseLabel, controls
│       │   ├── appointments/         # AppointmentsCalendar, cards, modais
│       │   ├── notifications/        # NotificationItem, lista agrupada
│       │   ├── mood/                 # MoodSummaryCard, gráficos
│       │   ├── diary/                # DiaryCard, filtros
│       │   ├── professionals/        # ProfessionalCard, filtros, perfil
│       │   └── profile/              # SettingsOptionCard, LogoutConfirmationModal
│       ├── controllers/              # Custom hooks (padrão Controller)
│       ├── context/                  # NavigationContext (SideMenu state)
│       └── screens/                  # Telas por domínio
│
└── assets/
    └── images/
        └── onboarding/
```

---

## Arquitetura

O app segue **Clean Architecture** adaptada para React Native:

```
Tela (Screen)
  └── Controller (custom hook — lógica e estado)
        └── Service (regras de negócio)
              └── Data Layer (fake JSON → futuramente API REST)
```

- **Screens** — apenas renderização, sem lógica de negócio
- **Controllers** — `use*Controller.ts` expõem estado e handlers para as telas
- **Services** — acesso a dados, transformações, subscriber patterns
- **ROUTES** — todas as navegações passam por `src/core/constants/routes.ts`; trocar uma rota é uma edição em um único lugar

---

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org) >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- Para iOS: macOS com Xcode instalado
- Para Android: Android Studio com emulador configurado, ou dispositivo físico com Expo Go

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/healthmind.git
cd healthmind

# Instale as dependências
npm install
```

### Executando

```bash
# Iniciar o servidor de desenvolvimento
npx expo start

# Abrir diretamente no emulador Android
npx expo start --android

# Abrir diretamente no simulador iOS
npx expo start --ios

# Build de produção (EAS Build)
eas build --platform android
eas build --platform ios
```

Após iniciar, escaneie o QR code com o app **Expo Go** (Android/iOS) ou pressione `a` para abrir no emulador Android / `i` para iOS.

---

## Variáveis de ambiente

O projeto não exige variáveis de ambiente para rodar localmente — os dados são servidos pela camada `data/fake`. Para integrar com uma API real, crie um arquivo `.env` na raiz:

```env
EXPO_PUBLIC_API_URL=https://sua-api.com
```

E ajuste `src/services/api/ApiService.ts` para usar a URL configurada.

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
