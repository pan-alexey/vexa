1. Все виджеты организуются в плоскую структуру
2. В качестве child генерируются уникальные id, которые будут потом заменены
3. Рекурсивно заполняем child из плоской структуры.

Рендер можно сделать параллельно
Плоская структура виджета будет состоять из
```
widgets = {
  'widget_100200300': {
    id: 
    name: 'widget.name',
    props: {},
    children: 'children_100200300'
    context: [
      { name: 'context.name', props: {} },
      { name: 'context.name', props: {} }
    ]
  },
  'widget_100200301': {
    name: 'widget.name',
    props: {},
    context: [
      { name: 'context.name', props: {} },
      { name: 'context.name', props: {} }
    ]
  }
  'widget_100200303': {
    name: 'widget.name',
    props: {},
    context: [
      { name: 'context.name', props: {} },
      { name: 'context.name', props: {} }
    ]
  }

```

Дочерние элементы внутри виджета выглядит примерно так:
```
children = {
  children_100200300: [
    'widget_100200301',
    'widget_100200303',
  ]
}
```