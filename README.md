# book-reader

API для хранения книг и фронтенд для их чтения.

---

## 🌍 Попробовать

[Веб-версия](https://godisdeadlol.github.io/book-reader/)

[Swagger](https://testfull-of-test.space/book-reader/docs)

## ✨ Функционал

- 📖 Бесконечная прокрутка глав с автоматической подгрузкой
- 🔖 Закладки на отдельные параграфы
- 📝 **Редактирование книг и глав** — встроенный редактор прямо в интерфейсе
- 📱 Адаптивный дизайн

## 🛠 Технологии

### Бэкенд

- **Python**
- **FastAPI** - фреймворк для создания API
- **SQLAlchemy** - ORM для работы с базой данных

### Фронтенд

- **TypeScript**
- **Preact**
- **Chakra UI** -
- **Vite**

## 🚀 Локальный запуск

Загрузите репозиторий:

```bash
git clone repo
cd repo
```

### Бекенд

1. Перейдите в папки:

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

1. Укажите адрес API в `frontend/.env`:

```env
VITE_BASE_URL=127.0.0.1:8000
```

2. Установите зависимости и запустите:

```bash
cd frontend
npm install
npm run dev
```
