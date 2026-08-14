# ComplexManager — Requirements Backlog / Бэклог требований

This file contains requirements and design questions that have already been mentioned during discussion but are not yet sufficiently specified to become final implementation requirements. Nothing listed here is considered forgotten. Each item must be resolved before the relevant feature is finalized.

Этот файл содержит требования и вопросы проектирования, которые уже были озвучены в процессе обсуждения, но пока недостаточно определены для включения в окончательную реализацию. Ничего из перечисленного здесь не считается забытым. Каждый пункт должен быть рассмотрен и либо перенесён в спецификацию, либо явно исключён.

## 1. Task / Задача

- Define the complete Task data model: fields, description, creator, assignee, related entities, attachments, comments, dates and deadlines.
- Определить полную модель Task: поля, описание, создатель, исполнитель, связанные сущности, документы, комментарии, даты и сроки.

- Define Task statuses and allowed transitions.
- Определить статусы Task и допустимые переходы между ними.

- Define exactly who can create, edit, assign, approve, reject, reopen and close a Task.
- Определить, кто именно может создавать, изменять, назначать, утверждать, отклонять, повторно открывать и закрывать Task.

- Define the rules for when a Task requires a tender and when a direct purchase/service is permitted.
- Определить правила, когда для Task обязателен тендер, а когда допускается прямое приобретение/заказ услуги.

- Define Board approval rules, including whether one Chairman or multiple Board Members must approve.
- Определить правила утверждения правлением, включая вопрос: достаточно ли утверждения Chairman или требуется несколько Board Members.

- Define deadlines, comments, notifications and audit/history requirements for Tasks.
- Определить сроки, комментарии, уведомления и требования к истории изменений Task.

## 2. Tender / Тендер

- Define the Tender entity and its relationship to Task and Contractor.
- Определить сущность Tender и её связь с Task и Contractor.

- Define the minimum information stored for each contractor proposal: price, scope, conditions, validity period and attached commercial offer.
- Определить минимальный набор данных предложения подрядчика: цена, состав работ, условия, срок действия предложения и приложенное коммерческое предложение.

- Define how the selected proposal is recorded and approved by the Board.
- Определить, как выбранное предложение фиксируется и утверждается правлением.

## 3. Financial Controller / Финансовый контролёр

- Define the complete checklist/workflow used by the Financial Controller to review a Task.
- Определить полный checklist/workflow, по которому финансовый контролёр проверяет Task.

- Define required checks for tender completeness, contractor proposals, price reasonableness, contracts, work evidence, Board acceptance and payment evidence.
- Определить обязательные проверки: наличие тендера, предложения подрядчиков, обоснованность цены, договор, доказательства выполнения, подтверждение приёмки правлением и подтверждение оплаты.

- Define how the Financial Controller can add an independent/alternative commercial offer discovered during the review.
- Определить, как финансовый контролёр добавляет независимое/альтернативное коммерческое предложение, найденное им в ходе проверки.

- Define the distinction between Board approval of completed work and Financial Controller approval of financial correctness.
- Чётко разделить подтверждение фактического выполнения работы правлением и финансовую проверку со стороны Financial Controller.

- Define what happens when the Financial Controller finds a problem or price discrepancy.
- Определить, что происходит, если финансовый контролёр обнаруживает проблему или существенное расхождение в цене.

## 4. Board / Правление

- Define the Board/Chairman workflow for creating tasks, approving contractor proposals and confirming completed work.
- Определить workflow правления/Chairman для создания задач, утверждения предложений подрядчиков и подтверждения выполненных работ.

- Define whether Board Members can approve independently or whether approvals require a quorum/multiple approvals.
- Определить, могут ли члены правления утверждать самостоятельно или требуется кворум/несколько подтверждений.

## 5. Documents / Документы

- Define the complete document type/category catalog.
- Определить полный каталог типов/категорий документов.

- Define whether one Document can have multiple business relations or exactly one primary relation.
- Определить, может ли один Document иметь несколько бизнес-связей или только одну основную связь.

- Define document versioning and replacement rules.
- Определить правила версионирования и замены документов.

- Define who can upload, view, replace, soft-delete and restore documents.
- Определить, кто может загружать, просматривать, заменять, помечать на удаление и восстанавливать документы.

- Define audit information for document actions.
- Определить аудит действий с документами.

## 6. Billing / Начисления и платежи

