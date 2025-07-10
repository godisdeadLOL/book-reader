# book-reader

API для хранения книг и фронтенд для их чтения.

---

## 🌍 Попробовать

[Веб-версия](https://godisdeadlol.github.io/book-reader/)

[Swagger](https://testfull-of-test.space/book-reader/docs)

## ✨ Функционал

- 📖 Бесконечная прокрутка глав с автоматической подгрузкой
- 🔖 Возможность ставить закладки на отдельные параграфы
- 📝 Встроенный редактор книг и глав прямо в интерфейсе
- 📱 Адаптивный дизайн

## 🛠 Технологии

### Бэкенд

- **Python**
- **FastAPI** - фреймворк для создания API
- **SQLAlchemy** - ORM для работы с базой данных

### Фронтенд

- **TypeScript**
- **Preact**
- **Vite**
- **Chakra UI** - библиотека компонентов

## 🚀 Локальный запуск

Загрузите репозиторий:

```bash
git clone <repo-url>
cd <repo-folder>
```

### Бекенд

1. Перейдите в папку бекенда:

```bash
cd backend
```

2. Создайте виртуальное окружение и установите зависимости:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

3. Создайте `.env` файл

```
ACCESS_TOKEN=admin
PRODUCTION=True
```

4. Запустите сервер:

```bash
uvicorn main:app --reload
```

### Фронтенд

1. Перейдите в папку фронтенда:

```bash
cd frontend
```

2. Укажите адрес API в `.env.local`:

```env
VITE_BASE_URL=127.0.0.1:8000
```

3. Установите зависимости и запустите:

```bash
cd frontend
npm install
npm run dev
```
