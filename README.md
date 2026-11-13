# 🏭 ERP Grupo Hmaz — Plataforma Mobile & Web

Aplicação móvel e web responsiva desenvolvida para o **Grupo Hmaz**, focada na gestão de produção industrial e acompanhamento de chão de fábrica em tempo real. Este projeto expande o ecossistema do ERP Web da empresa utilizando uma abordagem **UI-First**, priorizando usabilidade ágil, clareza visual e rapidez de operação.

---

## 🔑 Credenciais de Acesso Temporário (Para Avaliação do Professor)

Como o projeto encontra-se na **Fase 1 (Foco em Frontend / UI-First)** sem acoplamento obrigatório ao banco de dados em nuvem, foi configurado um **Login Temporário (*devLogin*)** no contexto de autenticação (`AuthContext.tsx`). 

Para aceder ao sistema e testar todas as telas, utilize os dados abaixo na tela de Login:

| Campo | Credencial Temporária | Observação |
| :--- | :--- | :--- |
| **E-mail / Utilizador** | `admin@hmaz.com.br` | Aceita este e-mail padrão (ou qualquer e-mail de teste) |
| **Senha / Palavra-passe** | `123456` | Aceita esta senha padrão (ou qualquer combinação de teste) |
| **Acesso Rápido (Bypass)** | **Botão Modo Dev / Entrar** | Basta clicar em **Entrar** (ou no botão de acesso rápido de desenvolvimento) para autenticar a sessão imediatamente |

---

## 🎯 Casos de Uso e Funcionalidades (Fase 1)

O sistema encontra-se estruturado em **5 Casos de Uso principais**:

1. **UC01 — Autenticação e Controle de Acesso (`Login / Logout`):**
   * Interface de autenticação com suporte a **Login Temporário (*devLogin*)** para validação imediata da interface e fluxo completo de encerramento de sessão (*Logout*).
2. **UC02 — Monitoramento de Indicadores da Fábrica (`Dashboard Inicial`):**
   * Visualização rápida de cartões de KPI (Total de Pedidos, Máquinas em Produção e Clientes ativos) e gráfico em barra de progresso demonstrando a ocupação e distribuição da fábrica (*Novos, Fábrica e Prontos*).
3. **UC03 — Gestão e Avanço de Etapas de Produção (`Quadro Kanban`):**
   * Quadro interativo com deslize horizontal (*snapping*) dividido em 5 colunas: *Novos Pedidos, Em Produção, Revisão, Finalizados e Descartados*.
   * Cartões expansíveis com indicadores visuais de prioridade (*Alta, Média, Baixa*) e botões de ação rápida para avançar o pedido de etapa dinamicamente.
4. **UC04 — Cadastro de Novos Pedidos de Produção (`Ação Rápida FAB`):**
   * Gatilho de ação rápida através de botão flutuante (*Floating Action Button*) preparado para a inserção de novas ordens de fabrico.
5. **UC05 — Gestão do Diretório de Clientes (`Consulta e Ações`):**
   * Diretório organizado em lista vertical com cartões expansíveis que exibem empresa, representante, telefone, localização e atalhos para edição cadastral e histórico de pedidos.

---

## 🚀 Tecnologias Utilizadas

