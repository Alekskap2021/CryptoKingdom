# Bybit Admin Panel - Техническое задание

## 1. Цель проекта

Разработать full-stack админ-панель для торговли на Bybit API v5 на базе `TanStack Start`.
Приложение должно предоставлять защищенный кабинет пользователя с авторизацией, управлением API-ключами, получением рыночных и приватных данных Bybit в реальном времени, управлением ордерами, просмотром истории сделок и экспортом данных.

Проект стартует с пустого `TanStack Start` шаблона, в котором уже есть базовый роутинг, SSR shell и интеграция `TanStack Query`, но отсутствуют предметные бизнес-модули.

## 2. Обязательный стек

- `TanStack Start` как full-stack платформа
- `TypeScript` в строгом режиме
- `Tailwind CSS` для стилизации
- `@base-ui/react` для UI primitives
- `@tanstack/react-table` для табличных представлений
- `TanStack Query` для серверного состояния и кэша
- `TanStack Router` для роутинга и protected layouts
- `Better Auth` для auth и session management
- `Zod` для схем и валидации
- `axios` для REST-запросов
- `lucide-react` для иконок
- `Bybit API v5` через REST и WebSocket
- `.env` и server-side config для секретов

## 3. Scope MVP

### 3.1 Аутентификация и безопасность

- Регистрация пользователя
- Вход/выход
- Сессионная авторизация через `Better Auth`
- Двухфакторная аутентификация (2FA) по TOTP
- Защищенные dashboard-маршруты

### 3.2 Профиль и интеграция биржи

- Просмотр и редактирование профиля
- Добавление, редактирование и удаление Bybit API keys
- Серверное хранение ключей
- Проверка доступности и корректности ключей

### 3.3 Trading dashboard

- Реал-тайм баланс аккаунта
- Реал-тайм позиции
- Реал-тайм открытые ордера
- Создание ордеров
- Отмена ордеров
- Редактирование ордеров
- Просмотр графика по выбранному инструменту
- История сделок с фильтрацией
- Экспорт истории сделок в CSV

### 3.4 UX и delivery

- Responsive layout для desktop/tablet/mobile
- Скелетоны, error states, empty states
- README с инструкцией запуска
- `.env.example`
- `Dockerfile`
- Базовое тестовое покрытие для критичных сценариев

## 4. Нефункциональные требования

- Все данные и server contracts должны быть типизированы и валидированы через `Zod`
- Секреты и API-ключи не должны попадать в клиентский bundle
- Работа с приватными эндпоинтами Bybit должна выполняться только на сервере
- SSR shell не должен ломать работу auth и protected routes
- Реал-тайм обновления должны синхронизироваться с `TanStack Query` cache
- Архитектура должна оставаться расширяемой без преждевременного дробления слоев
- Ошибки API должны иметь предсказуемый формат для UI
- Интерфейс должен быть пригоден для работы на мобильных экранах

## 5. Архитектурные ограничения и подход

### 5.1 Структура проекта

На старте использовать минимально достаточную FSD-структуру:

- `src/app` - глобальные провайдеры, роутинг, layout, app-wide config
- `src/pages` - route-level страницы и локальная page-логика
- `src/shared` - инфраструктурные UI, lib, config, api helpers

Слои `features`, `entities`, `widgets` добавлять только после подтвержденного переиспользования.

### 5.2 Рекомендуемая структура доменов

```text
src/
  app/
    layout/
    providers/
    router/
  pages/
    auth/
    dashboard/
    settings/
  shared/
    api/
    auth/
    config/
    lib/
    ui/
```

### 5.3 Роутинг

Целевой маршрутный каркас:

```text
/
/auth/login
/auth/register
/dashboard
/dashboard/orders
/dashboard/history
/dashboard/settings/profile
/dashboard/settings/api-keys
```

Допускается использование pathless layout для защищенной части приложения, например:

```text
/auth/*
/_protected/*
```

где проверка авторизации выполняется через `beforeLoad`.

## 6. Системная архитектура

### 6.1 Клиентский слой

- `TanStack Router` управляет страницами и protected layouts
- `TanStack Query` кэширует данные аккаунта, позиций, ордеров, истории
- UI получает данные через route loaders, query hooks и query invalidation
- Реал-тайм обновления доставляются через WebSocket manager и синхронизируют cache

### 6.2 Серверный слой

- Server functions используются для auth actions, profile mutations, API key CRUD, order actions, CSV export
- Server-only config читает `.env` и валидирует значения через `Zod`
- REST-запросы к Bybit выполняются через `axios`
- Подпись приватных запросов и работа с секретами живут только на сервере