- Define whether annual charges are always equal for every resident or may differ by apartment/unit, ownership status or other rules.
- Определить, всегда ли годовое начисление одинаково для всех жильцов или может различаться по квартире/помещению, статусу собственника или другим правилам.

- Define the exact invoice/receipt fields and PDF template.
- Определить точные поля квитанции и шаблон PDF.

- Define payment recording: manual entry, bank statement import, attachment of proof, payment date, amount and payer.
- Определить порядок фиксации оплаты: ручной ввод, импорт банковской выписки, прикрепление подтверждения, дата, сумма и плательщик.

- Define handling of partial payments, overpayments, corrections, refunds and unpaid invoices.
- Определить обработку частичных оплат, переплат, корректировок, возвратов и неоплаченных квитанций.

- Define the exact meaning and calculation rules for Total Charged, Total Paid and Outstanding Balance.
- Определить точный смысл и правила расчёта Total Charged, Total Paid и Outstanding Balance.

- Define whether Send to All can be repeated and how duplicate invoice generation is prevented.
- Определить, можно ли повторно запускать Send to All и как предотвращать создание дубликатов квитанций.

## 7. Users, Residents and Units / Пользователи, жильцы и квартиры

- Define the relationship between User, Resident, Apartment/Unit and ownership/occupancy.
- Определить связь между User, Resident, Apartment/Unit и статусом собственности/проживания.

- Define whether one apartment can have multiple residents/users and whether one person can be associated with multiple units.
- Определить, может ли одна квартира иметь нескольких жильцов/пользователей и может ли один человек быть связан с несколькими помещениями.

- Define resident lifecycle: move-in, move-out, replacement, inactive users and historical ownership.
- Определить жизненный цикл жильца: заселение, выселение, замена жильца, неактивные пользователи и история владения.

## 8. Permissions / Разрешения

- Define the complete role-to-permission matrix for all roles, including Guest.
- Определить полную матрицу Role → Permission для всех ролей, включая Guest.

- Define whether permissions are assigned only to roles or may also be overridden for individual users.
- Определить, назначаются ли permissions только ролям или могут индивидуально переопределяться для отдельных пользователей.

- Define resource-level permissions for documents, financial records, tasks and other sensitive data.
- Определить permissions на уровне отдельных ресурсов для документов, финансовых записей, задач и других чувствительных данных.

## 9. Localization / Локализация

- Define the translation storage model and translation management workflow.
- Определить модель хранения переводов и процесс управления переводами.

- Define which user-generated content must also be multilingual.
- Определить, какой контент, создаваемый пользователями, также должен поддерживать несколько языков.

- Define fallback language behavior when a translation is missing.
- Определить поведение системы при отсутствии перевода: fallback language и правила его выбора.

## 10. Data Architecture / Архитектура данных

- Select the final Firebase/Firestore data model after the logical domain model is complete.
- После завершения логической модели предметной области определить окончательную модель данных Firebase/Firestore.

- Define Firestore collections, document structure, indexes, security rules and storage structure.
- Определить collections Firestore, структуру документов, индексы, Security Rules и структуру file storage.

- Define backup/export/recovery requirements for the demonstration system.
- Определить требования к резервному копированию, экспорту и восстановлению для демонстрационной системы.

## 11. Transparency, Audit and Governance / Прозрачность, аудит и регламент

- Define the audit trail: who created, changed, approved, rejected, uploaded, deleted/soft-deleted and paid each item.
- Определить журнал аудита: кто создал, изменил, утвердил, отклонил, загрузил, удалил/пометил на удаление и оплатил каждую сущность.

- Define which financial and operational information must be visible to residents.
- Определить, какая финансовая и операционная информация должна быть доступна жильцам для контроля.

- Define the future Board-approved operating regulation for the Management Company.
- Позднее подготовить регламент работы Management Company, утверждаемый правлением.

- Define the future Financial Controller regulation and checklist.
- Позднее подготовить регламент работы Financial Controller и его checklist.

- Define the future user Help/Guide based on the implemented functionality.
- Позднее подготовить Help/руководство пользователя на основе реализованного функционала.

- Define the future Board-approved agreement/policy describing transparent procurement, documentation, approvals and financial control.
- Позднее подготовить положение/соглашение, утверждаемое правлением, описывающее прозрачные закупки, документирование, утверждения и финансовый контроль.
