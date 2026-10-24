(function(){
  'use strict';
  const slides=[
    {section:'Видение',tag:'ПРОЕКТ РОБОТИЗАЦИИ ПАСЕК · GANEA GROUP',title:'WALL-E.<br><em>От пасеки к автономии.</em>',lead:'Мобильная роботизированная система, которая берёт на себя повторяемую физическую работу с ульями и рамками.',points:['Используем существующий стандарт ульев Ganea.','Проектируем систему целиком: робот, управление, станция.','Начинаем с цифровых испытаний и проверяем механику на стенде.'],badge:'Сегодня: исследованная концепция и план R&D. Робот и работающий симулятор ещё не созданы.',kind:'hero',notes:'Игорь, я предлагаю построить не просто одну машину, а платформу роботизации пасек. У нас уже есть архитектура и исследование технологий, которые можно использовать. Самая сложная и важная часть — безопасная работа с рамкой в существующем улье. Здесь перед вами условная интерактивная визуализация: она показывает направление разработки, но это не готовый CAD или работающий робот.'},
    {section:'Бизнес-цель',tag:'ЗАЧЕМ ЭТО НУЖНО',title:'Измерять не роботов.<br><em>Измерять труд.</em>',lead:'Целевая метрика проекта — сколько людей и человеко-часов требуется для обслуживания 1000 ульев при сохранении результата.',points:['Предварительная оценка текущей нагрузки: 3–4 сотрудника на 1000 ульев.','Обсуждаемая амбиция: 1 сотрудник на 1000 ульев.','Условие: не ухудшить здоровье пчёл, объём и качество производства.'],badge:'Числа 3–4 и 1 — исходные оценки и целевая гипотеза, а не подтверждённые KPI.',kind:'kpi',notes:'У нас есть цель, но нет подтвержденного замера текущей численности и полного перечня рабочих операций. Для управления проектом понадобятся реальные затраты человеко-часов по задачам, странам и сезонам. Мы будем считать не количество роботов, а экономию времени при сохранении биологических и производственных показателей.'},
    {section:'Операционный цикл',tag:'ПЕРВЫЙ ПРИОРИТЕТНЫЙ СЦЕНАРИЙ',title:'Одна рамка.<br><em>Полный цикл.</em>',lead:'WALL-E не ограничивается осмотром. Он должен доставить нужную рамку в пункт B и позже вернуть именно её в исходный слот.',points:['Улей A, слот S, рамка F — индивидуальная идентификация.','Две отдельные миссии с паузой между ними.','После перезапуска система сохраняет связь F → A:S.'],badge:'Назначение пункта B и допустимость длительного изъятия рамки уточняются с главным пчеловодом.',kind:'cycle',notes:'Это центральный слайд. Проходим все восемь шагов. Ключевой момент: после передачи рамки в B робот может заниматься другими задачами, а возврат запускается только по отдельному событию. Реестр точно знает, откуда рамку забрали. Биологические детали и возможность возврата после обработки должны быть подтверждены пчеловодами Ganea.'},
    {section:'Архитектура',tag:'ЧЕТЫРЕ КОМПОНЕНТА СИСТЕМЫ',title:'Не один робот.<br><em>Единая система.</em>',lead:'Разделяем движение, управление, технологическую станцию и сам улей — так компоненты можно менять независимо.',points:['WALL-E Robot — ходовая часть, манипулятор, кассета.','WALL-E Brain — задания, навигация, идентичность и безопасность.','Station B и существующие ульи Ganea — места передачи рамки.'],badge:'WALL-E Hive как новый тип улья не нужен.',kind:'network',notes:'Мы не собираемся заменять ульи на дорогую новую конструкцию наподобие Beewise. Берем имеющиеся идентичные ульи как стандарт. В систему входят сам робот, программная «мозговая» часть, возможная станция B и обычные ульи. Каждая сущность имеет четкий интерфейс. В приложении можно нажимать на блоки и видеть их функции.'},
    {section:'Конструкция робота',tag:'ПРЕДВАРИТЕЛЬНАЯ КОМПОНОВКА',title:'Гусеницы.<br><em>Точная механика.</em>',lead:'Для первой модели выбрана гусеничная база с точной стыковкой и специализированным механизмом работы с рамкой.',points:['Гусеницы — грунт, колея, уклоны; устойчивость проверяется.','Манипулятор — открыть крышку, извлечь и вернуть рамку.','Кассета — надёжно удержать груз в дороге.','Датчики — обнаружение, позиционирование, диагностика.'],badge:'Показана концептуальная геометрия. Приводы, усилия, масса и размеры ещё не рассчитаны.',kind:'parts',notes:'Смысл не в том, чтобы спроектировать универсальную дорогую руку с шестью осями. Мы рассмотрим узкоспециализированную механику под одинаковые ульи — например, направляемое поднятие, захват и кассету. Ключевые риски: прополис, малые зазоры, соседние рамки, стабилизация и повреждение сот. Поэтому механизм первым делом испытываем отдельно на стенде.'},
    {section:'Цифровая лаборатория',tag:'СИМУЛЯЦИЯ ДО ИЗГОТОВЛЕНИЯ',title:'Сначала<br><em>виртуальная пасека.</em>',lead:'Воссоздадим рельеф, ульи и робота в физическом симуляторе. Затем сможем проверять варианты конструкции до затрат на металл.',points:['CAD/параметрические модели → ROS 2 + Gazebo.','Движение по грунту, стыковка, коллизии, суставы, груз.','Параметры меняются: уклон, масса, трение, препятствия.'],badge:'Управление ниже — лишь иллюстрация будущих параметров, НЕ физический симулятор.',kind:'sandbox',notes:'Сегодня на этом экране показан только интерактивный макет будущей среды. Настоящий симулятор нам предстоит собрать на ROS 2 Jazzy и Gazebo Harmonic. В него можно будет импортировать рельеф реальной пасеки и реальные размеры ульев. Измерения в виртуальной модели не будут считаться доказательством работоспособности в поле, пока мы не откалибруем параметры по физическим испытаниям.'},
    {section:'Метод разработки',tag:'ПОЭТАПНАЯ ПРОВЕРКА РИСКОВ',title:'Сначала доказать.<br><em>Потом масштабировать.</em>',lead:'Не переходим к следующему этапу по календарю — переходим после проверяемого результата.',points:['Оцифровка улья и участка → параметрическая модель.','Отдельная механика рамки → интеграция с роботом.','Цифровые тесты → стенд → реальная пилотная пасека.'],badge:'Удачный виртуальный прогон не заменяет испытание в пчеловодстве.',kind:'gates',notes:'Предлагаю stage-gate подход. Сначала доказать, что механизм может открыть улей и извлечь рамку без опасного контакта. Потом транспортировка, точная стыковка и полный цикл. После этого механический стенд, физический прототип и испытания на одной реальной пасеке. При отрицательном результате возвращаемся к конструкции, а не разворачиваем сотню дефектных машин.'},
    {section:'Что уже подготовлено',tag:'РЕЗУЛЬТАТ ПРЕДВАРИТЕЛЬНОЙ РАБОТЫ',title:'Начинаем не<br><em>с чистого листа.</em>',lead:'Выполнено исследование открытых робототехнических решений и подготовлена проверяемая архитектура цифрового прототипа.',points:['Каталог из 63 программных проектов и технических ресурсов.','42 записи с утверждениями и ссылками на доказательства.','20 функций полного цикла сопоставлены с готовыми решениями.','Написано техническое задание и проведена независимая перепроверка.'],badge:'Это результаты исследования, не испытания готового оборудования.',kind:'research',notes:'Мы смотрели GitHub, научные примеры и официальные документации. Готового открытого робота, реализующего наш конкретный двухсторонний цикл в типовом улье, мы не подтвердили. Но базовые системы навигации, физической симуляции и управления манипуляторами не нужно писать с нуля. Остаются собственная механика и интеграция. Ключевой стек: ROS 2 Jazzy, Gazebo Harmonic, Nav2, MoveIt 2 и SQLite.'},
    {section:'Дорожная карта',tag:'ГОРИЗОНТ · 12 МЕСЯЦЕВ',title:'12 месяцев.<br><em>Пять контрольных точек.</em>',lead:'Это предварительный план R&D с условием прохождения технических и полевых испытаний, а не обещание серийной роботизации за фиксированный срок.',points:['0–1 месяц: требования, замеры, базовый цифровой мир.','1–3: моделирование механизма и стыковок.','3–6: физический стенд и первый прототип.','6–9: пилот на одной пасеке.','9–12: улучшения и решение о масштабировании.'],badge:'Полный KPI «1 на 1000 во всех странах за 12 месяцев» требует отдельной проверки операционной экономики.',kind:'roadmap',notes:'Год — управленческий горизонт, а не гарантия. Я предлагаю стадии с проверяемыми критериями: цифровой цикл, физическая работа с рамкой, работа на одной пилотной пасеке, экономическая оценка, решение о расширении. Если модель рамочного механизма не работает, мы узнаём об этом раньше крупных закупок. Сроки уточним после измерений и согласования команды.'},
    {section:'Что требуется от Ganea',tag:'РЕШЕНИЯ ДЛЯ ЗАПУСКА',title:'Нужен доступ<br><em>к реальной работе.</em>',lead:'Для перехода от концепции к прототипу необходимы измерения, специалисты и согласованный пилот.',points:['Один типовой улей и реальные рамки для замеров.','Главный пчеловод: регламент, ограничения, условия возврата.','Доступ к одной пилотной пасеке и её геометрии.','Инженер-механик, электроника, согласованный бюджет этапа.'],badge:'Предлагаем начать с короткого этапа измерений и инженерного стенда.',kind:'needs',notes:'На встрече необходимо договориться о конкретном следующем шаге. Просим доступ к типовым ульям и работе пчеловодов, выделенного эксперта от компании, возможность снять размеры и посмотреть участок. Параллельно нужна оценка внутренней инженерной команды. Финансирование лучше согласовывать по гейтам, сначала бюджет на измерение и стенд, а не на весь парк роботов.'},
    {section:'Приложение',tag:'ИСТОЧНИКИ И СТАТУС ДОКАЗАТЕЛЬСТВ',title:'Проверяемые<br><em>основания.</em>',lead:'Источники подтверждают наличие технологий. Физическую возможность работы с рамками в ульях Ganea ещё предстоит доказать.',points:['Отдельно представлены исследовательские материалы проекта.','Условный 3D-макет в этой презентации не является CAD или симуляцией.','Целевые показатели и сроки указаны как гипотезы.'],badge:'Все визуальные модели презентации созданы процедурно; сторонние 3D-ассеты не использовались.',kind:'sources',notes:'Этот слайд нужен в случае технических вопросов. Уточняем: официальная документация подтверждает поддержку ROS 2 Jazzy и Gazebo Harmonic, Nav2 содержит Docking Server. Мы также проверили отличие лицензий BehaviorTree.ROS2 и современный ROS 2 симулятор Clearpath. Исследовательский архив и независимый аудит доступны отдельными файлами. Наличие open source библиотек не означает, что специфичный механизм с рамкой уже решен.'}
  ];
  const cycle=[
    ['01 / ЗАДАНИЕ','Получить команду','Brain определяет рамку F, улей A и слот S.'],
    ['02 / СТЫКОВКА','Подъехать к A','Гусеничная база останавливается и выравнивает корпус.'],
    ['03 / ИЗВЛЕЧЕНИЕ','Забрать рамку F','Манипулятор открывает улей и выводит F из слота S.'],
    ['04 / ПЕРЕВОЗКА','Зафиксировать груз','F размещается в кассете; робот направляется к B.'],
    ['05 / ПЕРЕДАЧА','Оставить рамку в B','Пункт подтверждает приём. Первая миссия завершена.'],
    ['06 / ГОТОВНОСТЬ','Забрать ту же F','После независимого сигнала робот получает новую миссию.'],
    ['07 / ОБРАТНО','Доставить к улью A','Робот с F возвращается по новому маршруту.'],
    ['08 / ВОЗВРАТ','Вставить именно в A:S','Манипулятор возвращает F в исходный слот и фиксирует результат.']
  ];
  const modules=[
    ['WALL-E ROBOT','Мобильная платформа, кассета и манипулятор.'],
    ['WALL-E BRAIN','Навигация, задания, реестр ID и безопасные остановки.'],
    ['СТАНЦИЯ B','Приём, временное хранение, сигнал готовности и выдача.'],
    ['СТАНДАРТНЫЙ УЛЕЙ','Уже существующая конструкция Ganea — без нового Hive.']
  ];
  const parts=[
    ['Гусеницы','Проходимость и устойчивость на грунте — проверить на реальных профилях.'],
    ['Манипулятор','Вертикальная направляющая, захват и точная вставка рамки.'],
    ['Кассета','Фиксация рамки и контроль потери груза при движении.'],
    ['Датчики','Локализация, ближнее позиционирование и диагностика отказов.']
  ];
  const gates=[
    ['СЪЁМКА','Геометрия улья и участка, регламент пчеловода.'],
    ['CAD','Варианты захвата, кассеты, крышки, допусков.'],
    ['SIM','ROS 2 + Gazebo: движения, коллизии, навигация.'],
    ['СТЕНД','Реальные усилия, зазоры, захват и установка.'],
    ['ПИЛОТ','Операции на живой пасеке, надежность, трудочасы.']
  ];
  const roadmap=[
    ['0–1','Требования','Замерить один улей, цикл пчеловода и базовый рельеф.'],
    ['1–3','Цифровая среда','Создать сцену, логистику и отдельно проверить механику рамки.'],
    ['3–6','Прототип','Стендовый захват и первая мобильная машина.'],
    ['6–9','Пилот','Контролируемые испытания на одной пасеке, журнал ошибок.'],
    ['9–12','Решение','Оценить трудоёмкость и условия масштабирования.']
  ];
  const needs=[
    ['01','Типовой улей','Реальные размеры, крышка, рамки, допуски и массы.'],
    ['02','Пчеловод','Правила работы, прополис, допустимое время изъятия и возврата.'],
    ['03','Пилотная пасека','Доступ к площадке, фото, рельеф, проходы, статистика работы.'],
    ['04','Команда и ресурсы','Механика, электроника, IT, бюджет на измерения и стенд.']
  ];
  const sources=[
    ['Gazebo · совместимость с ROS 2','https://gazebosim.org/docs/harmonic/ros_installation/'],
    ['Nav2 · Docking Server (Jazzy)','https://docs.nav2.org/jazzy/tutorials/general_tutorials/using_docking/'],
    ['Clearpath · ROS 2 Simulator','https://docs.clearpathrobotics.com/docs/ros/tutorials/simulator/overview/'],
    ['MoveIt 2 · планирование движений','https://moveit.picknik.ai/main/index.html'],
    ['Исследовательский пакет WALL-E','https://chatgpt.com/library?file_id=libfile_ed0ff932f7a08191a1de145a71c3d040&account_id=personal']
  ];
  const state={index:0,panelOpen:true,notesOpen:false,menuOpen:false,cycleStep:0,moduleIndex:0,partIndex:0,sandboxSlope:7,sandboxLoad:60,sandboxObstacle:false,sandboxOpened:false,gateIndex:0,roadmapIndex:0,needIndex:0};
  const $=id=>document.getElementById(id);
  const panel=$('copy-panel'),graphics=$('graphics');
  function button(label,action,val,active=false){return `<button type="button" class="choice${active?' active':''}" data-action="${action}" data-value="${val}" aria-pressed="${active}">${label}</button>`;}
  function renderPanel(){
    const s=slides[state.index];$('eyebrow').textContent=s.tag;
    let controls='';
    if(s.kind==='cycle')controls=`<div class="panel-section">ШАГ ОПЕРАЦИИ</div><div class="panel-action">${button('← Назад','cycleprev',0)}${button('Далее →','cyclenext',0)}</div>`;
    else if(s.kind==='network')controls=`<div class="panel-section">ВЫБРАТЬ КОМПОНЕНТ</div><div class="panel-action">${modules.map((m,i)=>button(m[0],'module',i,i===state.moduleIndex)).join('')}</div>`;
    else if(s.kind==='parts')controls=`<div class="panel-section">ИЗУЧИТЬ КОНСТРУКЦИЮ</div><div class="panel-action">${parts.map((p,i)=>button(p[0],'part',i,i===state.partIndex)).join('')}</div>`;
    else if(s.kind==='gates')controls=`<div class="panel-section">ВЫБРАТЬ ЭТАП</div><div class="panel-action">${gates.map((g,i)=>button(g[0],'gate',i,i===state.gateIndex)).join('')}</div>`;
    else if(s.kind==='roadmap')controls=`<div class="panel-section">ПЕРИОД ПЛАНА</div><div class="panel-action">${roadmap.map((g,i)=>button(g[0],'roadmap',i,i===state.roadmapIndex)).join('')}</div>`;
    else if(s.kind==='hero')controls='<div class="panel-section">СЕГОДНЯШНИЙ ФОКУС</div><div class="panel-action">'+button('Посмотреть цикл работы →','goto',2)+'</div>';
    $('panel-content').innerHTML=`<h${state.index===0?'1':'2'}>${s.title}</h${state.index===0?'1':'2'}><p class="lead">${s.lead}</p><div class="panel-divider"></div><ul class="panel-points">${s.points.map(x=>`<li>${x}</li>`).join('')}</ul>${controls}<p class="panel-badge">${s.badge}</p>`;
  }
  function showGraphics(){
    const s=slides[state.index],kind=s.kind;
    $('world-hint').hidden=![0,2,3,4,5].includes(state.index);
    if(kind==='hero')graphics.innerHTML='<div class="floating-caption"><strong>WALL-E / CONCEPT 01</strong>Гусеничная база · манипулятор · кассета · автономное управление</div>';
    else if(kind==='kpi')graphics.innerHTML=`<div class="kpi-stage"><div class="kpi-column"><div class="kpi-number">3–4</div><div class="kpi-label">человека / 1000 ульев<br>предварительная оценка</div></div><div class="kpi-arrow">→</div><div class="kpi-column"><div class="kpi-number gold">1</div><div class="kpi-label">человек / 1000 ульев<br>целевая гипотеза</div></div></div><div class="kpi-caveat">Бизнес-цель требует измерения текущих трудозатрат и проверки условий на реальных пасеках.</div>`;
    else if(kind==='cycle'){
      const c=cycle[state.cycleStep];graphics.innerHTML=`<div class="cycle-info"><div class="big-phase">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]}</p></div><div class="cycle-rail">${cycle.map((c,i)=>`<button data-action="cycle" data-value="${i}" class="cycle-item${i===state.cycleStep?' active':''}" title="${c[1]}">${String(i+1).padStart(2,'0')}</button>`).join('')}</div>`;
    }
    else if(kind==='network'){
      const ps=[[50,15],[87,43],[51,83],[14,43]];
      graphics.innerHTML=`<div class="node-network"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 15 L87 43 L51 83 L14 43 Z" fill="none" stroke="rgba(238,183,82,.55)" stroke-width=".4" stroke-dasharray="1 1"/></svg>${modules.map((m,i)=>`<button class="network-node${i===state.moduleIndex?' selected':''}" style="left:${ps[i][0]}%;top:${ps[i][1]}%" data-action="module" data-value="${i}"><b>${m[0]}</b><small>${m[1]}</small></button>`).join('')}</div>`;
    }else if(kind==='parts')graphics.innerHTML=`<div class="parts-control">${parts.map((p,i)=>button(p[0],'part',i,i===state.partIndex)).join('')}</div><div class="parts-label"><b>${parts[state.partIndex][0]}</b><br>${parts[state.partIndex][1]}</div>`;
    else if(kind==='sandbox')graphics.innerHTML=`<div class="sandbox-controls"><label for="slope">Условный уклон <span id="slope-label">${state.sandboxSlope}°</span></label><input id="slope" type="range" min="0" max="20" value="${state.sandboxSlope}" step="1" data-slider="slope"><label for="load">Условная загрузка <span id="load-label">${state.sandboxLoad}%</span></label><input id="load" type="range" min="0" max="100" value="${state.sandboxLoad}" step="5" data-slider="load"><div class="panel-action">${button(state.sandboxObstacle?'Убрать препятствие':'Добавить препятствие','obstacle',0,state.sandboxObstacle)}${button(state.sandboxOpened?'Закрыть условный улей':'Открыть условный улей','openhive',0,state.sandboxOpened)}</div><div class="sandbox-note">Это управляющие параметры рисунка. Расчёта физики и грузоподъёмности здесь нет.</div></div>`;
    else if(kind==='gates')graphics.innerHTML=`<div class="gates-caption"><div class="micro-label">GATE ${state.gateIndex+1} / 5</div><h3>${gates[state.gateIndex][0]}</h3><p>${gates[state.gateIndex][1]}</p></div><div class="gates">${gates.map((g,i)=>`<button class="gate${i===state.gateIndex?' active':''}" data-action="gate" data-value="${i}"><span class="gate-index">0${i+1}</span><span class="gate-title">${g[0]}</span></button>`).join('')}</div>`;
    else if(kind==='research')graphics.innerHTML=`<div class="research-metrics"><div class="research-metric"><strong>63</strong><span>ресурса и проекта</span></div><div class="research-metric"><strong>42</strong><span>записи с источниками</span></div><div class="research-metric"><strong>20</strong><span>функций в матрице</span></div></div><div class="stack-list"><span class="tech-tag">ROS 2 Jazzy</span><span class="tech-tag">Gazebo Harmonic</span><span class="tech-tag">Nav2</span><span class="tech-tag">MoveIt 2</span><span class="tech-tag">SQLite</span><span class="tech-tag">CAD</span></div>`;
    else if(kind==='roadmap')graphics.innerHTML=`<div class="roadmap-detail">${roadmap[state.roadmapIndex][2]}</div><div class="roadmap">${roadmap.map((g,i)=>`<button class="roadmap-step${i===state.roadmapIndex?' active':''}" data-action="roadmap" data-value="${i}"><strong>${g[0]}</strong><span>${g[1]}</span></button>`).join('')}</div>`;
    else if(kind==='needs')graphics.innerHTML=`<div class="needs-list">${needs.map((n,i)=>`<button class="need${i===state.needIndex?' selected':''}" data-action="need" data-value="${i}"><span class="need-number">${n[0]}</span><span class="need-title">${n[1]}</span><span class="need-copy">${n[2]}</span></button>`).join('')}</div>`;
    else if(kind==='sources')graphics.innerHTML=`<div class="source-list">${sources.map(src=>`<a href="${src[1]}" target="_blank" rel="noopener noreferrer"><strong>${src[0]}</strong><span>${src[1]}</span></a>`).join('')}</div>`;
  }
  function updateNav(){
    $('slide-count').textContent=`${String(state.index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    $('footer-section').textContent=slides[state.index].section;
    $('prev').disabled=state.index===0;$('next').disabled=state.index===slides.length-1;
    $('timeline').innerHTML=slides.map((s,i)=>`<button type="button" data-navigate="${i}" class="dotbtn${i===state.index?' active':''}" title="${i+1}: ${s.section}" aria-label="Слайд ${i+1}: ${s.section}"></button>`).join('');
  }
  function setPanel(open){
    state.panelOpen=open;panel.hidden=!open;$('restore').hidden=open;
    if(open)$('collapse').focus({preventScroll:true});else $('restore').focus({preventScroll:true});
  }
  function navigate(index){
    if(!Number.isInteger(index)||index<0||index>=slides.length)return;
    state.index=index;history.replaceState(null,'',`#${index+1}`);
    renderPanel();showGraphics();updateNav();closeOverlays();
    if(window.WallEWorld)window.WallEWorld.resetView();
  }
  function closeOverlays(){state.notesOpen=false;state.menuOpen=false;$('notes').hidden=true;$('menu').hidden=true;}
  function toggleNotes(){const open=!state.notesOpen;closeOverlays();state.notesOpen=open;$('notes').hidden=!open;if(open){$('notes-text').textContent=slides[state.index].notes;$('notes-close').focus();}else $('notes-toggle').focus();}
  function toggleMenu(){const open=!state.menuOpen;closeOverlays();state.menuOpen=open;$('menu').hidden=!open;if(open){$('menu-grid').innerHTML=slides.map((s,i)=>`<button type="button" data-navigate="${i}" class="menu-entry${i===state.index?' active':''}"><small>${String(i+1).padStart(2,'0')} / ${s.section}</small><strong>${s.title.replace(/<br>|<em>|<\/em>/g,' ').trim()}</strong></button>`).join('');$('menu-close').focus();}else $('menu-toggle').focus();}
  function runAction(action,value){
    const n=Number(value);
    switch(action){
      case 'goto':navigate(n);return;
      case 'cycle':state.cycleStep=n;break;
      case 'cycleprev':state.cycleStep=(state.cycleStep+7)%8;break;
      case 'cyclenext':state.cycleStep=(state.cycleStep+1)%8;break;
      case 'module':state.moduleIndex=n;break;
      case 'part':state.partIndex=n;break;
      case 'gate':state.gateIndex=n;break;
      case 'roadmap':state.roadmapIndex=n;break;
      case 'need':state.needIndex=n;break;
      case 'obstacle':state.sandboxObstacle=!state.sandboxObstacle;break;
      case 'openhive':state.sandboxOpened=!state.sandboxOpened;break;
      default:return;
    }
    showGraphics();renderPanel();
  }
  document.addEventListener('click',event=>{
    const nav=event.target.closest('[data-navigate]');if(nav){navigate(Number(nav.dataset.navigate));return;}
    const btn=event.target.closest('[data-action]');if(btn){runAction(btn.dataset.action,btn.dataset.value);return;}
  });
  graphics.addEventListener('input',event=>{
    const slider=event.target.dataset.slider;if(slider==='slope'){state.sandboxSlope=Number(event.target.value);$('slope-label').textContent=`${state.sandboxSlope}°`;}
    if(slider==='load'){state.sandboxLoad=Number(event.target.value);$('load-label').textContent=`${state.sandboxLoad}%`;}
  });
  $('next').addEventListener('click',()=>navigate(state.index+1));$('prev').addEventListener('click',()=>navigate(state.index-1));
  $('collapse').addEventListener('click',()=>setPanel(false));$('restore').addEventListener('click',()=>setPanel(true));
  $('notes-toggle').addEventListener('click',toggleNotes);$('notes-close').addEventListener('click',toggleNotes);
  $('menu-toggle').addEventListener('click',toggleMenu);$('menu-close').addEventListener('click',toggleMenu);
  $('fullscreen').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>{});});
  document.addEventListener('keydown',e=>{
    const t=e.target;
    if(e.altKey||e.ctrlKey||e.metaKey||t?.matches?.('input,textarea,select,[contenteditable]'))return;
    if(e.key==='Escape'){if(state.notesOpen||state.menuOpen){closeOverlays();e.preventDefault();return;}if(!state.panelOpen){setPanel(true);e.preventDefault();return;}if(document.fullscreenElement)document.exitFullscreen?.();return;}
    if(e.key.toLowerCase()==='n'){toggleNotes();e.preventDefault();return;}
    if(e.key.toLowerCase()==='m'){toggleMenu();e.preventDefault();return;}
    if(e.key.toLowerCase()==='t'){setPanel(!state.panelOpen);e.preventDefault();return;}
    if(e.key.toLowerCase()==='f'){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>{});e.preventDefault();return;}
    if(state.notesOpen||state.menuOpen)return;
    if(['ArrowRight','PageDown',' '].includes(e.key)){navigate(state.index+1);e.preventDefault();}
    if(['ArrowLeft','PageUp'].includes(e.key)){navigate(state.index-1);e.preventDefault();}
    if(e.key==='Home'){navigate(0);e.preventDefault();}if(e.key==='End'){navigate(slides.length-1);e.preventDefault();}
  });
  window.addEventListener('hashchange',()=>{const n=Number(location.hash.slice(1));if(n>=1&&n<=slides.length&&n!==state.index+1)navigate(n-1);});
  function animation(){window.WallEWorld.render(state.index,state,state.panelOpen);requestAnimationFrame(animation);}
  const initial=Number(location.hash.slice(1));navigate(initial>=1&&initial<=slides.length?initial-1:0);requestAnimationFrame(animation);
  window.WallEPresentation={navigate,getState:()=>({...state}),getSlideCount:()=>slides.length};
})();
