# User_management

Чтобы начать работать с сервисами, нужно:

1. Прописать свой .env файл на основе .env.example

2. Установить зависимости,создать и наполнить таблицы:

```
npm install
make create_db
make migrate_latest
```

3. Запустить сервис

```
make start_service
```

4. Производить соответсвующие запросы через postman или curl

Диаграмма сущностей:
https://drive.google.com/file/d/1DyAXSyNb6ZzeN5yZ2xSiRzilOBLw-jA_/view

Адрес документации: /api/docs