* **[React Native](https://reactnative.dev/) & [Expo](https://expo.dev/):** Base para desenvolvimento multiplataforma nativo (Android e iOS) e suporte responsivo para Web.
* **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática para maior segurança, previsibilidade e manutenção do código.
* **[Expo Router](https://docs.expo.dev/router/introduction/):** Sistema de rotas baseado em ficheiros (*File-based routing*), gerindo a transição entre a autenticação e a navegação principal por abas (*Bottom Tabs*).
* **[NativeWind (Tailwind CSS)](https://www.nativewind.dev/):** Estilização utilitária moderna, garantindo consistência visual, suporte a tema escuro e responsividade.
* **[Lucide React Native](https://lucide.dev/) & `react-native-svg`:** Biblioteca de ícones vetoriais leves e adaptados para interfaces móveis industriais.
* **React Context API (`AuthContext`):** Gestão global de estado para controlo de sessão e proteção de rotas.

---

## 📂 Estrutura do Projeto

```text
hmaz-mobile/
├── src/
│   ├── app/                        # Rotas da aplicação (Expo Router)
│   │   ├── (tabs)/                 # Navegação principal por abas inferiores
│   │   │   ├── _layout.tsx         # Configuração da barra de abas (Bottom Tabs)
│   │   │   ├── index.tsx           # Tela Início (Dashboard, KPIs e Gráfico)
│   │   │   ├── pedidos.tsx         # Tela de Pedidos (Quadro Kanban Interativo)
│   │   │   └── clientes.tsx        # Tela de Clientes (Diretório Expansível)
│   │   ├── _layout.tsx             # Layout raiz e verificação de autenticação
│   │   └── login.tsx               # Tela de Login e acesso rápido (devLogin)
│   └── context/
│       └── AuthContext.tsx         # Contexto de autenticação e estado do utilizador
├── assets/                         # Imagens, ícones e recursos estáticos
├── global.css                      # Diretivas globais do Tailwind CSS
├── tailwind.config.js              # Configuração de temas e classes do NativeWind
├── babel.config.js                 # Configuração do compilador Babel
├── metro.config.js                 # Configuração do Metro Bundler com CSS
├── package.json                    # Dependências e scripts do projeto
└── tsconfig.json                   # Configurações do TypeScript
```

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado na sua máquina:
* **[Node.js](https://nodejs.org/)** (versão LTS recomendada)
* **[Git](https://git-scm.com/)**
* Aplicação **Expo Go** instalada no telemóvel ([Android - Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)) caso deseje testar num dispositivo físico.

---

## 🔧 Instalação Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/JulioDevO/projetoHmazMobile.git
   ```

2. **Entre na pasta raiz do projeto:**
   ```bash
   cd hmaz-mobile
   ```

3. **Instale as dependências do projeto:**
   *(Utilize a flag `--legacy-peer-deps` para evitar conflitos de versão entre pacotes de tipagem do React 19)*
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Garanta a instalação do motor de ícones SVG compatível com o Expo:**
   ```bash
   npx expo install react-native-svg
   ```

---

## ▶️ Como Executar o Projeto

1. **Inicie o servidor de desenvolvimento limpando o cache:**
   ```bash
   npx expo start -c
   ```
   *(Caso esteja numa rede pública ou corporativa que bloqueie a ligação local, utilize `npx expo start --tunnel`).*

2. **Escolha onde deseja visualizar a aplicação:**
   * **No Telemóvel (Android / iOS):** Leia o código QR exibido no terminal com a aplicação **Expo Go** (no Android) ou diretamente com a **Câmara** (no iPhone).
   * **Via Cabo USB (Android com Depuração USB ativa):** Pressione a tecla **`a`** no terminal.
   * **No Navegador (Versão Web):** Pressione a tecla **`w`** no terminal ou aceda a `http://localhost:8081`.

---

## 💡 Guia Rápido de Utilização (Para Avaliação)

1. **Acesso ao Sistema (Login):**
   * Utilize as credenciais temporárias (`admin@hmaz.com.br` / `123456`) ou toque diretamente no botão de acesso rápido de desenvolvimento para entrar no sistema.
2. **Navegação no Dashboard (`Início`):**
   * Consulte os indicadores de Pedidos, Produção e Clientes no topo e a barra visual de distribuição da fábrica. O botão **Encerrar Sessão** no final da página permite testar o fluxo de *logout*.
3. **Interação com o Kanban (`Pedidos`):**
   * Deslize horizontalmente para alternar entre as colunas (*Novos, Produção, Revisão, Finalizados e Descartados*).
   * Toque sobre qualquer cartão de pedido para **expandir os detalhes** e utilize o botão de ação para **mover o pedido em tempo real** para a próxima etapa da fábrica.
4. **Consulta de Clientes (`Clientes`):**
   * Toque sobre qualquer cliente da lista para expandir os dados de contacto (telefone e localização) e visualizar os atalhos de edição e histórico.