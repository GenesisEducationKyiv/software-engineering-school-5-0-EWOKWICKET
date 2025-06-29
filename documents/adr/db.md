# **ADR-002: Вибір бази даних для зберігання підписок**

**Статус**: Прийнято\
**Дата**: 2025-06-07\
**Автор**: Hushchin Ivan

## Контекст
Потрібно обрати базу даних для збереження підписок. Вимоги:
- Гнучкість
- Простота роботи з Node.js(NestJS):
   - Підтримка JSON
   - Підтримувана бібліотека або драйвер
   - Up-to-date документація

## Розглянуті варіанти

1. **MongoDB (Atlas)**
   - ➕ Гнучка схема, легко інтегрується з NestJS, мало налаштувань, легший старт через cloud-хостинг
   - ➖ Не так ефетивно підтримує зв'язки між колекціями, важчі міграції

2. **PostgreSQL**
   - ➕ ACID-транзакції, підтримка складних зв'язків та запитів, легші міграції
   - ➖ Більше ресурсів та налаштування для простих запитів

## **Прийняте рішення**
**MongoDB (Atlas)**

## Наслідки

### Позитивні:
- Гнучка схема дозволяє легко вносити зміни
- Просте масштабування через хмарний Atlas

### Негативні:
- Можлива необхідність в додатковій валідації даних
- Написання скриптів для міграції може сповільнити роботу