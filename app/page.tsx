export default function Home() {
  return (
    <div className="info">
      <div>Информация:</div>
      <div className="block">
        <div>
          1. Сайт для распределения задач между командой при совместной
          разработке.
        </div>
        <div>2. Зарегистрировать аккаунт может только админ.</div>
      </div>
      <div>Термины:</div>
      <div className="block">
        <div>1. Админ - Пользователь с правами администратора.</div>
        <div>2. Пользователь - Пользователь без правам администратора.</div>
        <div>3. Деактивация - Скрыть аккаунт/Трелло с сайта.</div>
      </div>
      <div>Аккаунты:</div>
      <div className="block">
        <div>1. Админ не может редактировать админа.</div>
        <div>
          2. Админ может редактировать только того пользователя, которого сам же
          и зарегистрировал, менять ему пароль, делать админом или деактировать
          аккаунт.
        </div>
      </div>
      <div>Трелло:</div>
      <div className="block">
        <div>
          1. Админ может создавть сколько угодно трелло и добавлять в него
          сколько угодно участников.
        </div>
        <div>2. Максимальное количество колонок - 5.</div>
        <div>
          3. Все видят только те трелло, в которых состоят. Даже админам не
          видны все трелло на сайте.
        </div>
        <div>4. Создавать могут только админы.</div>
        <div>
          5. Редактировать трелло могут только админы. (Название, список
          участников, деактивировать)
        </div>
        <div>
          6. Админы в трелло могут создавать колонки с задачами, редактировать
          их и удалять, даже если они не создатели этого трелло.
        </div>
        <div>7. Пользователь не может создавать колонки и перемещать их.</div>
        <div>8. Пользователь может создавать задачи.</div>
        <div>
          9. Пользователь может редактировать и удалять только те задачи,
          которые он сам и создал.
        </div>
        <div>
          10. Пользователь может перемещать только задачи, которые он сам создал
          или является их исполнителем.
        </div>
      </div>
      <div>Термины:</div>
      <div className="block">
        <div>
          1. Live - Отображение перемещение колонок и задач в реальном времени.
        </div>
        <div>
          2. Редактировать - Отображение кнопок создание/Удаление колонок.
          Изменение задач/Колонок, по клику на них.
        </div>
      </div>
    </div>
  );
}