### 6.3 Внешние системы

- `Bybit REST API v5` для приватных и публичных запросов
- `Bybit WebSocket` для стримов баланса, позиций, ордеров и market data
- `Better Auth` для auth/session и 2FA
- Локальная БД или файл SQLite для пользователей, сессий, 2FA и encrypted API keys

## 7. Ключевые бизнес-модули

### 7.1 Auth module

- регистрация
- логин
- logout
- session fetch
- enable/disable 2FA
- verify 2FA challenge

### 7.2 Profile module

- данные пользователя
- настройки аккаунта
- список подключенных Bybit ключей

### 7.3 API Key module

- создание ключа
- редактирование label/permissions metadata
- удаление ключа
- серверная проверка валидности
- шифрование перед сохранением

### 7.4 Bybit integration module

- серверный REST client
- signing utility
- private endpoints: wallet, positions, open orders, order history, executions
- public endpoints: symbols, klines, tickers
- WebSocket manager

### 7.5 Order management module

- place order
- cancel order
- amend order
- optimistic UI только там, где это безопасно

### 7.6 Analytics/history module

- trade history table
- filters by symbol, side, date range
- CSV export

## 8. Требования к безопасности

- `BETTER_AUTH_SECRET`, encryption secrets и API credentials должны использоваться только на сервере
- Bybit API keys хранить в зашифрованном виде
- На клиент отправлять только безопасные metadata-данные о ключах
- Любая операция с приватным Bybit API проходит через server function
- Для order actions обязательно логировать user id, account id, symbol, side и результат операции
- Ошибки подписи, доступа и rate limit должны быть явно различимы на UI

## 9. Требования к работе с Bybit

- REST-слой должен иметь единый typed wrapper для всех запросов
- Ответы Bybit должны нормализоваться во внутренние типы приложения
- WebSocket-события не должны напрямую менять локальный state в компонентах
- Все real-time обновления должны проходить через адаптер, который обновляет `TanStack Query` cache
- Order workflow должен завершаться query invalidation или cache sync

## 10. Графики

Для графика использовать `TradingView Lightweight Charts` как основной вариант для свечных данных.
`Recharts` допускается для вторичных summary-графиков и KPI-визуализаций.

Минимальные возможности графика:

- выбор символа
- выбор таймфрейма
- подгрузка свечей
- корректная работа в responsive layout

## 11. Таблицы

Все основные таблицы строить на `TanStack Table`:

- balances
- positions
- open orders
- trade history

Требования:

- сортировка
- фильтрация где уместно
- empty state
- loading state
- mobile-friendly деградация

## 12. UX/UI требования

- Основной shell: header, sidebar/nav, content area
- На mobile вместо постоянного sidebar использовать drawer/sheet паттерн
- Все формы должны иметь client-side и server-side validation
- Для long-running действий показывать pending states
- Для real-time блоков показывать timestamp последнего обновления

## 13. ENV контракт

Минимальный набор переменных:

```env
NODE_ENV=
APP_URL=
BETTER_AUTH_SECRET=
DATABASE_PATH=
APP_ENCRYPTION_KEY=
BYBIT_REST_BASE_URL=
BYBIT_WS_PUBLIC_URL=
BYBIT_WS_PRIVATE_URL=
```

При необходимости могут быть добавлены:

```env
COOKIE_DOMAIN=
LOG_LEVEL=
CSV_EXPORT_DIR=
```

Каждая переменная должна валидироваться при старте приложения.

## 14. Тестовая стратегия

Минимальный обязательный набор:

- unit/contract tests для env config, auth validation, Bybit response normalization
- integration tests для auth flow и order actions
- smoke tests для protected routes и API key management
- ручной checklist для real-time, mobile и CSV export

## 15. Артефакты поставки

- Исходный код приложения
- `.env.example`
- `Dockerfile`
- README с setup flow
- техническое ТЗ
- JSON-бэклог атомарных задач
- test checklist / smoke сценарии

## 16. Критерии приемки

Проект считается готовым к MVP-демо, если:

- пользователь может зарегистрироваться, войти и пройти 2FA
- защищенные маршруты закрыты для неавторизованных пользователей
- пользователь может сохранить Bybit API keys без утечки секретов в клиент
- dashboard показывает баланс, позиции и ордера
- создание, отмена и редактирование ордера работают через сервер
- история сделок отображается и экспортируется в CSV
- приложение адаптивно и корректно работает на мобильной ширине
- есть `.env.example`, `Dockerfile`, README и базовые тесты критичных сценариев
