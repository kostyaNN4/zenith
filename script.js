/*
 * ZENITH Local 3.0 — Drawn edition / persistent panel workspace
 * Open index.html next to this file and style.css. No build, CDN or network.
 * Audio blobs live in IndexedDB; only metadata and visible artwork enter RAM.
 * The browser owns codec support and audio output. This is not a bit-perfect DAC driver.
 */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
  const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const nextPaint = () => new Promise(resolve => setTimeout(resolve, 0));
  const formatTime = seconds => { const n = Math.max(0, Math.floor(Number(seconds) || 0)); return n >= 3600 ? `${Math.floor(n / 3600)}:${String(Math.floor(n / 60) % 60).padStart(2,'0')}:${String(n % 60).padStart(2,'0')}` : `${Math.floor(n / 60)}:${String(n % 60).padStart(2,'0')}`; };
  const bytes = n => { if (!n) return '0 MB'; const i = Math.min(3, Math.floor(Math.log(n) / Math.log(1024))); return `${(n / 1024 ** i).toFixed(i < 2 ? 0 : 1)} ${['B','KB','MB','GB'][i]}`; };

  const EN = {
    skip:'Skip to music', localClub:'YOUR LOCAL MUSIC CLUB', search:'Find your music…', offline:'Everything on your device', switchTheme:'Switch theme', editLayout:'Move panels', settings:'Settings', layoutHint:'Drag a panel by its handle to any edge. Use Settings → Layout for keyboard controls.', done:'Done', navigation:'Navigation', movePanel:'Move panel', home:'Home', library:'My music', favorites:'Favorites', albums:'Albums', recent:'Recently played', playlists:'PLAYLISTS', newPlaylist:'New playlist', onlyYou:'Just you and the music.', localNote:'No accounts. No ads. At your own pace.', yourSpace:'YOUR SPACE', folder:'Folder', addMusic:'Add music', heroOne:'Your music.', heroTwo:'Your rules.', heroDescription:'All your favorite tracks in one place. Let the rest of the world wait.', startCollection:'Build your collection', onYourWave:'On your wavelength', curatedByYou:'CURATED BY YOU', recentShort:'One more time?', collection:'Your collection', playAll:'Play all', sort:'Sort', sortAdded:'Recently added', sortTitle:'Title', sortArtist:'Artist', sortAlbum:'Album', sortDuration:'Duration', viewMode:'Switch view', more:'More', nowPlaying:'NOW PLAYING', hidePanel:'Hide panel', waitingMusic:'Waiting for music', chooseTrack:'Choose your first track', favoriteAction:'Toggle favorite', sound:'Sound', justListen:'Just listen.', upNext:'Up next', localPlayback:'Local playback', noTrack:'A little quiet here', addYourTracks:'Add your favorite tracks', shuffle:'Shuffle', previous:'Previous', play:'Play', pause:'Pause', next:'Next', repeat:'Repeat', seek:'Playback position', mute:'Mute / unmute', volume:'Volume', queue:'Queue', audio:'Audio', dropTitle:'Let the music stay here.', dropHint:'Drop audio files or a folder to add them', importing:'Building your collection…', cancel:'Cancel', close:'Close', autoSaved:'Changes are saved automatically', save:'Save', top:'Top', bottom:'Bottom', left:'Left', right:'Right', emptyTitle:'Your next favorite starts here', emptyDescription:'Drop music here or choose a folder. Your collection stays on this device.', chooseFiles:'Choose files', tryDemo:'Listen to a local demo', nothingFound:'Nothing found', trySearch:'Try another title or artist.', emptyFavorites:'A place for your favorites', favoritesHint:'Tap the heart next to a track and it will appear here.', emptyRecent:'Your listening story starts here', recentHint:'Play a track to add it to your history.', emptyPlaylist:'Make this playlist yours', playlistHint:'Open a track menu → Add to playlist.', emptyQueue:'Your first track is up to you. Start playback to build the queue.', tracks:'tracks', albumCount:'albums', title:'Title', artist:'Artist', album:'Album', unknownArtist:'Unknown artist', unknownAlbum:'No album', noResults:'No tracks yet', added:'Added: {n}', skipped:'skipped: {n}', failed:'failed: {n}', sessionOnly:'This track is available for this session only.', importBusy:'An import is already running.', noAudio:'No supported audio files found.', importCanceled:'Import stopped. Completed tracks are kept.', storageUnavailable:'Local storage is unavailable. Imported tracks will last only until this tab closes.', storageFull:'Storage is full or blocked. Some new tracks are kept for this session only.', saved:'Saved', deleted:'Removed from the library. The original file is untouched.', addQueue:'Play next', queued:'Added to queue', addPlaylist:'Add to playlist', editTrack:'Edit track information', deleteTrack:'Remove from library', removeFromPlaylist:'Remove from playlist', deleteConfirm:'Remove this track from ZENITH? The original file on your computer will not be deleted.', renamePlaylist:'Rename playlist', deletePlaylist:'Delete playlist', deletePlaylistConfirm:'Delete this playlist? Your audio files and library tracks will stay.', playlistName:'Playlist name', pickPlaylist:'Choose playlist', playlistAdded:'Added to playlist', createFirst:'Create a playlist first.', removed:'Removed', noPlayable:'No track selected. Add some music first.', playbackError:'The browser could not play this file. Try MP3, WAV or FLAC, or a different encoding.', fileMissing:'The audio file is no longer in local storage. Import it again.', queueEnd:'End of queue', general:'General', appearance:'Appearance', layout:'Layout', performance:'Performance', storage:'Library & storage', shortcuts:'Keyboard shortcuts', about:'About ZENITH', generalIntro:'A familiar space, tuned to you.', language:'Interface language', languageNote:'Russian, Ukrainian and English include every description. Other languages translate the main interface; extended help falls back to English.', rememberPosition:'Remember playback position', rememberPositionDesc:'Continue from the same place next time, without automatic playback.', enableShortcuts:'Keyboard shortcuts', enableShortcutsDesc:'Control playback while focus is outside a text field.', appearanceIntro:'Make every detail feel like you. Custom colors are stored separately for light and dark mode.', light:'Light', dark:'Dark', system:'System', palettes:'Ready-made palettes', customColors:'Colors of the current theme', bg:'Window background', surface:'Cards & dialogs', sidebar:'Navigation panel', player:'Player panel', text:'Main text', muted:'Secondary text', border:'Dividers', accent:'Accent & buttons', accentText:'Text on accent', hero:'Cover background', visualizer:'Spectrum & progress', outline:'Illustration outlines', roundness:'Corner radius', shadows:'Shadow depth', textScale:'Text size', density:'Track spacing', compact:'Compact', comfortable:'Comfortable', spacious:'Spacious', animations:'Smooth animations', artwork:'Album artwork', artworkDesc:'Display embedded covers where available.', resetColors:'Reset theme colors', exportSettings:'Export settings & playlists', importSettings:'Import settings & playlists', settingsExported:'Settings exported. Audio files are not included.', badSettings:'This is not a valid ZENITH settings file.', layoutIntro:'Drag panels in layout mode, or choose an edge below. Narrow windows use an adaptive layout.', showNow:'Show now-playing panel', showHero:'Show welcome cover', simple:'Simplified interface', simpleDesc:'Hide decorative sections to leave more room for your tracks.', resetLayout:'Reset panel positions', performanceIntro:'Keep things smooth. Presets control visual effects and processing, not the quality of your source files.', economy:'Economy', balanced:'Balanced', full:'Full detail', economyDesc:'No animation or spectrum. Direct sound.', balancedDesc:'30 fps spectrum. Gentle animations.', fullDesc:'60 fps spectrum. More frequency detail.', custom:'Custom', spectrum:'Live spectrum', spectrumStyle:'Spectrum style', bars:'Rounded bars', dots:'Dot matrix', frameRate:'Spectrum frame rate', pageSize:'Tracks per page', performanceNote:'The spectrum stops when playback pauses or the tab is hidden. Only the current audio file is opened for playback. Large libraries are paginated.', audioIntro:'Play your original files, or shape their sound. Output format and supported codecs depend on the browser and your audio device.', audioMode:'Audio processing', original:'Original · effects off', effects:'Custom · EQ & balance', audioEconomy:'Economy · direct playback', audioNote:'These modes do not convert files or invent extra quality. Original mode bypasses the EQ. Economy also turns off the spectrum. Output sample rate is chosen by the browser.', equalizer:'8-band equalizer', eqPreset:'EQ preset', flat:'Flat', bass:'Bass', warm:'Warm', vocal:'Voice', bright:'Bright', preamp:'Preamp', balance:'Stereo balance', mono:'Mono', limiter:'Peak limiter', limiterDesc:'Reduce clipping after EQ boosts. This is not loudness normalization.', speed:'Playback speed', sleep:'Sleep timer', off:'Off', minutes:'min', timerSet:'Sleep timer: {n} min', timerOff:'Sleep timer off', timerEnded:'Sleep timer finished', audioStatus:'Audio engine', inactive:'Starts on first playback', persistMusic:'Keep imported audio on this device', persistMusicDesc:'Store a copy in browser storage. Originals are not moved. Turning this off affects new imports only.', duplicates:'Skip duplicate files', duplicatesDesc:'Compare filename, size and modification date.', readTags:'Read embedded metadata', readTagsDesc:'ID3 (MP3) and FLAC tags and covers. Other formats use filenames when tags are not supported.', storageIntro:'Your music never leaves this device. Use the same browser profile and app location to keep access to the collection.', usedByLibrary:'Audio in your library', storageNote:'Browser data can be cleared or evicted. Keep your original audio files. Settings exports include playlist references, but do not back up audio. Folder imports are snapshots: reimport to add new files.', retainStorage:'Request persistent storage', retained:'Persistent storage granted', notRetained:'The browser did not grant persistent storage. Keep your originals.', clearLibrary:'Clear library', clearConfirm:'Clear all imported audio, favorites and playlists in ZENITH? The original files on your computer stay untouched.', cleared:'Library cleared', cleanupDemo:'Remove demo tracks', demoRemoved:'Demo tracks removed', localHelp:'Extract all three files into the same folder and open index.html in a modern desktop browser. There are no external dependencies. If local file storage is blocked, serve the same folder from localhost with a local web server.', aboutIntro:'An independent little home for your music.', version:'Version 1.0 · local edition', aboutCopy:'Made with native HTML, CSS and JavaScript. No account, advertising, analytics, or external requests. A browser player, not an online catalog.', help:'Getting started', codecNote:'MP3, WAV, FLAC, OGG, Opus, M4A and AAC are accepted for import. Actual playback depends on the browser codec. Folder access is only granted by your selection; ZENITH cannot monitor your disk automatically.', space:'Space', togglePlayback:'Play / pause', seekShortcut:'Seek ±5 seconds', volumeShortcut:'Volume ±5%', searchShortcut:'Focus search', themeImported:'Settings imported', list:'List', grid:'Grid', back:'Back', confirm:'Confirm', demoLabel:'ZENITH demo', noSelection:'Select a track', metadataSaved:'Track information updated', queueRemove:'Remove from queue', queueUp:'Move up', queueChanged:'Queue updated', contrastNote:'If custom colors become hard to read, reset the palette below.', repeatOff:'Repeat off', repeatAll:'Repeat all', repeatOne:'Repeat one', shuffleOn:'Shuffle on', shuffleOff:'Shuffle off', file:'File', durationLabel:'Duration', resume:'Resume', demoCreating:'Making a little music…', importSummary:'Imported {n} tracks', languageHelp:'Language support', order:'ORDER', resetAll:'Reset preferences', resetConfirm:'Reset appearance, audio and interface preferences? Your music and playlists stay.', resetDone:'Preferences reset', sampleRate:'Output sample rate', source:'Source', mutedLabel:'Muted', playlistCreated:'Playlist created', currentTheme:'Current theme', settingsSaveError:'The browser could not save preferences. Changes work for this session.', browserStorage:'Browser storage', loading:'Loading your collection…', loadingError:'Could not open the saved library. New imports will be kept in this session.', keepOriginals:'Keep your original music files.', invalidName:'Enter a name.', noAlbums:'Add music to see your albums.', remove:'Remove', demoDescription:'Three short instrumental sketches generated on this device. No downloads.', changedNextPlay:'Applied immediately', playlistExists:'Already in this playlist', unknown:'Unknown'
  };
  const RU = {
    skip:'К музыке',localClub:'ТВОЙ ЛОКАЛЬНЫЙ МУЗЫКАЛЬНЫЙ КЛУБ',search:'Найти свою музыку…',offline:'Всё на твоём устройстве',switchTheme:'Сменить тему',editLayout:'Переместить панели',settings:'Настройки',layoutHint:'Потяни панель за ручку к любой стороне. Или выбери положение в Настройки → Панели.',done:'Готово',navigation:'Навигация',movePanel:'Переместить панель',home:'Главная',library:'Моя музыка',favorites:'Любимое',albums:'Альбомы',recent:'Недавно слушал',playlists:'ПЛЕЙЛИСТЫ',newPlaylist:'Создать плейлист',onlyYou:'Только ты и музыка.',localNote:'Без аккаунтов. Без рекламы. В твоём ритме.',yourSpace:'ТВОЁ ПРОСТРАНСТВО',folder:'Папка',addMusic:'Добавить музыку',heroOne:'Твоя музыка.',heroTwo:'Твои правила.',heroDescription:'Собери любимые треки в одном месте. А весь остальной мир пусть подождёт.',startCollection:'Собрать коллекцию',onYourWave:'На твоей волне',curatedByYou:'СОБРАНО ТОБОЙ',recentShort:'Ещё раз?',collection:'Твоя коллекция',playAll:'Воспроизвести всё',sort:'Сортировка',sortAdded:'Сначала новые',sortTitle:'По названию',sortArtist:'По исполнителю',sortAlbum:'По альбому',sortDuration:'По длительности',viewMode:'Изменить вид',more:'Ещё',nowPlaying:'СЕЙЧАС ИГРАЕТ',hidePanel:'Скрыть панель',waitingMusic:'В ожидании музыки',chooseTrack:'Выбери свой первый трек',favoriteAction:'В любимое / убрать',sound:'Звук',justListen:'Просто слушай.',upNext:'Дальше в очереди',localPlayback:'Локальное воспроизведение',noTrack:'Пока тихо',addYourTracks:'Добавь любимые треки',shuffle:'Случайный порядок',previous:'Предыдущий',play:'Воспроизвести',pause:'Пауза',next:'Следующий',repeat:'Повтор',seek:'Позиция воспроизведения',mute:'Выключить / включить звук',volume:'Громкость',queue:'Очередь',audio:'Звук',dropTitle:'Пусть музыка останется здесь.',dropHint:'Отпусти файлы или папку, чтобы добавить в коллекцию',importing:'Собираем твою коллекцию…',cancel:'Отмена',close:'Закрыть',autoSaved:'Изменения сохраняются автоматически',save:'Сохранить',top:'Сверху',bottom:'Снизу',left:'Слева',right:'Справа',emptyTitle:'Здесь начнётся твоя коллекция',emptyDescription:'Перетащи музыку сюда или выбери папку. Треки останутся на твоём устройстве.',chooseFiles:'Выбрать файлы',tryDemo:'Послушать локальное демо',nothingFound:'Ничего не нашлось',trySearch:'Попробуй другое название или исполнителя.',emptyFavorites:'Место для самого любимого',favoritesHint:'Нажми на сердечко рядом с треком — и он появится здесь.',emptyRecent:'Твоя музыкальная история начинается здесь',recentHint:'Включи любой трек — он появится в истории.',emptyPlaylist:'Сделай этот плейлист своим',playlistHint:'Открой меню трека → Добавить в плейлист.',emptyQueue:'Первый трек — за тобой. Включи музыку, и здесь появится очередь.',tracks:'треков',albumCount:'альбомов',title:'Название',artist:'Исполнитель',album:'Альбом',unknownArtist:'Неизвестный исполнитель',unknownAlbum:'Без альбома',noResults:'Пока нет треков',added:'Добавлено: {n}',skipped:'пропущено: {n}',failed:'ошибок: {n}',sessionOnly:'Этот трек доступен только до закрытия вкладки.',importBusy:'Импорт уже выполняется.',noAudio:'Подходящие аудиофайлы не найдены.',importCanceled:'Импорт остановлен. Добавленные треки сохранены.',storageUnavailable:'Хранилище недоступно. Импортированные треки будут доступны только до закрытия вкладки.',storageFull:'Хранилище заполнено или заблокировано. Часть новых треков доступна только в этой вкладке.',saved:'Сохранено',deleted:'Удалено из коллекции. Исходный файл не изменён.',addQueue:'Играть следующим',queued:'Добавлено в очередь',addPlaylist:'Добавить в плейлист',editTrack:'Изменить информацию',deleteTrack:'Убрать из коллекции',removeFromPlaylist:'Убрать из плейлиста',deleteConfirm:'Убрать трек из ZENITH? Исходный файл на компьютере останется.',renamePlaylist:'Переименовать плейлист',deletePlaylist:'Удалить плейлист',deletePlaylistConfirm:'Удалить плейлист? Треки в коллекции останутся.',playlistName:'Название плейлиста',pickPlaylist:'Выбери плейлист',playlistAdded:'Добавлено в плейлист',createFirst:'Сначала создай плейлист.',removed:'Удалено',noPlayable:'Добавь музыку, чтобы начать воспроизведение.',playbackError:'Браузер не смог воспроизвести файл. Попробуй MP3, WAV, FLAC или другую кодировку.',fileMissing:'Аудиофайла больше нет в хранилище. Импортируй его снова.',queueEnd:'Очередь закончилась',general:'Основные',appearance:'Внешний вид',layout:'Панели',performance:'Производительность',storage:'Музыка и хранение',shortcuts:'Горячие клавиши',about:'О ZENITH',generalIntro:'Привычное пространство, настроенное под тебя.',language:'Язык интерфейса',languageNote:'Русский, украинский и английский переведены полностью. В остальных языках переведён основной интерфейс; расширенные подсказки — на английском.',rememberPosition:'Запоминать позицию воспроизведения',rememberPositionDesc:'Продолжай с того же места при следующем запуске, без автоматического включения музыки.',enableShortcuts:'Горячие клавиши',enableShortcutsDesc:'Управляй плеером, когда курсор не находится в текстовом поле.',appearanceIntro:'Настрой каждую деталь под себя. Цвета светлой и тёмной темы сохраняются отдельно.',light:'Светлая',dark:'Тёмная',system:'Системная',palettes:'Готовые палитры',customColors:'Цвета текущей темы',bg:'Фон окна',surface:'Карточки и окна',sidebar:'Панель навигации',player:'Панель плеера',text:'Основной текст',muted:'Вторичный текст',border:'Разделители',accent:'Акцент и кнопки',accentText:'Текст на акценте',hero:'Фон обложки',visualizer:'Спектр и прогресс',outline:'Контуры',roundness:'Скругление углов',shadows:'Глубина теней',textScale:'Размер текста',density:'Плотность списка',compact:'Компактная',comfortable:'Обычная',spacious:'Просторная',animations:'Плавные анимации',artwork:'Обложки альбомов',artworkDesc:'Показывать встроенные обложки, если они есть в файлах.',resetColors:'Сбросить цвета темы',exportSettings:'Экспорт настроек и плейлистов',importSettings:'Импорт настроек и плейлистов',settingsExported:'Настройки экспортированы. Аудиофайлы не входят в копию.',badSettings:'Это не файл настроек ZENITH или он повреждён.',layoutIntro:'Перетаскивай панели мышью или выбирай сторону ниже. В узком окне включается адаптивное расположение.',showNow:'Панель «Сейчас играет»',showHero:'Обложка на главной',simple:'Упрощённый интерфейс',simpleDesc:'Скрыть декоративные блоки и оставить больше места для треков.',resetLayout:'Сбросить расположение',performanceIntro:'Пресеты регулируют эффекты и обработку. Качество исходных файлов остаётся прежним.',economy:'Экономный',balanced:'Баланс',full:'Максимум',economyDesc:'Без анимации и спектра. Прямой звук.',balancedDesc:'Спектр 30 fps. Мягкие анимации.',fullDesc:'Спектр 60 fps. Больше деталей.',custom:'Свои настройки',spectrum:'Живой спектр',spectrumStyle:'Вид спектра',bars:'Скруглённые столбики',dots:'Матрица точек',frameRate:'Частота кадров спектра',pageSize:'Треков на странице',performanceNote:'Спектр останавливается на паузе и в скрытой вкладке. Для воспроизведения открывается только текущий файл. Большие коллекции разбиты на страницы.',audioIntro:'Слушай исходный звук или меняй его характер. Выходной формат и поддержка кодеков зависят от браузера и аудиоустройства.',audioMode:'Обработка звука',original:'Оригинал · без эффектов',effects:'Настройка · EQ и баланс',audioEconomy:'Экономный · прямой звук',audioNote:'Эти режимы не конвертируют файлы и не повышают их качество. «Оригинал» отключает эквалайзер. «Экономный» дополнительно отключает спектр. Частоту выхода выбирает браузер.',equalizer:'8-полосный эквалайзер',eqPreset:'Пресет эквалайзера',flat:'Ровный',bass:'Бас',warm:'Тёплый',vocal:'Голос',bright:'Яркий',preamp:'Предусиление',balance:'Стереобаланс',mono:'Моно',limiter:'Пиковый лимитер',limiterDesc:'Уменьшает перегруз после усиления полос EQ. Это не нормализация громкости треков.',speed:'Скорость воспроизведения',sleep:'Таймер сна',off:'Выключено',minutes:'мин',timerSet:'Таймер сна: {n} мин',timerOff:'Таймер сна выключен',timerEnded:'Таймер сна завершён',audioStatus:'Аудиодвижок',inactive:'Включится при воспроизведении',persistMusic:'Сохранять импортированную музыку',persistMusicDesc:'Копия хранится в браузере, исходники не перемещаются. Отключение влияет только на новые импорты.',duplicates:'Пропускать дубликаты',duplicatesDesc:'Сравнивать имя файла, размер и дату изменения.',readTags:'Читать встроенные метаданные',readTagsDesc:'Теги и обложки ID3 (MP3) и FLAC. Для остальных форматов — имя файла, если теги не поддерживаются.',storageIntro:'Музыка остаётся на устройстве. Для доступа к коллекции используй тот же профиль браузера и расположение приложения.',usedByLibrary:'Аудио в твоей коллекции',storageNote:'Данные браузера могут быть очищены или вытеснены. Сохраняй исходные файлы музыки. Экспорт настроек содержит ссылки плейлистов, но не аудио. Импорт папки — снимок: для новых файлов выбери её повторно.',retainStorage:'Запросить постоянное хранение',retained:'Браузер разрешил постоянное хранение',notRetained:'Браузер не разрешил постоянное хранение. Сохраняй исходники.',clearLibrary:'Очистить коллекцию',clearConfirm:'Удалить импортированную музыку, избранное и плейлисты из ZENITH? Исходные файлы на компьютере останутся.',cleared:'Коллекция очищена',cleanupDemo:'Удалить демотреки',demoRemoved:'Демотреки удалены',localHelp:'Распакуй три файла в одну папку и открой index.html в современном настольном браузере. Внешних зависимостей нет. Если браузер блокирует хранение при открытии файла, открой ту же папку через локальный веб-сервер на localhost.',aboutIntro:'Небольшой самостоятельный дом для твоей музыки.',version:'Версия 1.0 · локальный выпуск',aboutCopy:'Нативные HTML, CSS и JavaScript. Без аккаунтов, рекламы, аналитики и внешних запросов. Локальный плеер в браузере, без онлайн-каталога.',help:'Как начать',codecNote:'Импорт принимает MP3, WAV, FLAC, OGG, Opus, M4A и AAC. Воспроизведение зависит от кодека браузера. Доступ к папке даётся только при выборе; автоматического наблюдения за диском нет.',space:'Пробел',togglePlayback:'Воспроизведение / пауза',seekShortcut:'Перемотка ±5 секунд',volumeShortcut:'Громкость ±5%',searchShortcut:'Поиск',themeImported:'Настройки импортированы',list:'Список',grid:'Карточки',back:'Назад',confirm:'Подтвердить',demoLabel:'Демо ZENITH',noSelection:'Выбери трек',metadataSaved:'Информация о треке обновлена',queueRemove:'Убрать из очереди',queueUp:'Поднять выше',queueChanged:'Очередь обновлена',contrastNote:'Если цвета стали плохо читаться, сбрось палитру кнопкой ниже.',repeatOff:'Повтор выключен',repeatAll:'Повтор всей очереди',repeatOne:'Повтор одного трека',shuffleOn:'Случайный порядок включён',shuffleOff:'Случайный порядок выключен',file:'Файл',durationLabel:'Длительность',resume:'Продолжить',demoCreating:'Готовим немного музыки…',importSummary:'Импортировано треков: {n}',languageHelp:'Поддержка языков',order:'ПОРЯДОК',resetAll:'Сбросить настройки',resetConfirm:'Сбросить внешний вид, звук и настройки интерфейса? Музыка и плейлисты останутся.',resetDone:'Настройки сброшены',sampleRate:'Частота выхода',source:'Источник',mutedLabel:'Звук выключен',playlistCreated:'Плейлист создан',currentTheme:'Текущая тема',settingsSaveError:'Браузер не смог сохранить настройки. Изменения действуют в этой вкладке.',browserStorage:'Хранилище браузера',loading:'Открываем твою коллекцию…',loadingError:'Не удалось открыть сохранённую коллекцию. Новые треки будут доступны в этой вкладке.',keepOriginals:'Сохраняй исходные музыкальные файлы.',invalidName:'Введи название.',noAlbums:'Добавь музыку, чтобы увидеть альбомы.',remove:'Удалить',demoDescription:'Три коротких инструментальных эскиза создаются прямо на устройстве. Без скачивания.',changedNextPlay:'Применяется сразу',playlistExists:'Уже есть в плейлисте',unknown:'Неизвестно'
  };

  const UK = {
    skip:'До музики',localClub:'ТВІЙ ЛОКАЛЬНИЙ МУЗИЧНИЙ КЛУБ',search:'Знайти свою музику…',offline:'Усе на твоєму пристрої',switchTheme:'Змінити тему',editLayout:'Перемістити панелі',settings:'Налаштування',layoutHint:'Перетягни панель за ручку до будь-якого краю. Або вибери розташування: Налаштування → Панелі.',done:'Готово',navigation:'Навігація',movePanel:'Перемістити панель',home:'Головна',library:'Моя музика',favorites:'Улюблене',albums:'Альбоми',recent:'Нещодавно слухав',playlists:'ПЛЕЙЛИСТИ',newPlaylist:'Створити плейлист',onlyYou:'Тільки ти та музика.',localNote:'Без акаунтів. Без реклами. У твоєму ритмі.',yourSpace:'ТВІЙ ПРОСТІР',folder:'Папка',addMusic:'Додати музику',heroOne:'Твоя музика.',heroTwo:'Твої правила.',heroDescription:'Збери улюблені треки в одному місці. А весь інший світ нехай зачекає.',startCollection:'Зібрати колекцію',onYourWave:'На твоїй хвилі',curatedByYou:'ЗІБРАНО ТОБОЮ',recentShort:'Ще раз?',collection:'Твоя колекція',playAll:'Відтворити все',sort:'Сортування',sortAdded:'Спочатку нові',sortTitle:'За назвою',sortArtist:'За виконавцем',sortAlbum:'За альбомом',sortDuration:'За тривалістю',viewMode:'Змінити вигляд',more:'Ще',nowPlaying:'ЗАРАЗ ГРАЄ',hidePanel:'Приховати панель',waitingMusic:'В очікуванні музики',chooseTrack:'Вибери свій перший трек',favoriteAction:'До улюбленого / прибрати',sound:'Звук',justListen:'Просто слухай.',upNext:'Далі в черзі',localPlayback:'Локальне відтворення',noTrack:'Поки тихо',addYourTracks:'Додай улюблені треки',shuffle:'Випадковий порядок',previous:'Попередній',play:'Відтворити',pause:'Пауза',next:'Наступний',repeat:'Повтор',seek:'Позиція відтворення',mute:'Вимкнути / увімкнути звук',volume:'Гучність',queue:'Черга',audio:'Звук',dropTitle:'Нехай музика залишиться тут.',dropHint:'Відпусти файли або папку, щоб додати до колекції',importing:'Збираємо твою колекцію…',cancel:'Скасувати',close:'Закрити',autoSaved:'Зміни зберігаються автоматично',save:'Зберегти',top:'Зверху',bottom:'Знизу',left:'Ліворуч',right:'Праворуч',emptyTitle:'Тут почнеться твоя колекція',emptyDescription:'Перетягни музику сюди або вибери папку. Треки залишаться на твоєму пристрої.',chooseFiles:'Вибрати файли',tryDemo:'Послухати локальне демо',nothingFound:'Нічого не знайдено',trySearch:'Спробуй іншу назву або виконавця.',emptyFavorites:'Місце для найулюбленішого',favoritesHint:'Натисни сердечко біля треку — і він з’явиться тут.',emptyRecent:'Твоя музична історія починається тут',recentHint:'Увімкни трек — він з’явиться в історії.',emptyPlaylist:'Зроби цей плейлист своїм',playlistHint:'Відкрий меню треку → Додати до плейлиста.',emptyQueue:'Перший трек — за тобою. Увімкни музику, і тут з’явиться черга.',tracks:'треків',albumCount:'альбомів',title:'Назва',artist:'Виконавець',album:'Альбом',unknownArtist:'Невідомий виконавець',unknownAlbum:'Без альбому',noResults:'Поки немає треків',added:'Додано: {n}',skipped:'пропущено: {n}',failed:'помилок: {n}',sessionOnly:'Цей трек доступний лише до закриття вкладки.',importBusy:'Імпорт уже виконується.',noAudio:'Відповідні аудіофайли не знайдено.',importCanceled:'Імпорт зупинено. Додані треки збережено.',storageUnavailable:'Сховище недоступне. Імпортовані треки будуть доступні лише до закриття вкладки.',storageFull:'Сховище заповнене або заблоковане. Частина нових треків доступна лише в цій вкладці.',saved:'Збережено',deleted:'Видалено з колекції. Оригінальний файл не змінено.',addQueue:'Грати наступним',queued:'Додано до черги',addPlaylist:'Додати до плейлиста',editTrack:'Змінити інформацію',deleteTrack:'Прибрати з колекції',removeFromPlaylist:'Прибрати з плейлиста',deleteConfirm:'Прибрати трек із ZENITH? Оригінальний файл на комп’ютері залишиться.',renamePlaylist:'Перейменувати плейлист',deletePlaylist:'Видалити плейлист',deletePlaylistConfirm:'Видалити плейлист? Треки в колекції залишаться.',playlistName:'Назва плейлиста',pickPlaylist:'Вибери плейлист',playlistAdded:'Додано до плейлиста',createFirst:'Спочатку створи плейлист.',removed:'Видалено',noPlayable:'Додай музику, щоб почати відтворення.',playbackError:'Браузер не зміг відтворити файл. Спробуй MP3, WAV, FLAC або інше кодування.',fileMissing:'Аудіофайла більше немає в сховищі. Імпортуй його знову.',queueEnd:'Черга закінчилася',general:'Основні',appearance:'Вигляд',layout:'Панелі',performance:'Продуктивність',storage:'Музика та сховище',shortcuts:'Гарячі клавіші',about:'Про ZENITH',generalIntro:'Звичний простір, налаштований під тебе.',language:'Мова інтерфейсу',languageNote:'Українська, російська й англійська перекладені повністю. Іншими мовами перекладено основний інтерфейс; розширені підказки — англійською.',rememberPosition:'Запам’ятовувати позицію',rememberPositionDesc:'Продовжуй із того самого місця під час наступного запуску, без автоматичного ввімкнення музики.',enableShortcuts:'Гарячі клавіші',enableShortcutsDesc:'Керуй плеєром, коли курсор не в текстовому полі.',appearanceIntro:'Налаштуй кожну деталь. Кольори світлої та темної теми зберігаються окремо.',light:'Світла',dark:'Темна',system:'Системна',palettes:'Готові палітри',customColors:'Кольори поточної теми',bg:'Фон вікна',surface:'Картки та вікна',sidebar:'Панель навігації',player:'Панель плеєра',text:'Основний текст',muted:'Другорядний текст',border:'Роздільники',accent:'Акцент і кнопки',accentText:'Текст на акценті',hero:'Фон обкладинки',visualizer:'Спектр і прогрес',outline:'Контури',roundness:'Заокруглення кутів',shadows:'Глибина тіней',textScale:'Розмір тексту',density:'Щільність списку',compact:'Компактна',comfortable:'Звичайна',spacious:'Простора',animations:'Плавні анімації',artwork:'Обкладинки альбомів',artworkDesc:'Показувати вбудовані обкладинки, якщо вони є у файлах.',resetColors:'Скинути кольори теми',exportSettings:'Експорт налаштувань і плейлистів',importSettings:'Імпорт налаштувань і плейлистів',settingsExported:'Налаштування експортовано. Аудіофайли не входять до копії.',badSettings:'Це не файл налаштувань ZENITH або він пошкоджений.',layoutIntro:'Перетягуй панелі мишею або вибирай бік нижче. У вузькому вікні діє адаптивне розташування.',showNow:'Панель «Зараз грає»',showHero:'Обкладинка на головній',simple:'Спрощений інтерфейс',simpleDesc:'Приховати декоративні блоки й залишити більше місця для треків.',resetLayout:'Скинути розташування',performanceIntro:'Пресети регулюють ефекти й обробку. Якість оригінальних файлів не змінюється.',economy:'Економний',balanced:'Баланс',full:'Максимум',economyDesc:'Без анімації та спектра. Прямий звук.',balancedDesc:'Спектр 30 fps. М’які анімації.',fullDesc:'Спектр 60 fps. Більше деталей.',custom:'Власні налаштування',spectrum:'Живий спектр',spectrumStyle:'Вигляд спектра',bars:'Заокруглені стовпчики',dots:'Матриця точок',frameRate:'Частота кадрів спектра',pageSize:'Треків на сторінці',performanceNote:'Спектр зупиняється на паузі та в прихованій вкладці. Для відтворення відкривається лише поточний файл. Великі колекції розбиті на сторінки.',audioIntro:'Слухай оригінальний звук або змінюй його характер. Вихідний формат і кодеки залежать від браузера й аудіопристрою.',audioMode:'Обробка звуку',original:'Оригінал · без ефектів',effects:'Налаштування · EQ і баланс',audioEconomy:'Економний · прямий звук',audioNote:'Ці режими не конвертують файли й не підвищують їхню якість. «Оригінал» вимикає еквалайзер. «Економний» також вимикає спектр. Частоту виходу вибирає браузер.',equalizer:'8-смуговий еквалайзер',eqPreset:'Пресет еквалайзера',flat:'Рівний',bass:'Бас',warm:'Теплий',vocal:'Голос',bright:'Яскравий',preamp:'Передпідсилення',balance:'Стереобаланс',mono:'Моно',limiter:'Піковий лімітер',limiterDesc:'Зменшує перевантаження після підсилення EQ. Це не нормалізація гучності треків.',speed:'Швидкість відтворення',sleep:'Таймер сну',off:'Вимкнено',minutes:'хв',timerSet:'Таймер сну: {n} хв',timerOff:'Таймер сну вимкнено',timerEnded:'Таймер сну завершено',audioStatus:'Аудіорушій',inactive:'Увімкнеться під час відтворення',persistMusic:'Зберігати імпортовану музику',persistMusicDesc:'Копія зберігається у браузері. Оригінали не переміщуються. Вимкнення впливає лише на новий імпорт.',duplicates:'Пропускати дублікати',duplicatesDesc:'Порівнювати назву файла, розмір і дату зміни.',readTags:'Читати вбудовані метадані',readTagsDesc:'Теги й обкладинки ID3 (MP3) та FLAC. Для інших форматів — назва файла, якщо теги не підтримуються.',storageIntro:'Музика залишається на пристрої. Використовуй той самий профіль браузера й розташування застосунку.',usedByLibrary:'Аудіо у твоїй колекції',storageNote:'Дані браузера можуть бути очищені або витіснені. Зберігай оригінальні файли. Експорт містить посилання плейлистів, але не аудіо. Імпорт папки — знімок: для нових файлів вибери її повторно.',retainStorage:'Запросити постійне зберігання',retained:'Браузер дозволив постійне зберігання',notRetained:'Браузер не дозволив постійне зберігання. Зберігай оригінали.',clearLibrary:'Очистити колекцію',clearConfirm:'Видалити імпортовану музику, улюблене та плейлисти з ZENITH? Оригінальні файли на комп’ютері залишаться.',cleared:'Колекцію очищено',cleanupDemo:'Видалити демотреки',demoRemoved:'Демотреки видалено',localHelp:'Розпакуй три файли в одну папку та відкрий index.html у сучасному настільному браузері. Зовнішніх залежностей немає. Якщо браузер блокує зберігання локальних файлів, відкрий папку через локальний вебсервер на localhost.',aboutIntro:'Невеликий незалежний дім для твоєї музики.',version:'Версія 1.0 · локальний випуск',aboutCopy:'Нативні HTML, CSS і JavaScript. Без акаунтів, реклами, аналітики та зовнішніх запитів. Локальний плеєр у браузері, без онлайн-каталогу.',help:'Як почати',codecNote:'Імпорт приймає MP3, WAV, FLAC, OGG, Opus, M4A та AAC. Відтворення залежить від кодека браузера. Доступ до папки надається лише під час вибору; автоматичного стеження за диском немає.',space:'Пробіл',togglePlayback:'Відтворення / пауза',seekShortcut:'Перемотування ±5 секунд',volumeShortcut:'Гучність ±5%',searchShortcut:'Пошук',themeImported:'Налаштування імпортовано',list:'Список',grid:'Картки',back:'Назад',confirm:'Підтвердити',demoLabel:'Демо ZENITH',noSelection:'Вибери трек',metadataSaved:'Інформацію про трек оновлено',queueRemove:'Прибрати з черги',queueUp:'Підняти вище',queueChanged:'Чергу оновлено',contrastNote:'Якщо кольори стали нечитабельними, скинь палітру кнопкою нижче.',repeatOff:'Повтор вимкнено',repeatAll:'Повтор усієї черги',repeatOne:'Повтор одного треку',shuffleOn:'Випадковий порядок увімкнено',shuffleOff:'Випадковий порядок вимкнено',file:'Файл',durationLabel:'Тривалість',resume:'Продовжити',demoCreating:'Готуємо трохи музики…',importSummary:'Імпортовано треків: {n}',languageHelp:'Підтримка мов',order:'ПОРЯДОК',resetAll:'Скинути налаштування',resetConfirm:'Скинути вигляд, звук і налаштування інтерфейсу? Музика та плейлисти залишаться.',resetDone:'Налаштування скинуто',sampleRate:'Частота виходу',source:'Джерело',mutedLabel:'Звук вимкнено',playlistCreated:'Плейлист створено',currentTheme:'Поточна тема',settingsSaveError:'Браузер не зміг зберегти налаштування. Зміни діють у цій вкладці.',browserStorage:'Сховище браузера',loading:'Відкриваємо твою колекцію…',loadingError:'Не вдалося відкрити збережену колекцію. Нові треки будуть доступні в цій вкладці.',keepOriginals:'Зберігай оригінальні музичні файли.',invalidName:'Введи назву.',noAlbums:'Додай музику, щоб побачити альбоми.',remove:'Видалити',demoDescription:'Три короткі інструментальні ескізи створюються на пристрої. Без завантаження.',changedNextPlay:'Застосовується відразу',playlistExists:'Уже є в плейлисті',unknown:'Невідомо'
  };
  // Additional locales translate the primary interface. Missing extended help is
  // deliberately English (and disclosed in the language settings), never a key.
  const LOCALES = {ru:RU,uk:UK,en:EN};
  const LANGUAGE_NAMES = {ru:'Русский',uk:'Українська',en:'English',de:'Deutsch',fr:'Français',es:'Español',pt:'Português',it:'Italiano',pl:'Polski',tr:'Türkçe',ja:'日本語',zh:'简体中文'};
  const CORE_KEYS = 'home|library|favorites|albums|recent|playlists|newPlaylist|settings|search|addMusic|folder|collection|nowPlaying|upNext|play|pause|next|previous|shuffle|repeat|volume|audio|done|cancel|save|close|general|appearance|layout|performance|storage|shortcuts|about|language|light|dark|system|top|bottom|left|right|title|artist|album|tracks|albumCount|sortAdded|sortTitle|sortArtist|sortAlbum|playAll|emptyTitle|emptyDescription|chooseFiles|tryDemo|heroOne|heroTwo|heroDescription|startCollection|onYourWave|recentShort|noTrack|addYourTracks|waitingMusic|chooseTrack|yourSpace|localClub|onlyYou|localNote|offline|curatedByYou|sound|justListen|localPlayback|autoSaved|navigation|editLayout|movePanel|switchTheme|favoriteAction|hidePanel|sort|viewMode|more|queue|importing|dropTitle|dropHint|nothingFound|trySearch|unknownArtist|unknownAlbum|emptyQueue|addQueue|addPlaylist|editTrack|deleteTrack|playlistName|pickPlaylist|renamePlaylist|deletePlaylist|showNow|showHero|simple|animations|artwork|economy|balanced|full|spectrum|equalizer|audioMode|density|compact|comfortable|spacious|off|minutes|speed|sleep|searchShortcut|togglePlayback|mute|seek|skip'.split('|');
  const EXTRA_LOCALES = {
    de:'Start|Meine Musik|Favoriten|Alben|Zuletzt gehört|PLAYLISTS|Neue Playlist|Einstellungen|Musik suchen…|Musik hinzufügen|Ordner|Deine Sammlung|LÄUFT GERADE|Als Nächstes|Abspielen|Pause|Weiter|Zurück|Zufällig|Wiederholen|Lautstärke|Audio|Fertig|Abbrechen|Speichern|Schließen|Allgemein|Darstellung|Panels|Leistung|Musik & Speicher|Tastenkürzel|Über ZENITH|Sprache|Hell|Dunkel|System|Oben|Unten|Links|Rechts|Titel|Interpret|Album|Titel|Alben|Zuletzt hinzugefügt|Nach Titel|Nach Interpret|Nach Album|Alles abspielen|Deine Sammlung beginnt hier|Musik hier ablegen oder einen Ordner wählen. Alles bleibt auf deinem Gerät.|Dateien wählen|Lokale Demo hören|Deine Musik.|Deine Regeln.|Alle Lieblingstitel an einem Ort. Der Rest der Welt kann warten.|Sammlung starten|Auf deiner Wellenlänge|Noch einmal?|Noch ganz still|Füge deine Lieblingsmusik hinzu|Wartet auf Musik|Wähle deinen ersten Titel|DEIN RAUM|DEIN LOKALER MUSIKCLUB|Nur du und die Musik.|Keine Konten. Keine Werbung. Dein Tempo.|Alles auf deinem Gerät|VON DIR AUSGEWÄHLT|Klang|Einfach hören.|Lokale Wiedergabe|Änderungen werden automatisch gespeichert|Navigation|Panels verschieben|Panel verschieben|Thema wechseln|Favorit umschalten|Panel ausblenden|Sortieren|Ansicht wechseln|Mehr|Warteschlange|Deine Sammlung entsteht…|Lass die Musik hier.|Dateien oder Ordner hier ablegen|Nichts gefunden|Versuche einen anderen Titel oder Interpreten.|Unbekannter Interpret|Kein Album|Starte einen Titel, um die Warteschlange zu füllen.|Als Nächstes spielen|Zur Playlist hinzufügen|Informationen bearbeiten|Aus Sammlung entfernen|Name der Playlist|Playlist wählen|Playlist umbenennen|Playlist löschen|Wiedergabepanel zeigen|Startcover zeigen|Einfache Oberfläche|Sanfte Animationen|Albumcover|Sparsam|Ausgewogen|Alle Details|Live-Spektrum|8-Band-Equalizer|Audioverarbeitung|Zeilenabstand|Kompakt|Normal|Großzügig|Aus|Min.|Tempo|Sleep-Timer|Suche öffnen|Abspielen / Pause|Stumm / Ton an|Wiedergabeposition|Zur Musik',
    fr:'Accueil|Ma musique|Favoris|Albums|Écoutés récemment|PLAYLISTS|Nouvelle playlist|Paramètres|Rechercher de la musique…|Ajouter de la musique|Dossier|Ta collection|EN LECTURE|À suivre|Lire|Pause|Suivant|Précédent|Aléatoire|Répéter|Volume|Audio|Terminé|Annuler|Enregistrer|Fermer|Général|Apparence|Panneaux|Performances|Musique et stockage|Raccourcis clavier|À propos de ZENITH|Langue|Clair|Sombre|Système|En haut|En bas|À gauche|À droite|Titre|Artiste|Album|titres|albums|Ajouts récents|Par titre|Par artiste|Par album|Tout lire|Ta collection commence ici|Dépose ta musique ici ou choisis un dossier. Tout reste sur ton appareil.|Choisir des fichiers|Écouter la démo locale|Ta musique.|Tes règles.|Tes titres préférés au même endroit. Le reste du monde peut attendre.|Créer ma collection|Sur ta longueur d’onde|Encore une fois ?|Un peu de silence|Ajoute tes titres préférés|En attendant la musique|Choisis ton premier titre|TON ESPACE|TON CLUB MUSICAL LOCAL|Toi et la musique.|Sans compte. Sans publicité. À ton rythme.|Tout sur ton appareil|SÉLECTIONNÉ PAR TOI|Son|Écoute simplement.|Lecture locale|Les modifications sont enregistrées automatiquement|Navigation|Déplacer les panneaux|Déplacer le panneau|Changer le thème|Ajouter ou retirer des favoris|Masquer le panneau|Trier|Changer la vue|Plus|File d’attente|Création de ta collection…|Que la musique reste ici.|Dépose des fichiers ou un dossier|Aucun résultat|Essaie un autre titre ou artiste.|Artiste inconnu|Sans album|Lance un titre pour remplir la file d’attente.|Lire ensuite|Ajouter à une playlist|Modifier les informations|Retirer de la collection|Nom de la playlist|Choisir une playlist|Renommer la playlist|Supprimer la playlist|Afficher le panneau de lecture|Afficher la couverture|Interface simplifiée|Animations fluides|Pochettes d’album|Économie|Équilibré|Détails maximum|Spectre en direct|Égaliseur à 8 bandes|Traitement audio|Espacement des titres|Compact|Normal|Aéré|Désactivé|min|Vitesse|Minuterie de veille|Ouvrir la recherche|Lecture / pause|Couper / rétablir le son|Position de lecture|Aller à la musique',
    es:'Inicio|Mi música|Favoritos|Álbumes|Recientes|LISTAS|Nueva lista|Ajustes|Buscar música…|Añadir música|Carpeta|Tu colección|REPRODUCIENDO|A continuación|Reproducir|Pausa|Siguiente|Anterior|Aleatorio|Repetir|Volumen|Audio|Listo|Cancelar|Guardar|Cerrar|General|Apariencia|Paneles|Rendimiento|Música y almacenamiento|Atajos de teclado|Acerca de ZENITH|Idioma|Claro|Oscuro|Sistema|Arriba|Abajo|Izquierda|Derecha|Título|Artista|Álbum|pistas|álbumes|Añadidos recientes|Por título|Por artista|Por álbum|Reproducir todo|Tu colección empieza aquí|Arrastra música o elige una carpeta. Todo se queda en tu dispositivo.|Elegir archivos|Escuchar demo local|Tu música.|Tus reglas.|Tus canciones favoritas en un solo lugar. El mundo puede esperar.|Crear mi colección|En tu onda|¿Una vez más?|Todo en silencio|Añade tus canciones favoritas|Esperando música|Elige tu primera canción|TU ESPACIO|TU CLUB MUSICAL LOCAL|Solo tú y la música.|Sin cuentas. Sin anuncios. A tu ritmo.|Todo en tu dispositivo|SELECCIONADO POR TI|Sonido|Solo escucha.|Reproducción local|Los cambios se guardan automáticamente|Navegación|Mover paneles|Mover panel|Cambiar tema|Marcar favorito|Ocultar panel|Ordenar|Cambiar vista|Más|Cola|Creando tu colección…|Que la música se quede aquí.|Suelta archivos o una carpeta|Sin resultados|Prueba otro título o artista.|Artista desconocido|Sin álbum|Reproduce una canción para crear la cola.|Reproducir después|Añadir a una lista|Editar información|Quitar de la colección|Nombre de la lista|Elegir lista|Renombrar lista|Eliminar lista|Mostrar panel de reproducción|Mostrar portada|Interfaz simplificada|Animaciones suaves|Carátulas|Ahorro|Equilibrado|Máximo detalle|Espectro en vivo|Ecualizador de 8 bandas|Procesamiento de audio|Espaciado|Compacto|Normal|Amplio|Desactivado|min|Velocidad|Temporizador|Abrir búsqueda|Reproducir / pausa|Silenciar / activar|Posición de reproducción|Ir a la música',
    pt:'Início|Minha música|Favoritos|Álbuns|Recentes|PLAYLISTS|Nova playlist|Configurações|Buscar música…|Adicionar música|Pasta|Sua coleção|TOCANDO AGORA|A seguir|Reproduzir|Pausa|Próxima|Anterior|Aleatório|Repetir|Volume|Áudio|Pronto|Cancelar|Salvar|Fechar|Geral|Aparência|Painéis|Desempenho|Música e armazenamento|Atalhos|Sobre o ZENITH|Idioma|Claro|Escuro|Sistema|Em cima|Embaixo|Esquerda|Direita|Título|Artista|Álbum|faixas|álbuns|Mais recentes|Por título|Por artista|Por álbum|Reproduzir tudo|Sua coleção começa aqui|Arraste músicas ou escolha uma pasta. Tudo fica no seu dispositivo.|Escolher arquivos|Ouvir demo local|Sua música.|Suas regras.|Suas faixas favoritas em um só lugar. O mundo pode esperar.|Criar coleção|Na sua frequência|Mais uma vez?|Tudo em silêncio|Adicione suas músicas favoritas|Esperando música|Escolha a primeira faixa|SEU ESPAÇO|SEU CLUBE MUSICAL LOCAL|Só você e a música.|Sem contas. Sem anúncios. No seu ritmo.|Tudo no seu dispositivo|ESCOLHIDO POR VOCÊ|Som|Apenas ouça.|Reprodução local|As alterações são salvas automaticamente|Navegação|Mover painéis|Mover painel|Mudar tema|Marcar favorito|Ocultar painel|Ordenar|Mudar visualização|Mais|Fila|Criando sua coleção…|Deixe a música aqui.|Solte arquivos ou uma pasta|Nada encontrado|Tente outro título ou artista.|Artista desconhecido|Sem álbum|Reproduza uma faixa para montar a fila.|Reproduzir a seguir|Adicionar à playlist|Editar informações|Remover da coleção|Nome da playlist|Escolher playlist|Renomear playlist|Excluir playlist|Mostrar painel de reprodução|Mostrar capa inicial|Interface simples|Animações suaves|Capas de álbuns|Economia|Equilibrado|Máximo detalhe|Espectro ao vivo|Equalizador de 8 bandas|Processamento de áudio|Espaçamento|Compacto|Normal|Amplo|Desativado|min|Velocidade|Temporizador|Abrir busca|Reproduzir / pausar|Silenciar / ativar|Posição da reprodução|Ir para a música',
    it:'Home|La mia musica|Preferiti|Album|Recenti|PLAYLIST|Nuova playlist|Impostazioni|Cerca musica…|Aggiungi musica|Cartella|La tua collezione|IN RIPRODUZIONE|In coda|Riproduci|Pausa|Successivo|Precedente|Casuale|Ripeti|Volume|Audio|Fatto|Annulla|Salva|Chiudi|Generali|Aspetto|Pannelli|Prestazioni|Musica e memoria|Scorciatoie|Info su ZENITH|Lingua|Chiaro|Scuro|Sistema|In alto|In basso|Sinistra|Destra|Titolo|Artista|Album|brani|album|Aggiunti di recente|Per titolo|Per artista|Per album|Riproduci tutto|La tua collezione inizia qui|Trascina la musica o scegli una cartella. Tutto resta sul tuo dispositivo.|Scegli file|Ascolta la demo locale|La tua musica.|Le tue regole.|I tuoi brani preferiti in un solo posto. Il mondo può aspettare.|Crea la collezione|Sulla tua frequenza|Ancora una volta?|Tutto in silenzio|Aggiungi i tuoi brani preferiti|In attesa di musica|Scegli il primo brano|IL TUO SPAZIO|IL TUO CLUB MUSICALE LOCALE|Solo tu e la musica.|Niente account. Niente pubblicità. Il tuo ritmo.|Tutto sul tuo dispositivo|SCELTO DA TE|Suono|Ascolta e basta.|Riproduzione locale|Le modifiche si salvano automaticamente|Navigazione|Sposta pannelli|Sposta pannello|Cambia tema|Segna come preferito|Nascondi pannello|Ordina|Cambia vista|Altro|Coda|Creazione della collezione…|Lascia qui la musica.|Rilascia file o cartella|Nessun risultato|Prova un altro titolo o artista.|Artista sconosciuto|Nessun album|Avvia un brano per creare la coda.|Riproduci dopo|Aggiungi alla playlist|Modifica informazioni|Rimuovi dalla collezione|Nome playlist|Scegli playlist|Rinomina playlist|Elimina playlist|Mostra pannello di riproduzione|Mostra copertina iniziale|Interfaccia semplice|Animazioni fluide|Copertine|Risparmio|Bilanciato|Massimo dettaglio|Spettro dal vivo|Equalizzatore a 8 bande|Elaborazione audio|Spaziatura|Compatta|Normale|Ampia|Disattivato|min|Velocità|Timer di spegnimento|Apri ricerca|Riproduci / pausa|Silenzia / riattiva|Posizione di riproduzione|Vai alla musica',
    pl:'Główna|Moja muzyka|Ulubione|Albumy|Ostatnio słuchane|PLAYLISTY|Nowa playlista|Ustawienia|Szukaj muzyki…|Dodaj muzykę|Folder|Twoja kolekcja|TERAZ GRA|Następne|Odtwórz|Pauza|Następny|Poprzedni|Losowo|Powtarzaj|Głośność|Dźwięk|Gotowe|Anuluj|Zapisz|Zamknij|Ogólne|Wygląd|Panele|Wydajność|Muzyka i pamięć|Skróty klawiszowe|O ZENITH|Język|Jasny|Ciemny|Systemowy|Góra|Dół|Lewa|Prawa|Tytuł|Wykonawca|Album|utworów|albumów|Ostatnio dodane|Według tytułu|Według wykonawcy|Według albumu|Odtwórz wszystko|Tu zaczyna się kolekcja|Przeciągnij muzykę lub wybierz folder. Wszystko zostaje na urządzeniu.|Wybierz pliki|Posłuchaj lokalnego demo|Twoja muzyka.|Twoje zasady.|Ulubione utwory w jednym miejscu. Reszta świata może poczekać.|Zbuduj kolekcję|Na twojej fali|Jeszcze raz?|Jeszcze cisza|Dodaj ulubione utwory|Czekamy na muzykę|Wybierz pierwszy utwór|TWOJA PRZESTRZEŃ|TWÓJ LOKALNY KLUB MUZYCZNY|Tylko ty i muzyka.|Bez kont. Bez reklam. W twoim rytmie.|Wszystko na urządzeniu|WYBRANE PRZEZ CIEBIE|Dźwięk|Po prostu słuchaj.|Odtwarzanie lokalne|Zmiany zapisują się automatycznie|Nawigacja|Przenieś panele|Przenieś panel|Zmień motyw|Dodaj do ulubionych|Ukryj panel|Sortuj|Zmień widok|Więcej|Kolejka|Tworzymy kolekcję…|Niech muzyka tu zostanie.|Upuść pliki lub folder|Nic nie znaleziono|Spróbuj innego tytułu lub wykonawcy.|Nieznany wykonawca|Bez albumu|Włącz utwór, aby utworzyć kolejkę.|Odtwórz jako następny|Dodaj do playlisty|Edytuj informacje|Usuń z kolekcji|Nazwa playlisty|Wybierz playlistę|Zmień nazwę playlisty|Usuń playlistę|Pokaż panel odtwarzania|Pokaż okładkę główną|Prosty interfejs|Płynne animacje|Okładki albumów|Oszczędny|Zrównoważony|Pełne detale|Widmo na żywo|Korektor 8-pasmowy|Przetwarzanie dźwięku|Odstępy|Kompaktowe|Normalne|Duże|Wyłączone|min|Prędkość|Wyłącznik czasowy|Otwórz wyszukiwanie|Odtwarzanie / pauza|Wycisz / włącz|Pozycja odtwarzania|Przejdź do muzyki',
    tr:'Ana sayfa|Müziğim|Favoriler|Albümler|Son dinlenenler|ÇALMA LİSTELERİ|Yeni liste|Ayarlar|Müzik ara…|Müzik ekle|Klasör|Koleksiyonun|ŞİMDİ ÇALIYOR|Sıradaki|Oynat|Duraklat|Sonraki|Önceki|Karıştır|Tekrarla|Ses düzeyi|Ses|Tamam|İptal|Kaydet|Kapat|Genel|Görünüm|Paneller|Performans|Müzik ve depolama|Kısayollar|ZENITH hakkında|Dil|Açık|Koyu|Sistem|Üst|Alt|Sol|Sağ|Başlık|Sanatçı|Albüm|parça|albüm|Son eklenenler|Başlığa göre|Sanatçıya göre|Albüme göre|Tümünü oynat|Koleksiyonun burada başlar|Müzik sürükle veya klasör seç. Her şey cihazında kalır.|Dosya seç|Yerel demoyu dinle|Senin müziğin.|Senin kuralların.|Sevdiğin parçalar tek yerde. Dünya biraz beklesin.|Koleksiyon oluştur|Senin frekansında|Bir daha mı?|Henüz sessiz|Sevdiğin parçaları ekle|Müzik bekleniyor|İlk parçanı seç|SENİN ALANIN|YEREL MÜZİK KULÜBÜN|Sadece sen ve müzik.|Hesap yok. Reklam yok. Kendi ritminde.|Her şey cihazında|SENİN SEÇİMİN|Ses|Sadece dinle.|Yerel oynatma|Değişiklikler otomatik kaydedilir|Gezinme|Panelleri taşı|Paneli taşı|Temayı değiştir|Favoriyi değiştir|Paneli gizle|Sırala|Görünümü değiştir|Daha fazla|Kuyruk|Koleksiyonun hazırlanıyor…|Müzik burada kalsın.|Dosya veya klasör bırak|Sonuç bulunamadı|Başka bir başlık veya sanatçı dene.|Bilinmeyen sanatçı|Albüm yok|Kuyruğu oluşturmak için bir parça oynat.|Sonraki çal|Listeye ekle|Bilgileri düzenle|Koleksiyondan kaldır|Liste adı|Liste seç|Listeyi yeniden adlandır|Listeyi sil|Oynatma panelini göster|Ana kapağı göster|Basit arayüz|Akıcı animasyonlar|Albüm kapakları|Tasarruf|Dengeli|Tam ayrıntı|Canlı spektrum|8 bantlı ekolayzer|Ses işleme|Satır aralığı|Sıkışık|Normal|Geniş|Kapalı|dk|Hız|Uyku zamanlayıcısı|Aramayı aç|Oynat / duraklat|Sesi kapat / aç|Oynatma konumu|Müziğe geç',
    ja:'ホーム|マイミュージック|お気に入り|アルバム|最近再生した曲|プレイリスト|新規プレイリスト|設定|音楽を検索…|音楽を追加|フォルダー|コレクション|再生中|次の曲|再生|一時停止|次へ|前へ|シャッフル|リピート|音量|オーディオ|完了|キャンセル|保存|閉じる|一般|デザイン|パネル|パフォーマンス|音楽とストレージ|ショートカット|ZENITHについて|言語|ライト|ダーク|システム|上|下|左|右|タイトル|アーティスト|アルバム|曲|アルバム|追加順|タイトル順|アーティスト順|アルバム順|すべて再生|ここから始まる音楽|音楽をドロップするかフォルダーを選択。すべてこの端末に保存されます。|ファイルを選択|ローカルデモを聴く|あなたの音楽。|あなたのルール。|お気に入りの曲をひとつの場所に。世界は少し待っていて。|コレクションを作る|あなたの波長で|もう一度？|まだ静かです|お気に入りの曲を追加|音楽を待っています|最初の曲を選択|あなたの空間|ローカルミュージッククラブ|あなたと音楽だけ。|アカウントなし。広告なし。自分のペースで。|すべてこの端末に|あなたの選曲|サウンド|ただ聴こう。|ローカル再生|変更は自動保存されます|ナビゲーション|パネルを移動|パネルを移動|テーマを変更|お気に入りを切り替え|パネルを非表示|並べ替え|表示を切り替え|その他|キュー|コレクションを作成中…|音楽をここに。|ファイルやフォルダーをドロップ|見つかりません|別のタイトルやアーティストを試してください。|不明なアーティスト|アルバムなし|曲を再生してキューを作成しましょう。|次に再生|プレイリストに追加|情報を編集|コレクションから削除|プレイリスト名|プレイリストを選択|名前を変更|プレイリストを削除|再生パネルを表示|ホームカバーを表示|シンプル表示|滑らかなアニメーション|アルバムアート|省電力|バランス|高精細|ライブスペクトラム|8バンドEQ|オーディオ処理|曲の間隔|コンパクト|標準|ゆったり|オフ|分|再生速度|スリープタイマー|検索を開く|再生 / 一時停止|ミュート切り替え|再生位置|音楽へ',
    zh:'首页|我的音乐|收藏|专辑|最近播放|播放列表|新建播放列表|设置|搜索音乐…|添加音乐|文件夹|你的音乐收藏|正在播放|接下来|播放|暂停|下一首|上一首|随机播放|循环|音量|音频|完成|取消|保存|关闭|常规|外观|面板|性能|音乐与存储|快捷键|关于 ZENITH|语言|浅色|深色|跟随系统|顶部|底部|左侧|右侧|标题|艺术家|专辑|首歌曲|张专辑|最近添加|按标题|按艺术家|按专辑|播放全部|从这里开始你的收藏|拖入音乐或选择文件夹。所有音乐都保留在本设备上。|选择文件|聆听本地演示|你的音乐。|你的规则。|把喜爱的音乐放在一起。让世界稍等片刻。|建立收藏|你的专属频率|再听一遍？|暂时安静|添加你喜爱的歌曲|等待音乐|选择第一首歌曲|你的空间|你的本地音乐俱乐部|只有你和音乐。|无需账户。没有广告。随心所欲。|一切都在你的设备上|由你精选|声音|静静聆听。|本地播放|更改会自动保存|导航|移动面板|移动面板|切换主题|切换收藏|隐藏面板|排序|切换视图|更多|队列|正在建立收藏…|让音乐留在这里。|拖放文件或文件夹|未找到结果|试试其他标题或艺术家。|未知艺术家|无专辑|播放歌曲以建立队列。|下一首播放|添加到播放列表|编辑信息|从收藏中移除|播放列表名称|选择播放列表|重命名播放列表|删除播放列表|显示播放面板|显示首页封面|简洁界面|流畅动画|专辑封面|节能|均衡|精细|实时频谱|八段均衡器|音频处理|歌曲间距|紧凑|标准|宽松|关闭|分钟|播放速度|睡眠定时器|打开搜索|播放 / 暂停|静音 / 取消静音|播放进度|前往音乐'
  };
  for (const [lang, row] of Object.entries(EXTRA_LOCALES)) {
    const values = row.split('|'); LOCALES[lang] = Object.fromEntries(CORE_KEYS.map((key, i) => [key, values[i] || EN[key]]));
  }

  const STORAGE_KEY = 'zenith.local.v1';
  const DEFAULTS = {
    language:'ru',theme:'light',colors:{light:{},dark:{}},radius:22,shadow:0,fontScale:100,density:'comfortable',
    animations:true,artwork:true,showNow:true,showHero:true,simple:false,
    navigationDock:'left',nowDock:'right',playerDock:'bottom',preset:'balanced',spectrum:true,spectrumStyle:'bars',fps:60,pageSize:60,
    audioMode:'original',eq:[0,0,0,0,0,0,0,0],eqPreset:'flat',preamp:0,balance:0,mono:false,limiter:true,speed:1,
    persistMusic:true,duplicates:true,readTags:true,rememberPosition:true,shortcuts:true,volume:75,sort:'added',viewMode:'list',
    designVersion:3,autoContrast:true,surfaceOpacity:100,backdrops:{},savedThemes:[],spectrumGain:125,spectrumSmooth:72,spectrumCount:48,spectrumStroke:3,spectrumGlow:0,spectrumColor:'',spectrumColor2:'',spectrumGradient:true,spectrumMirror:false,panelLayout:{},customPanels:[],savedLayouts:[],snapPanels:true,panelsLocked:false,
    workspaceGap:12,workspaceMargin:18,topbarHeight:78,borderWidth:1.5,borderStyle:'solid',panelPadding:16,headerHeight:37,glassBlur:0,
    gridSize:8,snapDistance:12,showGrid:true,showSnapGuides:true,showSizeHud:true,
    shapeProfile:'custom',cornerTL:22,cornerTR:22,cornerBR:22,cornerBL:22,use4Corners:false,
    fontFamily:'default',letterSpacing:0,motionDuration:280,motionCurve:'spring',dragTilt:true,activePanelGlow:false,peekOnSlider:true,
    customCSS:'',modifiedThemes:{},modifiedLayouts:{},showGuideOnStartup:false,heroScene:'default'
  };
  const PANEL_ZONES=['left','right','top','bottom','float'];
  const WIDGET_TYPES=['queue','spectrum','equalizer','quickActions','notes','miniPlayer','artworkPanel','photoPanel'];
  Object.assign(EN,{heroOne:'Find your',heroTwo:'little rhythm.',heroDescription:'Familiar tracks. Fresh feelings. A little place that sounds just like you.',startCollection:'Add your tracks',yourDesk:'My desk',version:'Version 2.0 · drawn edition',layoutHint:'Drag a title bar. Resize from a corner. Hold Alt to disable snapping.',layoutIntro:'Your own listening desk. Move panels freely, snap them to edges, stack them in any order, and save the arrangement.',floating:'Floating window',addPanel:'New panel',saveLayout:'Save layout',layoutName:'Layout name',layoutSaved:'Layout saved',savedLayouts:'Your layouts',layoutPresets:'Workspace presets',presetDesk:'Listening desk',presetStudio:'Studio',presetFocus:'Focus',presetFree:'Free canvas',panelTitle:'Panel title',panelType:'Panel content',panelColor:'Panel color',useThemeColor:'Use theme color',panelSize:'Size & position',panelWidth:'Width',panelHeight:'Height',panelVisible:'Show panel',panelCollapse:'Collapse panel',panelExpand:'Expand panel',panelFloat:'Detach panel',panelDock:'Dock panel',panelOptions:'Panel options',panelPosition:'Position',panelRemove:'Remove panel',panelRemoveConfirm:'Remove this custom panel and its notes? Your music is kept.',panelLimit:'You can create up to 8 custom panels.',quickActions:'Quick actions',notes:'Notes',notesPlaceholder:'A track to revisit, an idea, a little note…',snapPanels:'Snap to grid and nearby panels',snapPanelsDesc:'An 8-pixel grid and magnetic edges. Hold Alt while dragging for free placement.',panelsLocked:'Lock panel movement',panelsLockedDesc:'Disable dragging and resizing. Panel settings remain accessible.',panelHelp:'Drag any title bar. Drop on an edge to dock, or anywhere else to float. Drop inside a dock to reorder its panels. Floating panels resize from the bottom-right corner. Focus a title bar and use arrow keys to move it; Shift moves by one pixel.',panelKeys:'Arrow keys: move · Enter: panel settings',panelDrop:'Drop to dock',freeDrop:'Release to leave floating',restorePanel:'Show hidden panels',panelCount:'panels',deleteLayout:'Delete layout',resetLayout:'Reset positions',widgetEmpty:'Start a track to see the queue.',noteSaved:'Notes are stored on this device.',layoutMigration:'New drawn workspace',sleeve:'Drawing · blue',sticker:'Drawing · yellow',recordLabel:'Drawing · pink',vinyl:'Drawing · dark ink'});
  Object.assign(RU,{heroOne:'Живи в своём',heroTwo:'ритме.',heroDescription:'Знакомые треки. Новые ощущения. Маленькое место, где всё звучит по-твоему.',startCollection:'Добавить треки',yourDesk:'Мой стол',version:'Версия 2.0 · рисованный выпуск',layoutHint:'Тяни за заголовок. Меняй размер за угол. Alt — без привязки.',layoutIntro:'Твой музыкальный стол: свободные окна, закрепление у краёв, любой порядок панелей и сохранённые раскладки.',floating:'Плавающее окно',addPanel:'Новая панель',saveLayout:'Сохранить раскладку',layoutName:'Название раскладки',layoutSaved:'Раскладка сохранена',savedLayouts:'Твои раскладки',layoutPresets:'Готовые пространства',presetDesk:'Музыкальный стол',presetStudio:'Студия',presetFocus:'Фокус',presetFree:'Свободный холст',panelTitle:'Название панели',panelType:'Содержимое панели',panelColor:'Цвет панели',useThemeColor:'Использовать цвет темы',panelSize:'Размер и положение',panelWidth:'Ширина',panelHeight:'Высота',panelVisible:'Показывать панель',panelCollapse:'Свернуть панель',panelExpand:'Развернуть панель',panelFloat:'Открепить панель',panelDock:'Закрепить панель',panelOptions:'Настроить панель',panelPosition:'Расположение',panelRemove:'Удалить панель',panelRemoveConfirm:'Удалить эту пользовательскую панель и её заметки? Музыка останется.',panelLimit:'Можно создать до 8 пользовательских панелей.',quickActions:'Быстрые действия',notes:'Заметки',notesPlaceholder:'Трек на потом, идея, пара слов для себя…',snapPanels:'Привязка к сетке и соседним панелям',snapPanelsDesc:'Сетка 8 пикселей и магнитные края. Зажми Alt при перемещении для полной свободы.',panelsLocked:'Заблокировать перемещение панелей',panelsLockedDesc:'Запретить перетаскивание и изменение размеров. Настройки панелей останутся доступны.',panelHelp:'Тяни за любой заголовок. Отпусти у края, чтобы закрепить, или в свободном месте — чтобы оставить окном. Внутри группы можно менять порядок. Размер окна меняется за нижний правый угол. Сфокусируй заголовок и двигай стрелками; Shift — шаг 1 пиксель.',panelKeys:'Стрелки: переместить · Enter: настройки панели',panelDrop:'Отпусти, чтобы закрепить',freeDrop:'Отпусти, чтобы оставить окно',restorePanel:'Показать скрытые панели',panelCount:'панелей',deleteLayout:'Удалить раскладку',resetLayout:'Сбросить расположение',widgetEmpty:'Включи трек, чтобы появилась очередь.',noteSaved:'Заметки сохраняются на этом устройстве.',layoutMigration:'Новое рисованное пространство',sleeve:'Иллюстрация · синий',sticker:'Иллюстрация · жёлтый',recordLabel:'Иллюстрация · розовый',vinyl:'Иллюстрация · тёмный контур'});
  Object.assign(UK,{heroOne:'У своєму',heroTwo:'ритмі.',heroDescription:'Знайомі треки. Нові відчуття. Маленьке місце, де все звучить по-твоєму.',startCollection:'Додати треки',yourDesk:'Мій стіл',version:'Версія 2.0 · мальований випуск',layoutHint:'Тягни за заголовок. Змінюй розмір за кут. Alt — без прив’язки.',layoutIntro:'Твій музичний стіл: вільні вікна, закріплення біля країв, довільний порядок і збережені розкладки.',floating:'Плаваюче вікно',addPanel:'Нова панель',saveLayout:'Зберегти розкладку',layoutName:'Назва розкладки',layoutSaved:'Розкладку збережено',savedLayouts:'Твої розкладки',layoutPresets:'Готові простори',presetDesk:'Музичний стіл',presetStudio:'Студія',presetFocus:'Фокус',presetFree:'Вільне полотно',panelTitle:'Назва панелі',panelType:'Вміст панелі',panelColor:'Колір панелі',useThemeColor:'Використовувати колір теми',panelSize:'Розмір і положення',panelWidth:'Ширина',panelHeight:'Висота',panelVisible:'Показувати панель',panelCollapse:'Згорнути панель',panelExpand:'Розгорнути панель',panelFloat:'Відкріпити панель',panelDock:'Закріпити панель',panelOptions:'Налаштувати панель',panelPosition:'Розташування',panelRemove:'Видалити панель',panelRemoveConfirm:'Видалити цю панель та її нотатки? Музика залишиться.',panelLimit:'Можна створити до 8 власних панелей.',quickActions:'Швидкі дії',notes:'Нотатки',notesPlaceholder:'Трек на потім, ідея, кілька слів для себе…',snapPanels:'Прив’язка до сітки та сусідніх панелей',snapPanelsDesc:'Сітка 8 пікселів і магнітні краї. Затисни Alt для повної свободи.',panelsLocked:'Заблокувати переміщення панелей',panelsLockedDesc:'Заборонити перетягування та зміну розмірів. Налаштування панелей залишаться доступними.',panelHelp:'Тягни за будь-який заголовок. Відпусти біля краю, щоб закріпити, або у вільному місці — щоб залишити вікном. Усередині групи можна змінювати порядок. Розмір вікна змінюється за нижній правий кут. Сфокусуй заголовок і рухай стрілками; Shift — крок 1 піксель.',panelKeys:'Стрілки: перемістити · Enter: налаштування',panelDrop:'Відпусти, щоб закріпити',freeDrop:'Відпусти, щоб залишити вікно',restorePanel:'Показати приховані панелі',panelCount:'панелей',deleteLayout:'Видалити розкладку',resetLayout:'Скинути розташування',widgetEmpty:'Увімкни трек, щоб з’явилася черга.',noteSaved:'Нотатки зберігаються на цьому пристрої.',layoutMigration:'Новий мальований простір',sleeve:'Ілюстрація · синій',sticker:'Ілюстрація · жовтий',recordLabel:'Ілюстрація · рожевий',vinyl:'Ілюстрація · темний контур'});
  Object.assign(EN,{hover:'Hover background'});Object.assign(RU,{hover:'Фон при наведении'});Object.assign(UK,{hover:'Фон при наведенні'});
  const COLOR_KEYS = ['bg','surface','sidebar','player','text','muted','border','accent','accentText','hero','visualizer','outline','hover','sleeve','vinyl','sticker','recordLabel'];
  const COLOR_CSS = key => key === 'accentText' ? '--accent-text' : `--${key}`;
  const OPTIONS = {theme:['light','dark','system'],density:['compact','comfortable','spacious'],navigationDock:['left','right','top','bottom'],nowDock:['left','right','top','bottom'],playerDock:['left','right','top','bottom'],preset:['economy','balanced','full','custom'],spectrumStyle:['bars','dots','wave','mirror','ring','orbit','ribbon','mountains'],audioMode:['original','effects','economy'],eqPreset:['flat','bass','warm','vocal','bright','custom'],sort:['added','title','artist','album','duration'],viewMode:['list','grid'],borderStyle:['solid','dashed','dotted','double','none'],shapeProfile:['custom','drawn','pill','brutalist','cyber'],fontFamily:['default','sans','mono','serif','rounded'],motionCurve:['spring','smooth','snappy','linear'],heroScene:['default','anim-lofi','anim-synthwave','anim-arcane','anim-rain','anim-aurora','art-anime-lofi','art-anime-arcane','art-cartoon-boombox','art-brutal-deck','custom-photo']};
  const RANGES = {radius:[0,44],shadow:[0,24],fontScale:[80,130],fps:[15,60],pageSize:[20,120],preamp:[-18,6],balance:[-100,100],speed:[.5,2],volume:[0,100],surfaceOpacity:[35,100],spectrumGain:[25,250],spectrumSmooth:[0,95],spectrumCount:[16,96],spectrumStroke:[1,8],spectrumGlow:[0,20],workspaceGap:[0,32],workspaceMargin:[0,36],topbarHeight:[52,108],borderWidth:[0,6],panelPadding:[6,32],headerHeight:[24,50],glassBlur:[0,24],gridSize:[1,32],snapDistance:[0,32],cornerTL:[0,48],cornerTR:[0,48],cornerBR:[0,48],cornerBL:[0,48],letterSpacing:[-10,20],motionDuration:[0,600]};
  for(const name of ['navigationDock','nowDock','playerDock'])OPTIONS[name]=PANEL_ZONES;
  // Studio settings are metadata only. Photos stay in IndexedDB as blobs.
  const STUDIO_COPY={
    panelKeys:['Enter: edit. Arrow keys move panels in Move mode.','Enter — настройки. Стрелки двигают панель в режиме перемещения.','Enter — налаштування. Стрілки рухають панель у режимі переміщення.'],allThemes:['All','Все','Усі'],customize:['Customize','Оформление','Оформлення'],appearance:['Themes','Темы','Теми'],layout:['Panels','Панели','Панелі'],spectrum:['Spectrum','Спектр','Спектр'],
    themesIntro:['Choose a look, add a photo, then save your own theme.','Выбери сочетание цветов, добавь свой фон и сохрани тему.','Обери поєднання кольорів, додай власний фон і збережи тему.'],
    myThemes:['My themes','Мои темы','Мої теми'],saveTheme:['Save my theme','Сохранить свою тему','Зберегти власну тему'],themeName:['Theme name','Название темы','Назва теми'],themeLimit:['Up to 24 saved themes. Remove one before adding another.','Можно сохранить 24 темы. Удали ненужную, чтобы добавить новую.','Можна зберегти 24 теми. Видали зайву, щоб додати нову.'],
    useTheme:['Apply','Применить','Застосувати'],updateTheme:['Update','Обновить','Оновити'],rename:['Rename','Переименовать','Перейменувати'],exportTheme:['Export theme','Скачать тему','Завантажити тему'],importTheme:['Import theme','Загрузить тему','Імпортувати тему'],themeSaved:['Theme saved','Тема сохранена','Тему збережено'],themeDelete:['Delete this saved theme?','Удалить эту сохранённую тему?','Видалити цю збережену тему?'],themeEmpty:['Your themes appear here with a preview of their colors and background.','Твои темы появятся здесь с миниатюрами цветов и фона.','Твої теми з’являться тут із мініатюрами кольорів і фону.'],themeContents:['Saves colors, photos, panel styling and spectrum settings. Panel positions stay independent.','Сохраняются цвета, фотографии, оформление панелей и спектра. Положение панелей сохраняется отдельно.','Зберігає кольори, фото, оформлення панелей і спектра. Розташування панелей зберігається окремо.'],
    contrastGuard:['Keep text readable','Сохранять читаемость текста','Зберігати читабельність тексту'],contrastGuardDesc:['Automatically selects contrasting text on custom surfaces and buttons.','Автоматически подбирает контрастный текст для фона и кнопок.','Автоматично підбирає контрастний текст для фону та кнопок.'],
    advanced:['Advanced','Дополнительно','Додатково'],moreColors:['All colors and details','Все цвета и детали','Усі кольори та деталі'],backgrounds:['Photos & backgrounds','Фото и фон','Фото та фон'],backgroundTarget:['Where to put the photo','Куда поставить фотографию','Де розмістити фотографію'],workspaceBg:['Window background','Фон приложения','Фон застосунку'],mainBg:['Music library background','Фон основной области','Фон основної області'],heroBg:['Main illustration','Главная иллюстрация','Головна ілюстрація'],choosePhoto:['Choose photo','Выбрать фото','Обрати фото'],removePhoto:['Remove photo','Убрать фото','Прибрати фото'],photoHint:['JPG, PNG, WebP or AVIF, up to 20 MB. Photos stay on this device.','JPG, PNG, WebP или AVIF, до 20 МБ. Фото остаются на этом устройстве.','JPG, PNG, WebP або AVIF, до 20 МБ. Фото залишаються на цьому пристрої.'],photoInvalid:['Choose a supported image under 20 MB.','Выбери изображение подходящего формата до 20 МБ.','Обери зображення підтримуваного формату до 20 МБ.'],photoMissing:['This photo is unavailable. Choose it again.','Фото недоступно. Выбери его повторно.','Фото недоступне. Обери його знову.'],shade:['Background shade','Затемнение фона','Затемнення фону'],blur:['Background blur','Размытие фона','Розмиття фону'],fit:['Image fit','Заполнение','Заповнення'],cover:['Fill','Заполнить','Заповнити'],contain:['Fit completely','Поместить целиком','Умістити повністю'],center:['Center','По центру','По центру'],photoPosition:['Photo position','Положение фото','Положення фото'],surfaceOpacity:['Panel opacity','Непрозрачность панелей','Непрозорість панелей'],
    layoutIntro:['Choose a panel, change its content or look. Enable Move panels only when you want to rearrange the workspace.','Выбери панель и настрой её содержимое или вид. Для перемещения включи отдельный режим.','Обери панель і налаштуй її вміст або вигляд. Для переміщення ввімкни окремий режим.'],editLayout:['Move panels','Перемещать панели','Переміщувати панелі'],layoutHint:['Move mode: drag a title, resize a corner. Click Done to lock the arrangement.','Режим перемещения: тяни за заголовок, меняй размер за угол. «Готово» закрепит расположение.','Режим переміщення: тягни за заголовок, змінюй розмір за кут. «Готово» закріпить розташування.'],panelHelp:['Use labeled position buttons for quick docking. Enable Move panels for dragging and resizing; Alt disables snapping. Photos and text colors are under Edit.','Кнопки расположения быстро закрепят панель. Режим «Перемещать панели» включает мышь и изменение размеров; Alt отключает привязку. Фон и цвета — в кнопке «Изменить».','Кнопки розташування швидко закріплять панель. Режим «Переміщувати панелі» вмикає мишу та зміну розмірів; Alt вимикає прив’язку. Фон і кольори — у кнопці «Змінити».'],edit:['Edit','Изменить','Змінити'],show:['Show','Показать','Показати'],hide:['Hide','Скрыть','Приховати'],nativeContent:['Original content','Исходное содержимое','Початковий вміст'],panelText:['Text color','Цвет текста','Колір тексту'],panelBorder:['Border color','Цвет рамки','Колір рамки'],panelHeader:['Show title bar','Показывать заголовок','Показувати заголовок'],panelStyle:['Panel appearance','Оформление панели','Оформлення панелі'],inheritStyle:['Use theme styling','Использовать оформление темы','Використовувати оформлення теми'],advancedSize:['Size and shape','Размер и форма','Розмір і форма'],restoreContent:['Restore original panels','Вернуть исходные панели','Повернути початкові панелі'],restoreContentHint:['Restores the original navigation, player and now-playing panel. Notes are kept.','Возвращает навигацию, плеер и панель текущего трека. Заметки сохраняются.','Повертає навігацію, плеєр і панель поточного треку. Нотатки зберігаються.'],photoPanel:['Photo','Фотография','Фотографія'],miniPlayer:['Playback controls','Управление музыкой','Керування музикою'],artworkPanel:['Album cover','Обложка трека','Обкладинка треку'],
    spectrumIntro:['Pick a shape and tune its motion. The preview follows your music; while paused it shows a sample.','Выбери форму и настрой движение. Превью реагирует на музыку, а на паузе показывает пример.','Обери форму та налаштуй рух. Прев’ю реагує на музику, а на паузі показує приклад.'],spectrumLive:['Live audio','По твоей музыке','За твоєю музикою'],spectrumSample:['Style preview','Пример оформления','Приклад оформлення'],spectrumTip:['Wave and ribbon follow the waveform; other shapes follow frequency energy.','Волна и лента показывают звуковую волну, остальные формы — энергию частот.','Хвиля та стрічка показують звукову хвилю, інші форми — енергію частот.'],wave:['Wave','Волна','Хвиля'],mirror:['Mirror','Зеркало','Дзеркало'],ring:['Ring','Кольцо','Кільце'],orbit:['Orbit','Орбита','Орбіта'],ribbon:['Ribbon','Лента','Стрічка'],mountains:['Landscape','Ландшафт','Ландшафт'],spectrumGain:['Sensitivity','Чувствительность','Чутливість'],spectrumSmooth:['Smoothing','Плавность реакции','Плавність реакції'],spectrumCount:['Detail','Детализация','Деталізація'],spectrumStroke:['Line thickness','Толщина линий','Товщина ліній'],spectrumGlow:['Glow','Свечение','Світіння'],spectrumColor:['Primary color','Основной цвет','Основний колір'],spectrumColor2:['Second color','Второй цвет','Другий колір'],spectrumGradient:['Two-color blend','Переход между цветами','Перехід між кольорами'],spectrumMirror:['Symmetric frequencies','Симметричные частоты','Симетричні частоти'],spectrumColorsTheme:['Use theme colors','Цвета из темы','Кольори теми'],addSpectrum:['Add spectrum panel','Добавить панель спектра','Додати панель спектра'],spectrumReset:['Reset spectrum','Сбросить настройки спектра','Скинути налаштування спектра'],
    settingsExported:['Settings and playlists exported. Audio and photos are excluded; export themes with photos from Themes.','Настройки и плейлисты сохранены. Музыка и фото не включены; темы с фото скачиваются в разделе «Темы».','Налаштування та плейлісти збережено. Музика й фото не включені; теми з фото завантажуються в розділі «Теми».'],yourDesk:['Customize','Оформление','Оформлення'],version:['Version 3.0 · Personal studio','Версия 3.0 · твоя студия','Версія 3.0 · твоя студія']
  };
  for(const [key,values] of Object.entries(STUDIO_COPY)){EN[key]=values[0];RU[key]=values[1];UK[key]=values[2];}
  const GIGA_COPY={
    giga:['Giga-Custom','Гига-кастом','Гіга-кастом'],
    gigaShort:['Giga-Custom','Гига-кастом','Гіга-кастом'],
    gigaCustom:['Giga-Custom Studio','Студия Гига-кастома','Студія Гіга-кастому'],
    gigaIntro:['Deep customization for power users: geometry sliders, 4-corner morphing, glass blur, physics, fonts, and live CSS.','Максимальная кастомизация: живые ползунки геометрии, 4 угла скругления, матовое стекло, физика анимаций, шрифты и свой CSS.','Максимальна кастомізація: живі повзунки геометрії, 4 кути заокруглення, матове скло, фізика анімацій, шрифти та власний CSS.'],
    layoutIntro:['Drag any panel by its header anytime, or pull any edge or corner to resize! Use the live sliders below to watch panels morph in real time.','Перетаскивай любую панель за шапку в любой момент и тяни за любой край или угол для изменения размера! Двигай ползунки ниже, чтобы видеть изменения вживую.','Перетягуй будь-яку панель за шапку в будь-який момент і тягни за будь-який край чи кут для зміни розміру! Рухай повзунки нижче, щоб бачити зміни наживо.'],
    layoutHint:['Drag any panel header to move or dock. Pull any edge or corner to resize. Hold Alt to bypass snapping.','Тяни любую панель за шапку куда угодно или меняй размер за любой край и угол. Зажми Alt — без привязки.','Тягни будь-яку панель за шапку куди завгодно або змінюй розмір за будь-який край і кут. Затисни Alt — без прив’язки.'],
    panelHelp:['Panels can always be dragged directly by their header and resized from any edge or corner (unless locked). You can also overwrite or edit any ready-made preset below!','Панели всегда можно таскать вручную за шапку и менять их размер за любой край или угол (если не включена блокировка). Любой готовый пресет ниже тоже можно изменить или перезаписать!','Панелі завжди можна тягати вручну за шапку та змінювати їхній розмір за будь-який край чи кут (якщо не увімкнено блокування). Будь-який готовий пресет нижче теж можна змінити або перезаписати!'],
    presetCockpit:['Cockpit Pro','Ультра-кокпит','Ультра-кокпіт'],
    presetVinyl:['Vinyl Lounge','Виниловый лаунж','Вініловий лаунж'],
    presetCompact:['Compact Top','Компакт-бар','Компакт-бар'],
    presetDj:['DJ Booth','DJ-пульт','DJ-пульт'],
    presetDeskDesc:['Classic 3-column listening room','Классический зал: навигация слева, плеер снизу','Класична зала: навігація ліворуч, плеєр знизу'],
    presetStudioDesc:['Equalizer + live spectrum + queue','Эквалайзер + живой спектр + очередь','Еквалайзер + живий спектр + черга'],
    presetFocusDesc:['Top bar & maximum space for tracks','Верхняя панель и максимум места для треков','Верхня панель і максимум місця для треків'],
    presetFreeDesc:['Floating desktop windows anywhere','Свободные плавающие окна в любом месте','Вільні плаваючі вікна будь-де'],
    presetCockpitDesc:['Full command center with actions & notes','Полный центр управления: быстрые действия и заметки','Повний центр керування: швидкі дії та нотатки'],
    presetVinylDesc:['Large album cover & analog vibe','Крупная обложка альбома и виниловый вайб','Велика обкладинка альбому та вініловий вайб'],
    presetCompactDesc:['Top player & navigation, open canvas','Плеер и навигация сверху, открытый холст','Плеєр і навігація зверху, відкрите полотно'],
    presetDjDesc:['Dual visualizers, EQ & track deck','Двойной визуализатор, эквалайзер и пульт','Подвійний візуалізатор, еквалайзер і пульт'],
    saveIntoPreset:['Save current here','Записать текущее','Записати поточне'],
    resetPreset:['Reset','Сбросить','Скинути'],
    modifiedBadge:['CUSTOM','ИЗМЕНЁН','ЗМІНЕНО'],
    presetUpdated:['Preset updated with current state','Пресет обновлён текущими настройками','Пресет оновлено поточними налаштуваннями'],
    presetReset:['Preset restored to default','Пресет возвращён к исходному виду','Пресет повернуто до початкового вигляду'],
    editPresetColors:['Edit preset','Настроить пресет','Налаштувати пресет'],
    globalGeometry:['Live space & shape sliders','Живые ползунки размеров и формы','Живі повзунки розмірів і форми'],
    workspaceGap:['Gap between panels','Отступ между панелями','Відступ між панелями'],
    workspaceMargin:['Outer window margin','Внешние поля окна','Зовнішні поля вікна'],
    topbarHeight:['Top bar height','Высота верхней шапки','Висота верхньої шапки'],
    borderWidth:['Border thickness','Толщина обводки','Товщина обводки'],
    borderStyle:['Border style','Стиль границ','Стиль меж'],
    solid:['Solid','Сплошная','Суцільна'],
    dashed:['Dashed','Пунктир','Пунктир'],
    dotted:['Dotted','Точки','Крапки'],
    double:['Double','Двойная','Подвійна'],
    none:['No border','Без рамок','Без рамок'],
    panelPadding:['Inner panel padding','Внутренний отступ панелей','Внутрішній відступ панелей'],
    headerHeight:['Panel header height','Высота заголовка панели','Висота заголовка панелі'],
    glassBlur:['Frosted glass blur','Размытие матового стекла','Розмиття матового скла'],
    gridSize:['Snap grid step','Шаг магнитной сетки','Крок магнітної сітки'],
    snapDistance:['Magnetic snap strength','Сила магнита привязки','Сила магніту прив’язки'],
    showGrid:['Show blueprint grid while dragging','Показывать сетку при перетаскивании','Показувати сітку під час перетягування'],
    showSnapGuides:['Laser alignment guides','Лазерные направляющие выравнивания','Лазерні напрямні вирівнювання'],
    showSizeHud:['Live size & coordinates badge','Индикатор размеров и координат','Індикатор розмірів і координат'],
    peekOnSlider:['Translucent window while sliding','Прозрачное окно настроек при движении ползунка','Прозоре вікно налаштувань під час руху повзунка'],
    peekOnSliderDesc:['See panels and colors change behind the settings dialog in real time.','Позволяет сразу видеть, как меняются панели и цвета позади окна настроек.','Дозволяє одразу бачити, як змінюються панелі та кольори позаду вікна налаштувань.'],
    shapeProfile:['Global panel shape profile','Профиль формы панелей','Профіль форми панелей'],
    shapeCustom:['Uniform radius','Обычное скругление','Звичайне заокруглення'],
    shapeDrawn:['Hand-drawn asymmetric','Рисованный скетч','Мальований скетч'],
    shapePill:['Soft capsule','Мягкая капсула','М’яка капсула'],
    shapeBrutalist:['Brutalist sharp','Брутализм (острые углы)','Бруталізм (гострі кути)'],
    shapeCyber:['Cyber cut','Кибер-контур','Кібер-контур'],
    use4Corners:['Individual 4-corner roundness','Настроить каждый из 4 углов отдельно','Налаштувати кожен із 4 кутів окремо'],
    cornerTL:['Top-left corner','Верхний левый угол','Верхній лівий кут'],
    cornerTR:['Top-right corner','Верхний правый угол','Верхній правий кут'],
    cornerBR:['Bottom-right corner','Нижний правый угол','Нижній правий кут'],
    cornerBL:['Bottom-left corner','Нижний левый угол','Нижній лівий кут'],
    typographyPhysics:['Typography & animation physics','Типографика и физика анимаций','Типографіка та фізика анімацій'],
    fontFamily:['Interface font','Шрифт интерфейса','Шрифт інтерфейсу'],
    fontDefault:['ZENITH Signature','Фирменный ZENITH','Фірмовий ZENITH'],
    fontSans:['Modern Grotesque (Inter / UI)','Современный гротеск','Сучасний гротеск'],
    fontMono:['Cyber / Technical Mono','Техно-моноширинный','Техно-моноширинний'],
    fontSerif:['Editorial Serif','Книжный с засечками','Книжковий із зарубками'],
    fontRounded:['Soft Rounded','Мягкий скруглённый','М’який заокруглений'],
    letterSpacing:['Letter spacing','Межбуквенный интервал','Міжбуквений інтервал'],
    motionDuration:['Animation duration','Скорость анимаций','Швидкість анімацій'],
    motionCurve:['Animation physics','Физика анимаций','Фізика анімацій'],
    curveSpring:['Bouncy spring','Упругая пружина','Пружна пружина'],
    curveSmooth:['Smooth glide','Плавное скольжение','Плавне ковзання'],
    curveSnappy:['Snappy response','Резкий отклик','Різкий відгук'],
    curveLinear:['Linear','Линейная','Лінійна'],
    dragTilt:['Dynamic tilt while dragging','Эффект наклона окна при перетаскивании','Ефект нахилу вікна під час перетягування'],
    activePanelGlow:['Accent glow on hovered panel','Неоновая подсветка активной панели','Неонове підсвічування активної панелі'],
    customCSSHeading:['Live custom CSS & variable inspector','Свой CSS-код и инспектор переменных','Власний CSS-код та інспектор змінних'],
    customCSSHint:['Write any CSS rules or variable overrides. Applied instantly without reload.','Пиши любые CSS-правила или переопределяй переменные — применяется мгновенно на лету.','Пиши будь-які CSS-правила або перевизначай змінні — застосовується миттєво на льоту.'],
    copyCSSVars:['Copy active CSS variables','Скопировать CSS-переменные','Скопіювати CSS-змінні'],
    cssCopied:['CSS variables copied to clipboard','CSS-переменные скопированы','CSS-змінні скопійовано'],
    randomTheme:['Randomize harmonious theme','Случайная гармоничная тема','Випадкова гармонійна тема'],
    cascadePanels:['Cascade windows','Окна каскадом','Вікна каскадом'],
    tilePanels:['Tile windows','Окна плиткой','Вікна плиткою'],
    panelOpacity:['Opacity','Непрозрачность','Непрозорість'],
    panelScale:['Content scale','Масштаб внутри','Масштаб всередині'],
    panelBorderWidth:['Border','Рамка','Рамка'],
    panelShape:['Shape','Форма','Форма'],
    neonThemes:['Neon & Geek','Неон и гик','Неон і гік'],
    cozyThemes:['Warm & Cozy','Тёплые и уютные','Теплі та затишні'],
    lockedToast:['Panels locked','Панели закреплены','Панелі закріплено'],
    unlockedToast:['Panels unlocked — drag freely!','Панели разблокированы — таскай свободно!','Панелі розблоковано — тягай вільно!'],
    resetThemeAndPanels:['Reset theme & panels to default','Сбросить тему и панели','Скинути тему та панелі'],
    resetThemeAndPanelsShort:['Reset view','Сброс вида','Скидання вигляду'],
    resetThemeAndPanelsHint:['Restore original base theme, colors, and panel layout (your music and playlists stay safe)','Вернуть исходный базовый вид темы и панелей (музыка и плейлисты не затрагиваются)','Повернути початковий базовий вигляд теми та панелей (музика і плейлісти зберігаються)'],
    resetThemeOnly:['Reset theme & style only','Сбросить только тему','Скинути лише тему'],
    resetPanelsOnly:['Reset panels & sizes only','Сбросить только панели','Скинути лише панелі'],
    undoReset:['Undo reset','Отменить сброс','Скасувати скидання'],
    rescueTitle:['Something look broken or over-tweaked?','Накрутил лишнего в оформлении или панелях?','Накрутив зайвого в оформленні чи панелях?'],
    themeAndPanelsResetToast:['Theme and panels restored to original defaults','Тема и панели возвращены в исходный базовый вариант','Тему та панелі повернуто до початкового базового вигляду'],
    themeOnlyResetToast:['Theme and visual styling restored to defaults','Тема и оформление возвращены к базовому виду','Тему та оформлення повернуто до базового вигляду'],
    panelsOnlyResetToast:['Panels and sizes restored to defaults','Расположение и размеры панелей сброшены','Розташування та розміри панелей скинуто'],
    resetUndoneToast:['Previous look restored','Предыдущие настройки внешнего вида восстановлены','Попередні налаштування вигляду відновлено']
  };
  for(const [key,values] of Object.entries(GIGA_COPY)){EN[key]=values[0];RU[key]=values[1];UK[key]=values[2];}
  const GUIDE_COPY={
    guideBtn:['Guide','Гид','Гід'],panelsShort:['Panels','Панели','Панелі'],
    guideTitle:['About ZENITH & Interactive Guide','О приложении и обучение ZENITH','Про застосунок та навчання ZENITH'],
    guideCornerTitle:['What is ZENITH?','Что это за приложение?','Що це за застосунок?'],
    guideCornerSub:['Interactive guide & features','Обучение и возможности','Навчання та можливості'],
    welcomeEyebrow:['✳ PERSONAL MUSIC STUDIO · ONBOARDING & GUIDE','✳ PERSONAL MUSIC STUDIO · ОБУЧЕНИЕ И ГИД','✳ PERSONAL MUSIC STUDIO · НАВЧАННЯ ТА ГІД'],
    welcomeHeading:['Welcome to ZENITH!','Добро пожаловать в ZENITH!','Ласкаво просимо до ZENITH!'],
    guideTab1:['1. What is ZENITH','1. Что такое ZENITH','1. Що таке ZENITH'],
    guideTab2:['2. Music & Sound','2. Музыка и Звук','2. Музика та Звук'],
    guideTab3:['3. Panels & Custom','3. Панели и Кастом','3. Панелі та Кастом'],
    guideTab4:['4. Shortcuts & Start','4. Клавиши и Старт','4. Клавіші та Старт'],
    showGuideStartup:['Show this guide on every launch','Показывать обучение при каждом запуске','Показувати навчання під час кожного запуску'],
    guideNext:['Next →','Далее →','Далі →'],
    guideStartBtn:['Got it, to the music!','Понятно, к музыке!','Зрозуміло, до музики!'],
    guideStep0Title:['Your private local music club & customizable audio studio','Твой локальный музыкальный клуб и модульная студия','Твій локальний музичний клуб і модульна студія'],
    guideStep0Desc:['ZENITH is an independent music player and a live creative workspace right on your device. No accounts, subscriptions, ads, or clouds: all your music, covers, playlists, and layouts are stored locally on your PC or phone, and it works even without the internet.','ZENITH — это самостоятельный музыкальный плеер и живое творческое пространство прямо на твоём устройстве. Никаких аккаунтов, подписок, рекламы и облаков: вся музыка, обложки, плейлисты и раскладки хранятся локально в на твоём пк или телефоне, работает даже без интернета.','ZENITH — це самостійний музичний плеєр і живий творчий простір прямо на твоєму пристрої. Жодних акаунтів, підписок, реклами чи хмар: уся музика, обкладинки, плейлисти та розкладки зберігаються локально на твоєму ПК або телефоні, працює навіть без інтернету.'],
    guideStep0Wish:['Enjoy! ❤️','Приятного пользования❤️','Приємного користування❤️'],
    guideChooseLang:['Language:','Язык:','Мова:'],
    guideCard1Title:['100% Local & Private','100% Локально и приватно','100% Локально та приватно'],
    guideCard1Desc:['Drop MP3, FLAC, WAV, OGG, Opus, or M4A files or entire folders right into the window. Tracks are stored in IndexedDB on your device so they stay ready on your next visit.','Перетаскивай файлы MP3, FLAC, WAV, OGG, Opus, M4A или целые папки прямо в окно. Треки сохраняются в локальной базе устройства и остаются на месте при следующем входе.','Перетягуй файли MP3, FLAC, WAV, OGG, Opus, M4A або цілі папки прямо у вікно. Треки зберігаються в локальній базі пристрою і залишаються на місці під час наступного входу.'],
    guideCard2Title:['Movable Modular Panels','Живые модульные панели','Живі модульні панелі'],
    guideCard2Desc:['Grab any panel by its header to dock it Left, Right, Top, Bottom, or leave it floating! Pull any of the 8 edges or corners to resize, and add up to 8 custom widgets.','Тяни любую панель за шапку к любому краю экрана (Слева, Справа, Сверху, Снизу) или оставляй плавающим окном! Меняй размер за любой край или угол и добавляй виджеты.','Тягни будь-яку панель за шапку до будь-якого краю екрана (Ліворуч, Праворуч, Зверху, Знизу) або залишай плаваючим вікном! Змінюй розмір за будь-який край чи кут і додавай віджети.'],
    guideCard3Title:['Studio EQ & 8 Visualizers','Студийный звук и 8 спектров','Студійний звук і 8 спектрів'],
    guideCard3Desc:['Shape your sound with an 8-band equalizer, preamp, stereo balance, mono mode, peak limiter, playback speed, sleep timer, and 8 real-time spectrum styles.','Настраивай звучание 8-полосным эквалайзером, предусилением, стереобалансом, лимитером, скоростью воспроизведения и 8 стилями живого аудиоспектра.','Налаштовуй звучання 8-смуговим еквалайзером, передпідсиленням, стереобалансом, лімітером, швидкістю відтворення та 8 стилями живого аудіоспектра.'],
    guideCard4Title:['24 Themes & Giga-Custom','24 темы и Гига-кастом','24 теми та Гіга-кастом'],
    guideCard4Desc:['Switch between Light and Dark themes with a liquid wave transition, set custom background photos, morph panel corners, adjust frosted glass blur, or write live CSS.','Переключай светлую и тёмную тему с плавным переливом, ставь свои фото на фон, меняй форму каждого из 4 углов, матовое стекло, физику анимаций и свой CSS.','Перемикай світлу й темну тему з плавним переливом, став власні фото на фон, змінюй форму кожного з 4 кутів, матове скло, фізику анімацій та власний CSS.'],
    guideStep1Title:['How to add music, organize playlists & tune your sound','Как добавлять музыку, вести коллекцию и настраивать звук','Як додавати музику, вести колекцію та налаштовувати звук'],
    guideStep1Desc:['Whether you have a huge lossless collection or just want to listen to a quick instrumental sketch, ZENITH makes every action effortless.','Неважно, у тебя огромная коллекция во FLAC или ты просто хочешь включить фоновую музыку — в ZENITH всё под рукой.','Неважливо, чи в тебе величезна колекція у FLAC, чи ти просто хочеш увімкнути фонову музику — у ZENITH усе під рукою.'],
    guideMusic1Title:['Import Files & Folders','Добавление файлов и папок','Додавання файлів і папок'],
    guideMusic1Desc:['Click “Add music” or “Folder” at the top, or simply drag & drop audio files anywhere on the screen. ZENITH automatically reads ID3 and FLAC tags and embedded album covers.','Нажми «Добавить музыку» или «Папка» сверху либо просто перетащи аудиофайлы мышью в окно. Плеер сам прочитает названия, исполнителей, альбомы и встроенные обложки.','Натисни «Додати музику» або «Папка» зверху або просто перетягни аудіофайли мишею у вікно. Плеєр сам прочитає назви, виконавців, альбоми та вбудовані обкладинки.'],
    guideMusic2Title:['Playlists, Favorites & Queue','Плейлисты, Любимое и Очередь','Плейлисти, Улюблене та Черга'],
    guideMusic2Desc:['Click the heart icon on any track to add it to Favorites. Right-click any track (or click ⋯) to play it next, add it to a custom playlist, or edit its title/artist/album tags.','Жми сердечко рядом с треком, чтобы добавить в «Любимое». Правый клик по треку (или кнопка ⋯) позволяет поставить его следующим в очереди, добавить в плейлист или изменить теги.','Тисни сердечко поруч із треком, щоб додати в «Улюблене». Правий клік по треку (або кнопка ⋯) дозволяє поставити його наступним у черзі, додати в плейлист або змінити теги.'],
    guideMusic3Title:['8-Band Equalizer & Audio Modes','8-полосный эквалайзер и режимы','8-смуговий еквалайзер і режими'],
    guideMusic3Desc:['Choose “Original” for bit-clean bypass, or “Custom EQ” to boost bass, warm up vocals, adjust stereo balance, enable the peak limiter, or change playback speed (0.5×–2.0×).','Режим «Оригинал» пускает звук в обход фильтров, а «Настройка EQ» включает 8 полос частот, готовые пресеты (Бас, Тёплый, Голос, Яркий), предусиление, баланс и лимитер.','Режим «Оригінал» пускає звук в обхід фільтрів, а «Налаштування EQ» вмикає 8 смуг частот, готові пресети (Бас, Теплий, Голос, Яскравий), передпідсилення, баланс і лімітер.'],
    guideMusic4Title:['8 Live Spectrum Visualizers','8 живых визуализаторов спектра','8 живих візуалізаторів спектра'],
    guideMusic4Desc:['Pick Rounded Bars, Dot Matrix, Wave, Mirror, Ring, Orbit, Ribbon, or Landscape in Settings → Spectrum. Tune sensitivity, smoothing, glow, and two-color gradients.','В разделе «Спектр» выбирай Столбики, Точки, Волну, Зеркало, Кольцо, Орбиту, Ленту или Ландшафт. Настраивай чувствительность, плавность, свечение и градиент.','У розділі «Спектр» обирай Стовпчики, Точки, Хвилю, Дзеркало, Кільце, Орбіту, Стрічку або Ландшафт. Налаштовуй чутливість, плавність, світіння та градієнт.'],
    guideStep2Title:['Master the movable workspace & Giga-Custom studio','Управление живыми панелями, темами и Гига-кастомом','Керування живими панелями, темами та Гіга-кастомом'],
    guideStep2Desc:['Every panel in ZENITH is alive. Build a minimalist focus bar, a multi-window DJ booth, or a cozy illustrated desk.','Каждая панель в ZENITH живая. Собери минималистичный плеер, многооконный DJ-пульт или уютный рисованный стол.','Кожна панель у ZENITH жива. Збери мінімалістичний плеєр, багатовіконний DJ-пульт або затишний мальований стіл.'],
    guidePanel1Title:['Drag, Dock & Resize Any Panel','Перетаскивание и размер панелей','Перетягування та розмір панелей'],
    guidePanel1Desc:['Grab any panel header to drag it. Drop near any screen edge to dock, or release in the middle to float! Pull any edge or corner to resize; hold Alt to ignore grid snapping.','Потяни любую панель за шапку: отпусти у края экрана для закрепления или в центре — чтобы сделать плавающим окном. Тяни за любой край и угол для изменения размера (Alt — без сетки).','Потягни будь-яку панель за шапку: відпусти біля краю екрана для закріплення або в центрі — щоб зробити плаваючим вікном. Тягни за будь-який край і кут для зміни розміру (Alt — без сітки).'],
    guidePanel2Title:['8 Custom Widgets & 8 Presets','8 виджетов и 8 готовых раскладок','8 віджетів і 8 готових розкладок'],
    guidePanel2Desc:['Add extra panels for Notes, Equalizer, Live Spectrum, Queue, Album Cover, Quick Actions, or Photos. Switch between Desk, Studio, Focus, DJ Booth, Vinyl Lounge, or Cockpit Pro.','Добавляй панели Заметок, Эквалайзера, Спектра, Очереди, Обложки, Быстрых действий или Фото. Переключайся между готовыми столами (Студия, Фокус, DJ-пульт, Винил, Кокпит).','Додавай панелі Нотаток, Еквалайзера, Спектра, Черги, Обкладинки, Швидких дій або Фото. Перемикайся між готовими столами (Студія, Фокус, DJ-пульт, Вініл, Кокпіт).'],
    guidePanel3Title:['Liquid Theme Wave & Custom Photos','Плавный перелив темы и свои фото','Плавний перелив теми та власні фото'],
    guidePanel3Desc:['Click the Moon/Sun icon in the top bar to watch the theme flow across the screen with a liquid wave! Upload your own background photos for the window or individual panels.','Нажми на иконку Луны/Солнца в шапке, чтобы тема сменилась красивым волновым переливом! Загружай свои фотографии на фон всего окна или отдельных панелей.','Натисни на іконку Місяця/Сонця в шапці, щоб тема змінилася красивим хвильовим переливом! Завантажуй власні фотографії на фон усього вікна або окремих панелей.'],
    guidePanel4Title:['Instant Rescue Reset (“Сброс вида”)','Мгновенный «Сброс вида» с отменой','Миттєве «Скидання вигляду» зі скасуванням'],
    guidePanel4Desc:['Experiment freely in Giga-Custom! If you ever over-tweak colors or panel sizes, click “Сброс вида” in the top bar (or inside Settings) to restore the default look while keeping all music.','Экспериментируй смело! Если накрутил лишнего с цветами или размерами панелей, кнопка «Сброс вида» в шапке мгновенно вернёт базовый вид (а музыка и плейлисты останутся).','Експериментуй сміливо! Якщо накрутив зайвого з кольорами чи розмірами панелей, кнопка «Скидання вигляду» в шапці миттєво поверне базовий вигляд (а музика й плейлисти залишаться).'],
    guideStep3Title:['Keyboard shortcuts & instant actions','Горячие клавиши и быстрый старт','Гарячі клавіші та швидкий старт'],
    guideStep3Desc:['Control playback without touching the mouse, or try ZENITH right now with the interactive buttons below.','Управляй плеером одной клавиатурой или протестируй возможности ZENITH прямо сейчас кнопками ниже.','Керуй плеєром однією клавіатурою або протестуй можливості ZENITH просто зараз кнопками нижче.'],
    guideTryTitle:['Try it right now:','Попробуй прямо сейчас:','Спробуй просто зараз:'],
    guideTrySub:['Launch a synthesized local demo track, test the liquid theme wave, or open customization.','Включи встроенный демо-трек, проверь волновой перелив темы или открой студию кастома.','Увімкни вбудований демо-трек, перевір хвильовий перелив теми або відкрий студію кастому.'],
    guideTryWave:['Test theme wave','Перелив темы','Перелив теми']
  };
  for(const [key,values] of Object.entries(GUIDE_COPY)){EN[key]=values[0];RU[key]=values[1];UK[key]=values[2];}
  const EXTRA_GUIDE_COPY={
    de:{welcomeHeading:'Willkommen bei ZENITH!',guideChooseLang:'Sprache:',guideStep0Title:'Dein privater lokaler Musikclub & modulares Studio',guideStep0Desc:'ZENITH ist ein unabhängiger Musikplayer und ein lebendiger kreativer Raum direkt auf deinem Gerät. Keine Konten, Abos, Werbung oder Clouds: Alle deine Musikdateien, Cover, Playlists und Layouts werden lokal auf deinem PC oder Telefon gespeichert und funktionieren auch ohne Internet.',guideStep0Wish:'Viel Spaß beim Hören❤️',guideTab1:'1. Was ist ZENITH',guideTab2:'2. Musik & Klang',guideTab3:'3. Panels & Design',guideTab4:'4. Tasten & Start',showGuideStartup:'Dieses Fenster bei jedem Start zeigen',guideNext:'Weiter →',guideStartBtn:'Verstanden, zur Musik!'},
    fr:{welcomeHeading:'Bienvenue sur ZENITH !',guideChooseLang:'Langue :',guideStep0Title:'Ton club musical local et studio modulable',guideStep0Desc:'ZENITH est un lecteur de musique indépendant et un espace créatif vivant directement sur ton appareil. Sans compte, abonnement, publicité ni cloud : toute ta musique, tes pochettes, playlists et dispositions sont stockées localement sur ton PC ou téléphone, et fonctionnent même sans internet.',guideStep0Wish:'Bonne écoute❤️',guideTab1:'1. Qu’est-ce que ZENITH',guideTab2:'2. Musique & Son',guideTab3:'3. Panneaux & Style',guideTab4:'4. Raccourcis & Départ',showGuideStartup:'Afficher ce guide à chaque lancement',guideNext:'Suivant →',guideStartBtn:'Compris, place à la musique !'},
    es:{welcomeHeading:'¡Bienvenido a ZENITH!',guideChooseLang:'Idioma:',guideStep0Title:'Tu club musical local y estudio modular',guideStep0Desc:'ZENITH es un reproductor de música independiente y un espacio creativo vivo directamente en tu dispositivo. Sin cuentas, suscripciones, anuncios ni nubes: toda tu música, portadas, listas y diseños se guardan localmente en tu PC o teléfono, y funciona incluso sin internet.',guideStep0Wish:'¡Que lo disfrutes!❤️',guideTab1:'1. Qué es ZENITH',guideTab2:'2. Música y Sonido',guideTab3:'3. Paneles y Diseño',guideTab4:'4. Atajos y Inicio',showGuideStartup:'Mostrar esta guía en cada inicio',guideNext:'Siguiente →',guideStartBtn:'¡Entendido, a la música!'},
    pt:{welcomeHeading:'Bem-vindo ao ZENITH!',guideChooseLang:'Idioma:',guideStep0Title:'O seu clube de música local e estúdio modular',guideStep0Desc:'O ZENITH é um reprodutor de música independente e um espaço criativo vivo diretamente no seu dispositivo. Sem contas, assinaturas, anúncios ou nuvens: toda a música, capas, playlists e layouts ficam salvos localmente no seu PC ou celular, funcionando até mesmo sem internet.',guideStep0Wish:'Bom proveito❤️',guideTab1:'1. O que é o ZENITH',guideTab2:'2. Música e Som',guideTab3:'3. Painéis e Estilo',guideTab4:'4. Atalhos e Início',showGuideStartup:'Mostrar este guia ao iniciar',guideNext:'Seguinte →',guideStartBtn:'Entendi, vamos à música!'},
    it:{welcomeHeading:'Benvenuto in ZENITH!',guideChooseLang:'Lingua:',guideStep0Title:'Il tuo club musicale locale e studio modulare',guideStep0Desc:'ZENITH è un lettore musicale indipendente e uno spazio creativo vivo direttamente sul tuo dispositivo. Niente account, abbonamenti, pubblicità o cloud: tutta la musica, le copertine, le playlist e i layout sono salvati localmente sul tuo PC o telefono e funziona anche senza internet.',guideStep0Wish:'Buon ascolto❤️',guideTab1:'1. Cos’è ZENITH',guideTab2:'2. Musica e Suono',guideTab3:'3. Pannelli e Stile',guideTab4:'4. Scorciatoie e Avvio',showGuideStartup:'Mostra questa guida a ogni avvio',guideNext:'Avanti →',guideStartBtn:'Capito, alla musica!'},
    pl:{welcomeHeading:'Witaj w ZENITH!',guideChooseLang:'Język:',guideStep0Title:'Twój lokalny klub muzyczny i modułowe studio',guideStep0Desc:'ZENITH to niezależny odtwarzacz muzyki i żywa przestrzeń twórcza bezpośrednio na Twoim urządzeniu. Bez kont, subskrypcji, reklam i chmur: cała muzyka, okładki, playlisty i układy są przechowywane lokalnie na Twoim komputerze lub telefonie i działają nawet bez internetu.',guideStep0Wish:'Miłego korzystania❤️',guideTab1:'1. Czym jest ZENITH',guideTab2:'2. Muzyka i Dźwięk',guideTab3:'3. Panele i Styl',guideTab4:'4. Skróty i Start',showGuideStartup:'Pokazuj ten przewodnik przy każdym uruchomieniu',guideNext:'Dalej →',guideStartBtn:'Rozumiem, do muzyki!'},
    tr:{welcomeHeading:'ZENITH’e Hoş Geldin!',guideChooseLang:'Dil:',guideStep0Title:'Yerel müzik kulübün ve modüler stüdyon',guideStep0Desc:'ZENITH, doğrudan cihazında yaşayan bağımsız bir müzik çalar ve canlı bir yaratıcı alandır. Hesap, abonelik, reklam veya bulut yok: tüm müzikler, kapaklar, çalma listeleri ve düzenler bilgisayarında veya telefonunda yerel olarak saklanır, интернету olmadan bile çalışır.',guideStep0Wish:'Keyifli kullanımlar❤️',guideTab1:'1. ZENITH Nedir',guideTab2:'2. Müzik ve Ses',guideTab3:'3. Paneller ve Özel',guideTab4:'4. Kısayollar ve Başla',showGuideStartup:'Her açılışta bu rehberi göster',guideNext:'İleri →',guideStartBtn:'Anlaşıldı, müziğe geçelim!'},
    ja:{welcomeHeading:'ZENITH へようこそ！',guideChooseLang:'言語:',guideStep0Title:'あなただけのローカル音楽クラブ＆カスタムスタジオ',guideStep0Desc:'ZENITH はあなたのデバイス上で動く独立した音楽プレイヤーであり、生きたクリエイティブ空間です。アカウント、サブスク、広告、クラウドは一切不要。すべての音楽、ジャケット、プレイリスト、レイアウトはお使いの PC やスマホにローカル保存され、オフラインでも動作します。',guideStep0Wish:'お楽しみください❤️',guideTab1:'1. ZENITHとは',guideTab2:'2. 音楽とサウンド',guideTab3:'3. パネルとカスタム',guideTab4:'4. キーとスタート',showGuideStartup:'起動時に毎回このガイドを表示する',guideNext:'次へ →',guideStartBtn:'音楽をはじめる！'},
    zh:{welcomeHeading:'欢迎来到 ZENITH！',guideChooseLang:'语言：',guideStep0Title:'你的本地音乐俱乐部与模块化工作室',guideStep0Desc:'ZENITH 是直接运行在你设备上的独立音乐播放器与鲜活创作空间。无需账号、订阅、广告或云端：所有音乐、封面、歌单和布局都保存在你的电脑或手机本地，即使没有网络也能畅快运行。',guideStep0Wish:'祝你使用愉快❤️',guideTab1:'1. 什么是 ZENITH',guideTab2:'2. 音乐与音效',guideTab3:'3. 面板与定制',guideTab4:'4. 快捷键与开始',showGuideStartup:'每次启动时显示此指南',guideNext:'下一步 →',guideStartBtn:'明白了，开始听歌！'}
  };
  for(const [lang,map] of Object.entries(EXTRA_GUIDE_COPY))if(LOCALES[lang])Object.assign(LOCALES[lang],map);

  const BASE_COLORS={
    light:{bg:'#efeee9',surface:'#fffdf7',sidebar:'#f4f1e8',player:'#f3efdf',text:'#262622',muted:'#62635c',border:'#c7c6bc',accent:'#cbe88e',accentText:'#1b2412',hero:'#eeefdf',visualizer:'#42613b',outline:'#68695f',hover:'#e8e9df',sleeve:'#bad0ed',vinyl:'#3b3b38',sticker:'#f3d97c',recordLabel:'#e9b0a4'},
    dark:{bg:'#080808',surface:'#151515',sidebar:'#111111',player:'#191919',text:'#f3f3ee',muted:'#b6b6b0',border:'#424242',accent:'#cbe88e',accentText:'#17200d',hero:'#1c1c1c',visualizer:'#cbe88e',outline:'#666666',hover:'#292929',sleeve:'#a9becd',vinyl:'#353535',sticker:'#efd384',recordLabel:'#e8ac9e'}
  };
  const SPECTRUM_STYLES=['bars','dots','wave','mirror','ring','orbit','ribbon','mountains'];
  const VISUAL_KEYS=['theme','colors','radius','shadow','fontScale','density','autoContrast','surfaceOpacity','backdrops','spectrumStyle','spectrumGain','spectrumSmooth','spectrumCount','spectrumStroke','spectrumGlow','spectrumColor','spectrumColor2','spectrumGradient','spectrumMirror','workspaceGap','workspaceMargin','borderWidth','borderStyle','panelPadding','headerHeight','glassBlur','shapeProfile','cornerTL','cornerTR','cornerBR','cornerBL','use4Corners','fontFamily','letterSpacing','motionDuration','motionCurve','heroScene'];
  const safeColor=value=>typeof value==='string'&&/^#[\da-f]{6}$/i.test(value)?value:'';
  function luminance(hex){const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
  function contrastRatio(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  function readableInk(bg,preferred,minimum=4.5){if(safeColor(preferred)&&contrastRatio(bg,preferred)>=minimum)return preferred;for(const color of ['#f7f7f2','#151515'])if(contrastRatio(bg,color)>=minimum)return color;return contrastRatio(bg,'#ffffff')>=contrastRatio(bg,'#000000')?'#ffffff':'#000000';}
  function guardedSurface(bg,preferred,secondary,opacity){
    const channels=[1,3,5].map(i=>parseInt(bg.slice(i,i+2),16));
    const composite=(alpha,under)=>'#'+channels.map(c=>Math.round(c*alpha+under*(1-alpha)).toString(16).padStart(2,'0')).join('');
    for(let alpha=clamp(opacity,45,100)/100;alpha<=1.0001;alpha=Math.min(1,alpha+.05)){
      const low=composite(alpha,0),high=composite(alpha,255),pick=color=>[color,'#f7f7f2','#151515','#ffffff','#000000'].find(c=>safeColor(c)&&contrastRatio(low,c)>=4.5&&contrastRatio(high,c)>=4.5),ink=pick(preferred),muted=pick(secondary);
      if(ink&&muted)return {ink,muted,alpha};if(alpha===1)break;
    }return {ink:readableInk(bg,preferred),muted:readableInk(bg,secondary),alpha:1};
  }
  function rgbTriplet(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(' ');}
  function resolvedColors(scheme=themeName(),custom=settings.colors[scheme],guard=settings.autoContrast){
    const p={...BASE_COLORS[scheme],...custom};if(guard){p.text=readableInk(p.bg,p.text);p.muted=readableInk(p.surface,p.muted);p.accentText=readableInk(p.accent,p.accentText);}return p;
  }
  function cleanBackdrops(input){
    const out={};if(!input||typeof input!=='object')return out;
    for(const [id,v] of Object.entries(input).slice(0,14))if(/^(workspace|main|hero|navigation|now|player|widget-[a-z0-9-]{1,60})$/.test(id)&&v&&typeof v==='object')out[id]={image:typeof v.image==='string'&&/^asset-[a-z0-9-]{1,70}$/.test(v.image)?v.image:'',shade:clamp(v.shade??60,0,95),blur:clamp(v.blur,0,20),fit:['cover','contain'].includes(v.fit)?v.fit:'cover',position:['center','top','bottom','left','right'].includes(v.position)?v.position:'center'};
    return out;
  }
  function cleanVisual(input){
    const out={};input=input&&typeof input==='object'?input:{};
    for(const key of VISUAL_KEYS){if(['colors','backdrops'].includes(key))continue;const v=input[key];if(typeof DEFAULTS[key]==='boolean')out[key]=typeof v==='boolean'?v:DEFAULTS[key];else if(RANGES[key])out[key]=Number.isFinite(Number(v))?clamp(v,...RANGES[key]):DEFAULTS[key];else if(OPTIONS[key])out[key]=OPTIONS[key].includes(v)?v:DEFAULTS[key];else out[key]=safeColor(v);}
    out.colors={light:{},dark:{}};for(const scheme of ['light','dark'])for(const key of COLOR_KEYS)if(safeColor(input.colors?.[scheme]?.[key]))out.colors[scheme][key]=input.colors[scheme][key];
    out.backdrops=cleanBackdrops(input.backdrops);out.panelStyles={};
    for(const [id,r] of Object.entries(cleanPanelLayout(input.panelStyles))){out.panelStyles[id]={color:r.color,ink:r.ink,line:r.line,radius:r.radius,header:r.header};}
    if(out.autoContrast)out.surfaceOpacity=Math.max(60,out.surfaceOpacity);return out;
  }
  function cleanSavedThemes(input){const seen=new Set();return Array.isArray(input)?input.slice(0,24).filter(v=>v&&typeof v.id==='string'&&!seen.has(v.id.slice(0,80))&&seen.add(v.id.slice(0,80))).map(v=>({id:v.id.slice(0,80),name:String(v.name||'My theme').slice(0,70),visual:cleanVisual(v.visual)})):[];}
  function cleanPanelLayout(input){
    const result={};if(!input||typeof input!=='object')return result;
    for(const [id,p] of Object.entries(input).slice(0,14)){
      if(!/^(navigation|now|player|widget-[a-z0-9-]{1,60})$/.test(id)||!p||typeof p!=='object')continue;
      result[id]={zone:PANEL_ZONES.includes(p.zone)?p.zone:'float',x:clamp(p.x,0,30000),y:clamp(p.y,0,30000),w:clamp(p.w||300,180,1600),h:clamp(p.h||340,80,1400),order:clamp(p.order,0,100),collapsed:p.collapsed===true,visible:p.visible!==false,pinned:p.pinned===true,color:safeColor(p.color),name:typeof p.name==='string'?p.name.slice(0,70):'',content:WIDGET_TYPES.includes(p.content)?p.content:'native',ink:safeColor(p.ink),line:safeColor(p.line),radius:p.radius==null||p.radius===''?null:clamp(p.radius,0,44),borderWidth:p.borderWidth==null||p.borderWidth===''?null:clamp(p.borderWidth,0,6),opacity:p.opacity==null||p.opacity===''?null:clamp(p.opacity,30,100),padding:p.padding==null||p.padding===''?null:clamp(p.padding,4,32),scale:p.scale==null||p.scale===''?null:clamp(p.scale,80,125),shape:['inherit','standard','pill','sharp','sketch'].includes(p.shape)?p.shape:'inherit',header:p.header!==false,spectrumStyle:SPECTRUM_STYLES.includes(p.spectrumStyle)?p.spectrumStyle:'',notes:String(p.notes||'').slice(0,6000)};
    }
    return result;
  }
  function cleanModifiedThemes(input){
    const out={};if(!input||typeof input!=='object')return out;
    for(const [id,v] of Object.entries(input).slice(0,32)){
      if(!/^[a-z0-9_-]{1,40}$/i.test(id)||!v||typeof v!=='object')continue;
      const colors={};for(const key of COLOR_KEYS)if(safeColor(v.colors?.[key]))colors[key]=v.colors[key];
      out[id]={name:typeof v.name==='string'?v.name.slice(0,70):'',mode:['light','dark'].includes(v.mode)?v.mode:'',colors,visual:v.visual?cleanVisual(v.visual):null};
    }
    return out;
  }
  function cleanModifiedLayouts(input){
    const out={};if(!input||typeof input!=='object')return out;
    for(const [id,v] of Object.entries(input).slice(0,16)){
      if(!/^[a-z0-9_-]{1,40}$/i.test(id)||!v||typeof v!=='object')continue;
      out[id]={name:typeof v.name==='string'?v.name.slice(0,70):'',panels:cleanPanelLayout(v.panels),widgets:cleanCustomPanels(v.widgets),showNow:typeof v.showNow==='boolean'?v.showNow:true};
    }
    return out;
  }
  function cleanCustomPanels(input){const seen=new Set();return Array.isArray(input)?input.slice(0,8).filter(p=>p&&/^widget-[a-z0-9-]{1,60}$/.test(p.id||'')&&WIDGET_TYPES.includes(p.type)&&!seen.has(p.id)&&seen.add(p.id)).map(p=>({id:p.id,type:p.type,title:String(p.title||'').slice(0,70),notes:String(p.notes||'').slice(0,6000)})):[];}
  function cleanSavedLayouts(input){return Array.isArray(input)?input.slice(0,8).filter(p=>p&&typeof p.id==='string').map(p=>({id:p.id.slice(0,80),name:String(p.name||'Layout').slice(0,70),panels:cleanPanelLayout(p.panels),widgets:cleanCustomPanels(p.widgets)})):[];}
  function sanitizeSettings(input) {
    const result = structuredClone(DEFAULTS); if (!input || typeof input !== 'object') return result;
    for (const key of Object.keys(DEFAULTS)) {
      const value = input[key];
      if (typeof DEFAULTS[key] === 'boolean' && typeof value === 'boolean') result[key] = value;
      else if (RANGES[key] && Number.isFinite(Number(value))) result[key] = clamp(value,...RANGES[key]);
      else if (OPTIONS[key]?.includes(value)) result[key] = value;
    }
    if (Object.hasOwn(LANGUAGE_NAMES,input.language)) result.language = input.language;
    if (Array.isArray(input.eq) && input.eq.length === 8) result.eq = input.eq.map(value => clamp(value,-12,12));
    for (const scheme of ['light','dark']) for (const key of COLOR_KEYS) if (safeColor(input.colors?.[scheme]?.[key])) result.colors[scheme][key] = input.colors[scheme][key];
    result.panelLayout=cleanPanelLayout(input.panelLayout);result.customPanels=cleanCustomPanels(input.customPanels);result.savedLayouts=cleanSavedLayouts(input.savedLayouts);
    result.backdrops=cleanBackdrops(input.backdrops);result.savedThemes=cleanSavedThemes(input.savedThemes);for(const key of ['spectrumColor','spectrumColor2'])result[key]=safeColor(input[key]);
    result.customCSS=typeof input.customCSS==='string'?input.customCSS.slice(0,12000):'';
    result.modifiedThemes=cleanModifiedThemes(input.modifiedThemes);
    result.modifiedLayouts=cleanModifiedLayouts(input.modifiedLayouts);
    if(result.autoContrast)result.surfaceOpacity=Math.max(60,result.surfaceOpacity);result.pageSize = Math.round(result.pageSize); return result;
  }
  function cleanPlaylists(input) {
    if (!Array.isArray(input)) return [];
    const seen = new Set(); return input.slice(0,500).filter(p => p && typeof p.id === 'string' && !seen.has(p.id.slice(0,100)) && seen.add(p.id.slice(0,100))).map(p => ({id:p.id.slice(0,100),name:String(p.name || 'Playlist').slice(0,100),ids:Array.isArray(p.ids) ? [...new Set(p.ids.filter(id => typeof id === 'string'))].slice(0,100000) : []}));
  }
  let stored = {}; try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch { /* Fresh session when storage is blocked or malformed. */ }
  let settings = sanitizeSettings(stored.settings);
  if(stored.settings&&Number(stored.settings.designVersion||0)<3){settings.shadow=0;for(const key of ['bg','surface','sidebar','player','hero','hover','text','muted','border','outline'])settings.colors.dark[key]=BASE_COLORS.dark[key];}
  let playlists = cleanPlaylists(stored.playlists);
  let tracks = []; const trackMap = new Map();
  let view = 'home', albumFilter = '', query = '', page = 1, db = null;
  let currentId = '', currentURL = '', playToken = 0, queue = [], manualQueue = [], playHistory = [], shuffleBag = [];
  let shuffle = stored.shuffle === true, repeat = ['off','all','one'].includes(stored.repeat) ? stored.repeat : 'off';
  let importing = false, cancelImport = false, layoutEditing = false, settingsTab = 'general', editCallback = null;
  let saveTimer = 0, savingWarning = false, lastPositionSave = 0, sleepTimer = 0, sleepDeadline = 0;
  let graph = null, graphFailed = false, visualFrame = 0, visualLast = 0, resizeObserver = null;
  let coverObserver = null, renderRevision = 0, currentCoverToken = 0;
  const temporaryFiles = new Map(), temporaryCovers = new Map(), coverCache = new Map(), coverRequests = new Map();
  const audio = $('#audio');
  const t = (key, vars = {}) => { let value = LOCALES[settings.language]?.[key] ?? EN[key] ?? key; for(const [name,replacement] of Object.entries(vars)) value = value.replaceAll(`{${name}}`,String(replacement)); return value; };
  const currentTrack = () => trackMap.get(currentId);
  const fire = fn => Promise.resolve().then(fn).catch(error => { console.error('ZENITH:',error); toast(error?.name === 'QuotaExceededError' ? t('storageFull') : t('loadingError'),true); });
  function toast(message, error = false) { const node = document.createElement('div'); node.className = `toast${error ? ' error' : ''}`; node.textContent = message; $('#toasts').append(node); while($('#toasts').children.length > 4) $('#toasts').firstChild.remove(); setTimeout(() => node.remove(),error ? 7500 : 4000); }
  function saveState(immediate = false) {
    clearTimeout(saveTimer);
    const write = () => { try { localStorage.setItem(STORAGE_KEY,JSON.stringify({settings,playlists,shuffle,repeat,onboardingSeen:stored.onboardingSeen===true,lastTrack:settings.rememberPosition ? currentId : '',lastTime:settings.rememberPosition ? (audio.currentTime || 0) : 0})); } catch { savingWarning = true; } };
    if(immediate) write(); else saveTimer = setTimeout(write,180);
  }
  function storageWarning(key) { $('#storageWarning').textContent = t(key); $('#storageWarning').dataset.message = key; $('#storageWarning').hidden = false; }

  // IndexedDB transactions resolve on commit, not on an individual request.
  function openDatabase() {
    return new Promise((resolve,reject) => {
      if (!globalThis.indexedDB) return reject(new Error('IndexedDB unavailable'));
      const request = indexedDB.open('ZENITH_LOCAL_1',2);
      request.onupgradeneeded = () => { const database=request.result;for(const name of ['tracks','files','covers','assets'])if(!database.objectStoreNames.contains(name))database.createObjectStore(name,name==='tracks'?{keyPath:'id'}:undefined); };
      let expired=false;
      const timeout = setTimeout(() => {expired=true;reject(new Error('Database blocked'));},4500);
      request.onerror = () => {clearTimeout(timeout); reject(request.error);};
      request.onblocked = () => {clearTimeout(timeout); expired=true;reject(new Error('Database blocked'));};
      request.onsuccess = () => { clearTimeout(timeout);if(expired){request.result.close();return;}resolve(request.result); };
    });
  }
  function dbRead(store,key) {
    if(!db) return Promise.resolve(undefined);
    return new Promise((resolve,reject) => { const tx = db.transaction(store,'readonly'); const req = key === undefined ? tx.objectStore(store).getAll() : tx.objectStore(store).get(key); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); tx.onabort = () => reject(tx.error); });
  }
  function dbWrite(storeNames,operation) {
    if(!db) return Promise.reject(new Error('Database unavailable'));
    return new Promise((resolve,reject) => { const tx = db.transaction(storeNames,'readwrite'); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error('Transaction aborted')); try{operation(tx);}catch(error){tx.abort();reject(error);} });
  }
  async function persistMetadata(track) { if(!track || track.temporary || !db) return; try{await dbWrite(['tracks'],tx => tx.objectStore('tracks').put(track));}catch{storageWarning('storageFull');} }
  async function getAudioFile(id) { return temporaryFiles.get(id) || await dbRead('files',id); }

  // Bounded metadata readers. No full audio decode, external tag libraries or uploads.
  const ascii = (data,start,length) => String.fromCharCode(...data.subarray(start,start+length));
  const syncSafe = (data,start) => ((data[start]&127)*2097152 + (data[start+1]&127)*16384 + (data[start+2]&127)*128 + (data[start+3]&127));
  const uint32 = (data,start,little = false) => new DataView(data.buffer,data.byteOffset,data.byteLength).getUint32(start,little);
  const cleanText = str => str.replace(/\0/g,'').trim().slice(0,500);
  function decodeText(data) {
    if(!data.length) return ''; const encoding = data[0]; let body = data.subarray(1);
    try { if(encoding === 0) return cleanText(new TextDecoder('windows-1252').decode(body)); if(encoding === 2) return cleanText(new TextDecoder('utf-16be').decode(body)); if(encoding === 1){ const big = body[0] === 254 && body[1] === 255; if((body[0] === 255 && body[1] === 254) || big) body = body.subarray(2); return cleanText(new TextDecoder(big ? 'utf-16be' : 'utf-16le').decode(body)); } return cleanText(new TextDecoder('utf-8').decode(body)); } catch{return '';}
  }
  function parseID3(data) {
    const meta = {}; if(ascii(data,0,3) !== 'ID3' || data.length < 10) return meta;
    const version = data[3], flags = data[5], end = Math.min(data.length,10+syncSafe(data,6));
    if(![3,4].includes(version) || (flags & 0x80)) return meta; // Unsupported unsynchronization: filename fallback.
    let offset = 10;
    if(flags & 0x40){ if(offset+4 > end) return meta; offset += version === 4 ? syncSafe(data,offset) : 4+uint32(data,offset); }
    while(offset+10 <= end){ const id = ascii(data,offset,4); if(!/^[A-Z0-9]{4}$/.test(id)) break; const size = version === 4 ? syncSafe(data,offset+4) : uint32(data,offset+4); const frameFlags = data[offset+9]; offset += 10;
      if(size < 1 || offset+size > end) break; const payload = data.subarray(offset,offset+size); offset += size;
      if((version === 3 && frameFlags & 0xe0) || (version === 4 && frameFlags & 0x4f)) continue;
      const fields = {TIT2:'title',TPE1:'artist',TALB:'album',TCON:'genre'};
      if(fields[id]) meta[fields[id]] = decodeText(payload);
      if(id === 'APIC' && size < 5*1024*1024 && !meta.picture){
        let p = 1; while(p < payload.length && payload[p]) p++; const mime = ascii(payload,1,p-1).toLowerCase(); p += 2;
        const width = [1,2].includes(payload[0]) ? 2 : 1;
        while(p+width <= payload.length){ if(payload[p] === 0 && (width === 1 || payload[p+1] === 0)){p += width;break;} p += width; }
        if(['image/jpeg','image/png','image/webp'].includes(mime) && p < payload.length) meta.picture = new Blob([payload.subarray(p)],{type:mime});
      }
    }
    return meta;
  }
  function parseFLAC(data) {
    const meta = {}; if(ascii(data,0,4) !== 'fLaC') return meta; let p = 4;
    while(p+4 <= data.length){ const last = !!(data[p]&128), type = data[p]&127, size = data[p+1]*65536+data[p+2]*256+data[p+3]; p += 4; if(p+size > data.length) break; const block = data.subarray(p,p+size); p += size;
      if(type === 0 && size >= 34){ const rate = block[10]*4096 + block[11]*16 + (block[12]>>4); const samples = (block[13]&15)*4294967296 + uint32(block,14); if(rate) meta.duration = samples/rate; meta.sampleRate = rate; }
      if(type === 4 && size >= 8){ let q = 4+uint32(block,0,true); if(q+4 <= size){ const count = Math.min(uint32(block,q,true),1000); q += 4; for(let i=0;i<count && q+4<=size;i++){const n=uint32(block,q,true);q+=4;if(q+n>size)break;const text=new TextDecoder().decode(block.subarray(q,q+n));q+=n;const equal=text.indexOf('=');if(equal<0)continue;const key=text.slice(0,equal).toLowerCase();if(['title','artist','album','genre'].includes(key))meta[key]=cleanText(text.slice(equal+1));} } }
      if(type === 6 && size > 32 && size < 5*1024*1024){ let q=4; const mimeSize=uint32(block,q);q+=4;if(q+mimeSize+4<=size){const mime=ascii(block,q,mimeSize).toLowerCase();q+=mimeSize;const descriptionSize=uint32(block,q);q+=4+descriptionSize+16;if(q+4<=size){const pictureSize=uint32(block,q);q+=4;if(q+pictureSize<=size && ['image/jpeg','image/png','image/webp'].includes(mime))meta.picture=new Blob([block.subarray(q,q+pictureSize)],{type:mime});}} }
      if(last) break;
    }
    return meta;
  }
  function parseWAV(data,fileSize) {
    const result={}; if(data.length<44 || ascii(data,0,4)!=='RIFF' || ascii(data,8,4)!=='WAVE')return result;
    let offset=12,byteRate=0; while(offset+8<=data.length){const type=ascii(data,offset,4),size=uint32(data,offset+4,true);if(type==='fmt ' && offset+24<=data.length){result.sampleRate=uint32(data,offset+12,true);byteRate=uint32(data,offset+16,true);}if(type==='data' && byteRate){result.duration=Math.min(size,fileSize-offset-8)/byteRate;break;}offset+=8+size+(size%2);}return result;
  }
  function filenameMetadata(file) {
    const name=file.name.replace(/\.[^.]+$/,'').replace(/_/g,' ').trim(); const split=name.match(/^(.+?)\s+[–—-]\s+(.+)$/); const parts=(file.webkitRelativePath||'').split('/');
    return {title:split?split[2]:name,artist:split?split[1]:'',album:parts.length>1?parts[parts.length-2]:''};
  }
  async function readMetadata(file) {
    const fallback = filenameMetadata(file); const first = new Uint8Array(await file.slice(0,64).arrayBuffer()); let amount = 256*1024;
    if(ascii(first,0,3)==='ID3')amount=Math.min(8*1024*1024,10+syncSafe(first,6));
    else if(ascii(first,0,4)==='fLaC')amount=4*1024*1024;
    const data = new Uint8Array(await file.slice(0,amount).arrayBuffer()); let tags={};
    try { tags = ascii(data,0,3)==='ID3' && settings.readTags ? parseID3(data) : ascii(data,0,4)==='fLaC' ? parseFLAC(data) : parseWAV(data,file.size); } catch { /* A malformed tag must never abort an audio import. */ }
    if(!settings.readTags) {delete tags.title;delete tags.artist;delete tags.album;delete tags.genre;delete tags.picture;}
    for(const key of ['title','artist','album']) if(!tags[key]) delete tags[key];
    return {...fallback,...tags};
  }
  async function thumbnail(blob) {
    if(!blob || !settings.artwork) return null;
    let bitmap, url;
    try {
      if(typeof createImageBitmap === 'function') bitmap=await createImageBitmap(blob,{resizeWidth:240,resizeQuality:'medium'});
      else {url=URL.createObjectURL(blob);bitmap=await new Promise((resolve,reject)=>{const image=new Image();const timer=setTimeout(()=>reject(new Error('Cover timeout')),2500);image.onload=()=>{clearTimeout(timer);resolve(image);};image.onerror=()=>{clearTimeout(timer);reject(new Error('Invalid cover'));};image.src=url;});}
      const canvas=document.createElement('canvas');canvas.width=240;canvas.height=240;const context=canvas.getContext('2d');if(!context)return null;const w=bitmap.width,h=bitmap.height,side=Math.min(w,h);context.drawImage(bitmap,(w-side)/2,(h-side)/2,side,side,0,0,240,240);
      return await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.78));
    } catch{return null;} finally{bitmap?.close?.();if(url)URL.revokeObjectURL(url);}
  }
  function fingerprint(file) { return `${file.name}\u0000${file.size}\u0000${file.lastModified}`; }
  function stableId(str) { let a=2166136261,b=3335557771;for(let i=0;i<str.length;i++){a=Math.imul(a^str.charCodeAt(i),16777619);b=Math.imul(b^str.charCodeAt(i),2246822519);}return `t${(a>>>0).toString(36)}${(b>>>0).toString(36)}`; }
  const isAudio = file => /\.(mp3|flac|wav|wave|ogg|opus|m4a|aac|aif|aiff|webm|mp4)$/i.test(file.name) || file.type.startsWith('audio/');
  async function importFiles(input, {demo=false} = {}) {
    if(importing){toast(t('importBusy'));return;}
    const files=Array.from(input).filter(isAudio);if(!files.length){toast(t('noAudio'));return;}
    importing=true;cancelImport=false;$('#importProgress').hidden=false;$('#importBar').max=files.length;$('#importBar').value=0;$('#importTitle').textContent=t('importing');
    let added=0,skipped=0,failed=0;const known=new Set(tracks.map(track=>track.fingerprint));const importedIds=[];
    try {
      for(let i=0;i<files.length;i++){
        if(cancelImport)break;
        const file=files[i],signature=fingerprint(file);$('#importDetail').textContent=`${i+1} / ${files.length} · ${file.name}`;
        if(settings.duplicates && known.has(signature)){skipped++;$('#importBar').value=i+1;continue;}
        try {
          const info=await readMetadata(file),cover=await thumbnail(info.picture);delete info.picture;
          let id=stableId(signature);if(trackMap.has(id))id=`${id}-${uid()}`;
          const track={...info,id,name:file.name,path:file.webkitRelativePath||'',size:file.size,format:file.name.split('.').pop().toUpperCase(),fingerprint:signature,added:Date.now()+i,favorite:false,lastPlayed:0,cover:!!cover,demo,duration:info.duration||0,temporary:!settings.persistMusic||!db};
          if(!track.temporary){try{await dbWrite(['tracks','files','covers'],tx=>{tx.objectStore('tracks').put(track);tx.objectStore('files').put(file,id);if(cover)tx.objectStore('covers').put(cover,id);});}catch{track.temporary=true;storageWarning('storageFull');}}
          if(track.temporary){temporaryFiles.set(id,file);if(cover)temporaryCovers.set(id,cover);if(settings.persistMusic&&!db)storageWarning('storageUnavailable');}
          tracks.push(track);trackMap.set(id,track);known.add(signature);importedIds.push(id);added++;
        }catch(error){failed++;console.warn('Could not import audio:',file.name,error);}
        $('#importBar').value=i+1;
        if(added%8===0)renderLibrary();
        await nextPaint();
      }
    } finally {
      importing=false;$('#importProgress').hidden=true;renderAll();saveState();
      const message=[t('added',{n:added}),skipped?t('skipped',{n:skipped}):'',failed?t('failed',{n:failed}):''].filter(Boolean).join(' · ');toast(cancelImport?t('importCanceled'):message,failed>0);
    }
    return importedIds;
  }
  async function directoryFiles(entry) {
    if(entry.isFile)return await new Promise(resolve=>entry.file(file=>resolve([file]),()=>resolve([])));
    if(!entry.isDirectory)return [];
    const reader=entry.createReader();const files=[];
    while(true){const batch=await new Promise((resolve,reject)=>reader.readEntries(resolve,reject));if(!batch.length)break;for(const child of batch)for(const file of await directoryFiles(child))files.push(file);}
    return files;
  }

  function localize(root=document) { const lc=$('#topLangCode');if(lc)lc.textContent=(settings.language||'ru').toUpperCase();
    $$('[data-i18n]',root).forEach(node=>{node.textContent=t(node.dataset.i18n);});
    $$('[data-i18n-placeholder]',root).forEach(node=>{node.placeholder=t(node.dataset.i18nPlaceholder);});
    $$('[data-i18n-title]',root).forEach(node=>{node.title=t(node.dataset.i18nTitle);node.setAttribute('aria-label',node.title);});
    $$('[data-i18n-aria]',root).forEach(node=>node.setAttribute('aria-label',t(node.dataset.i18nAria)));
    document.documentElement.lang=settings.language;
  }
  const systemTheme=globalThis.matchMedia?.('(prefers-color-scheme: dark)');
  const narrowWindow=globalThis.matchMedia?.('(max-width: 900px)');
  function themeName(){return settings.theme==='system'?(systemTheme?.matches?'dark':'light'):settings.theme;}
  const THEME_STYLE_PROFILES={
    cartoon:{shapeProfile:'drawn',radius:24,use4Corners:false,borderWidth:2.5,borderStyle:'solid',shadow:4,fontFamily:'rounded',activePanelGlow:false,spectrumGlow:0,heroScene:'art-cartoon-boombox'},
    arcane:{shapeProfile:'cyber',radius:16,use4Corners:false,borderWidth:2,borderStyle:'solid',shadow:3,fontFamily:'sans',activePanelGlow:true,spectrumGlow:10,heroScene:'anim-arcane'},
    brutal:{shapeProfile:'brutalist',radius:0,use4Corners:false,cornerTL:0,cornerTR:0,cornerBR:0,cornerBL:0,borderWidth:2,borderStyle:'solid',shadow:0,fontFamily:'mono',activePanelGlow:false,spectrumGlow:0,heroScene:'art-brutal-deck'}
  };
  const DEFAULT_THEME_PRESETS=[
    ['cartoon','Cartoon Pop · Мультяшный','light','#ff5252','#2979ff','#fff3c4','#fffdf4','#ffe89e','cozy','#1a1615'],
    ['arcane','Arcane: Hextech · Аркейн','dark','#ff2a85','#00e5ff','#090a12','#121524','#151228','neon','#c89b3c'],
    ['brutal','Tactical Steel · Строгий','dark','#d97706','#f59e0b','#0b0c0e','#131619','#111418','dark','#454f5b'],
    ['carbon','Carbon Studio','dark','#e4e4dc','#e6b58b','','','','cozy'],
    ['lime','Black Lime','dark','#cbe88e','#93d8ce','','','','neon'],
    ['cyberpunk','Cyberpunk 2099','dark','#fcee0a','#00f0ff','#090a12','#121526','#191d36','neon'],
    ['synthwave','Sunset Synthwave','dark','#ff4ecd','#00e5ff','#160d24','#221436','#2c1947','neon'],
    ['nord','Nordic Frost','dark','#88c0d0','#a3be8c','#242933','#2e3440','#3b4252','cozy'],
    ['gruvbox','Warm Vinyl','dark','#fe8019','#b8bb26','#1d2021','#282828','#32302f','cozy'],
    ['catppuccin','Mocha Velvet','dark','#cba6f7','#f5c2e7','#181825','#1e1e2e','#313244','cozy'],
    ['amoled','Pure OLED Emerald','dark','#10b981','#34d399','#000000','#0a0a0a','#121212','neon'],
    ['ember','Ember Glow','dark','#f1aa85','#f0d087','','','','cozy'],
    ['ice','Glacier Night','dark','#a1d8ec','#d7ecc5','','','','neon'],
    ['orchid','Midnight Orchid','dark','#d6b4f1','#f2b3c3','','','','neon'],
    ['mint','Mint Night','dark','#94dfb6','#e2d294','','','','cozy'],
    ['cherry','Cherry Noir','dark','#f4a6b8','#bcb5f1','','','','neon'],
    ['gold','Black Gold','dark','#efcf88','#c3d3bb','','','','cozy'],
    ['paper','Paper Garden','light','#ccdf9c','#57764e','#f1efe5','#fffdf5','#e5ead5','cozy'],
    ['matcha','Matcha Latte','light','#88b878','#3f6a34','#eff2e8','#fbfcf7','#e2ead8','cozy'],
    ['solarized','Solarized Studio','light','#e6c15c','#2aa198','#f5efdc','#fdf6e3','#eee8d5','cozy'],
    ['sorbet','Peach Sorbet','light','#ecb2a1','#985b4b','#f6ede5','#fffaf4','#f3ded4','cozy'],
    ['sage','Sage Leaf','light','#bdd3b2','#4d7159','#edf0e6','#fcfdf5','#e0e8d6','cozy'],
    ['lavender','Lavender Milk','light','#d5c3e8','#79608e','#f2edf4','#fffafd','#e9e0f0','cozy'],
    ['lemon','Lemon Tea','light','#eed78b','#7c662d','#f2efe1','#fffdf2','#eee5c8','cozy'],
    ['sky','Sky & Peach','light','#b1d2df','#4c7387','#eef2f1','#fbfefb','#e0edf0','cozy'],
    ['rose','Rose Paper','light','#e5b5bd','#8b4e60','#f4edeb','#fffaf6','#eedde1','cozy'],
    ['mono','Ink & Paper','light','#d1d1c4','#55564f','#eeeeea','#fffffa','#e5e5dc','cozy']
  ].map(([id,name,mode,accent,visualizer,bg,surface,hero,tag,outline])=>({id,name,mode,tag:tag||mode,styleProfile:THEME_STYLE_PROFILES[id]||null,colors:{...BASE_COLORS[mode],accent,accentText:readableInk(accent,'#151515'),visualizer,...(bg?{bg,surface,hero,sidebar:id==='cartoon'?'#ffe082':hero,player:id==='cartoon'?'#ffd54f':hero,hover:hero}:{}),...(outline?{outline,border:id==='cartoon'?'#1a1615':BASE_COLORS[mode].border}:{}),sticker:mode==='dark'?accent:(id==='cartoon'?'#ffea00':BASE_COLORS.light.sticker),recordLabel:mode==='dark'?visualizer:(id==='cartoon'?'#ff5252':BASE_COLORS.light.recordLabel)}}));
  function getThemePresets(){
    return DEFAULT_THEME_PRESETS.map(base=>{
      const mod=settings.modifiedThemes?.[base.id];if(!mod)return base;
      const mode=mod.mode||base.mode;
      return {...base,name:mod.name||base.name,mode,modified:true,visual:mod.visual||null,colors:{...BASE_COLORS[mode],...base.colors,...(mod.colors||{})}};
    });
  }
  let themeGalleryFilter='all',backgroundTarget='workspace',pendingPhotoTarget='workspace',backdropRevision=0;
  const assetCache=new Map(),assetRequests=new Map(),temporaryAssets=new Map();
  const backdropDefault=()=>({image:'',shade:65,blur:0,fit:'cover',position:'center'});
  const backdropFor=id=>settings.backdrops[id]||backdropDefault();
  function backdropTargetName(id){return ['workspace','main','hero'].includes(id)?t({workspace:'workspaceBg',main:'mainBg',hero:'heroBg'}[id]):panelTitle(id);}
  function visualSnapshot(){const snapshot={};for(const key of VISUAL_KEYS)snapshot[key]=structuredClone(settings[key]);snapshot.panelStyles={};for(const id of panelIds()){const r=panelConfig(id);snapshot.panelStyles[id]={color:r.color,ink:r.ink,line:r.line,radius:r.radius,header:r.header};}return cleanVisual(snapshot);}
  function applyVisual(input){const visual=cleanVisual(input);for(const key of VISUAL_KEYS)settings[key]=structuredClone(visual[key]);for(const [id,style] of Object.entries(visual.panelStyles))if(panelIds().includes(id))Object.assign(panelConfig(id),style);applyTheme();applyLayout(false);if(graph)rebuildGraph();renderSettings();saveState();}
  function miniThemeHTML(visual){
    const mode=visual.theme==='system'?themeName():visual.theme,p=resolvedColors(mode,visual.colors?.[mode],true),photo=visual.backdrops?.workspace?.image||visual.backdrops?.main?.image;
    return `<div class="theme-mini" aria-hidden="true" style="--mini-bg:${p.bg};--mini-surface:${p.surface};--mini-sidebar:${p.sidebar};--mini-player:${p.player};--mini-ink:${p.text};--mini-accent:${p.accent};--mini-secondary:${p.visualizer};--mini-button-ink:${p.accentText};--mini-player-ink:${readableInk(p.player,p.text)}">${photo?`<img class="theme-mini-photo" data-theme-photo="${photo}" alt="">`:''}<div class="mini-top"><i></i><b></b><i></i></div><div class="mini-side"><i></i><i></i><i></i></div><div class="mini-content"><div class="mini-hero"><i></i><b>♪</b></div><i></i><i></i></div><div class="mini-player"><i></i><b>▶</b><i></i></div></div>`;
  }
  function themeCard(theme,saved=false){
    const visual=saved?theme.visual:(theme.visual||{theme:theme.mode,colors:{[theme.mode]:theme.colors}}),mode=visual.theme==='system'?themeName():visual.theme,p=resolvedColors(mode,visual.colors?.[mode],true),id=escapeHTML(theme.id),current=resolvedColors(),selected=mode===themeName()&&['bg','surface','accent','visualizer'].every(key=>p[key]===current[key]);
    const builtinActions=`<div class="theme-card-actions"><button data-action="updateBuiltinTheme" data-id="${id}" title="${escapeHTML(t('saveIntoPreset'))}">${t('saveIntoPreset')}</button><button data-action="editBuiltinTheme" data-id="${id}">${t('edit')}</button>${theme.modified?`<button data-action="resetBuiltinTheme" data-id="${id}">${t('resetPreset')}</button>`:''}</div>`;
    return `<article class="theme-card ${selected?'selected':''}"><button class="theme-card-main" data-action="${saved?'loadTheme':'themePreset'}" data-id="${id}" aria-pressed="${selected}" aria-label="${escapeHTML(t('useTheme')+': '+theme.name)}">${miniThemeHTML(visual)}<span class="theme-card-title"><strong>${escapeHTML(theme.name)}</strong><small>${theme.modified?`<span class="preset-badge">${t('modifiedBadge')}</span> `:''}${t(mode)}</small></span><span class="theme-dots" aria-hidden="true">${[p.bg,p.surface,p.accent,p.visualizer].map(c=>`<i style="background:${c}"></i>`).join('')}</span><span class="theme-apply">${t('useTheme')} →</span></button>${saved?`<div class="theme-card-actions"><button data-action="updateTheme" data-id="${id}">${t('updateTheme')}</button><button data-action="renameTheme" data-id="${id}">${t('rename')}</button><button data-action="exportTheme" data-id="${id}">${t('exportTheme')}</button><button data-action="deleteTheme" data-id="${id}">${t('panelRemove')}</button></div>`:builtinActions}</article>`;
  }
  function backgroundEditorHTML(target=backgroundTarget){
    const b=backdropFor(target),minimum=settings.autoContrast?60:0,range=(key,label,min,max)=>`<label class="background-range"><span>${t(label)} <output data-backdrop-output="${key}">${key==='shade'?Math.max(min,b[key]):b[key]}${key==='shade'?'%':'px'}</output></span><input type="range" data-backdrop="${key}" data-target="${target}" min="${min}" max="${max}" step="1" value="${Math.max(min,b[key])}"></label>`;
    return `<div class="background-editor"><div class="background-preview" ${b.image?`data-background-thumb="${b.image}"`:''}><span>${b.image?'':icon('image')}</span></div><div class="background-controls"><div class="settings-buttons"><button class="button secondary" data-action="choosePhoto" data-target="${target}">${icon('image')}${t('choosePhoto')}</button>${b.image?`<button class="button secondary" data-action="removePhoto" data-target="${target}">${t('removePhoto')}</button>`:''}</div><p class="setting-description">${t('photoHint')}</p>${b.image?range('shade','shade',minimum,95)+range('blur','blur',0,20)+`<div class="photo-selects"><label>${t('fit')}<select data-backdrop="fit" data-target="${target}">${['cover','contain'].map(v=>`<option value="${v}" ${b.fit===v?'selected':''}>${t(v)}</option>`).join('')}</select></label><label>${t('photoPosition')}<select data-backdrop="position" data-target="${target}">${['center','top','bottom','left','right'].map(v=>`<option value="${v}" ${b.position===v?'selected':''}>${t(v)}</option>`).join('')}</select></label></div>`:''}</div></div>`;
  }
  let lastResetBackup=null;
  function rescueResetBarHTML(){
    return `<div class="reset-rescue-bar"><div><strong>${escapeHTML(t('rescueTitle'))}</strong><small>${escapeHTML(t('resetThemeAndPanelsHint'))}</small></div><div class="reset-rescue-actions"><button class="button primary" data-action="resetThemeAndPanels">${icon('refresh')}${escapeHTML(t('resetThemeAndPanels'))}</button><button class="button secondary" data-action="resetThemeOnly">${escapeHTML(t('resetThemeOnly'))}</button><button class="button secondary" data-action="resetPanelsOnly">${escapeHTML(t('resetPanelsOnly'))}</button>${lastResetBackup?`<button class="button secondary" data-action="undoReset">${escapeHTML(t('undoReset'))}</button>`:""}</div></div>`;
  }
  function appearanceHTML(){
    const scheme=themeName(),p=resolvedColors(),presets=getThemePresets();
    return `<h3>${t('appearance')}</h3><p class="settings-intro">${t('themesIntro')}</p>${rescueResetBarHTML()}<div class="theme-choices">${['light','dark','system'].map(mode=>`<button class="theme-choice ${settings.theme===mode?'selected':''}" data-action="setTheme" data-value="${mode}">${icon(mode==='light'?'sun':mode==='dark'?'moon':'layout')}<strong>${t(mode)}</strong></button>`).join('')}</div>`+
      `<div class="studio-section-title"><h4>${t('palettes')} (${presets.length})</h4><div class="segmented">${[['all',t('allThemes')],['dark',t('dark')],['light',t('light')],['neon',t('neonThemes')],['cozy',t('cozyThemes')]].map(([value,label])=>`<button data-action="themeFilter" data-value="${value}" aria-pressed="${themeGalleryFilter===value}">${label}</button>`).join('')}</div></div><div class="settings-buttons"><button class="button secondary" data-action="randomTheme">${icon('dice')}${t('randomTheme')}</button><button class="button secondary" data-action="gigaSettings">${icon('sliders')}${t('gigaCustom')}</button></div><div class="theme-gallery">${presets.filter(p=>themeGalleryFilter==='all'||p.mode===themeGalleryFilter||p.tag===themeGalleryFilter).map(p=>themeCard(p)).join('')}</div>`+
      group('myThemes',`<div class="settings-buttons">${settingButton('saveTheme','saveTheme')}${settingButton('importTheme','importTheme')}</div>${note('themeContents')}<div class="theme-gallery user-themes">${settings.savedThemes.length?settings.savedThemes.map(p=>themeCard(p,true)).join(''):`<p class="studio-empty">${t('themeEmpty')}</p>`}</div>`)+
      group('backgrounds',`<label class="studio-select">${t('backgroundTarget')}<select id="backgroundTarget">${['workspace','main','hero',...panelIds()].map(id=>`<option value="${id}" ${id===backgroundTarget?'selected':''}>${escapeHTML(backdropTargetName(id))}</option>`).join('')}</select></label>${backgroundEditorHTML()}${settingRange('surfaceOpacity','surfaceOpacity',settings.autoContrast?60:35,100,1,'%')}${settingRange('glassBlur','glassBlur',0,24,1,'px')}`)+
      group('',settingToggle('autoContrast','contrastGuard','contrastGuardDesc')+settingToggle('peekOnSlider','peekOnSlider','peekOnSliderDesc'))+
      `<details class="studio-details" open><summary>${t('moreColors')}</summary><div class="colors-grid">${COLOR_KEYS.map(key=>`<label class="color-row"><span>${t(key)}</span><input type="color" data-color="${key}" value="${p[key]}" aria-label="${escapeHTML(t(key))}"></label>`).join('')}</div>${settingRange('radius','roundness',0,44,1,'px')}${settingRange('borderWidth','borderWidth',0,6,0.5,'px')}${settingRange('shadow','shadows',0,24,1,'px')}${settingRange('fontScale','textScale',80,130,5,'%')}${settingSelect('density','density',['compact','comfortable','spacious'].map(key=>[key,t(key)]))}${settingToggle('animations')}${settingToggle('artwork','artwork','artworkDesc')}<div class="settings-buttons">${settingButton('resetColors','resetColors')}</div></details>`;
  }
  function saveThemeForm(id){
    const existing=settings.savedThemes.find(theme=>theme.id===id);if(!existing&&settings.savedThemes.length>=24){toast(t('themeLimit'));return;}
    const visual=visualSnapshot();openForm(t('saveTheme'),miniThemeHTML(visual)+textField('name','themeName',existing?.name||'',true),form=>{const name=String(form.get('name')||'').trim();if(!name)return false;if(existing){existing.name=name.slice(0,70);existing.visual=visual;}else settings.savedThemes.push({id:uid(),name:name.slice(0,70),visual});saveState();renderSettings();toast(t('themeSaved'));});void loadPhotoThumbnails();
  }
  async function getAssetURL(id,thumb=false){
    if(!id)return '';const key=`${id}:${thumb}`;if(assetCache.has(key))return assetCache.get(key);if(assetRequests.has(key))return assetRequests.get(key);
    const promise=(async()=>{const asset=temporaryAssets.get(id)||await dbRead('assets',id);const blob=thumb?asset?.thumb||asset?.blob:asset?.blob;if(!(blob instanceof Blob))return '';const url=URL.createObjectURL(blob);assetCache.set(key,url);return url;})();assetRequests.set(key,promise);try{return await promise;}finally{assetRequests.delete(key);}
  }
  async function loadPhotoThumbnails(){
    for(const node of $$('[data-theme-photo],[data-background-thumb]')){const id=node.dataset.themePhoto||node.dataset.backgroundThumb;try{const url=await getAssetURL(id,true);if(!url||!node.isConnected)continue;if(node.tagName==='IMG')node.src=url;else node.style.backgroundImage=`url("${url}")`;}catch{/* A missing preview never blocks editing. */}}
  }
  function pruneAssetURLs(){const keep=new Set(Object.values(settings.backdrops).map(b=>`${b.image}:false`));for(const node of $$('[data-theme-photo],[data-background-thumb]'))keep.add(`${node.dataset.themePhoto||node.dataset.backgroundThumb}:true`);for(const [key,url] of assetCache)if(!keep.has(key)){URL.revokeObjectURL(url);assetCache.delete(key);}}
  function backdropElement(id){return id==='workspace'?$('#appWallpaper'):id==='main'?$('#main'):id==='hero'?$('#hero'):$(`[data-panel="${id}"]`);}
  async function applyAllBackdrops(){
    const revision=++backdropRevision;
    await Promise.all(['workspace','main','hero',...panelIds()].map(async id=>{
      const host=backdropElement(id);if(!host)return;const b=backdropFor(id);let url='';try{url=await getAssetURL(b.image);}catch{/* Fall back to the surface color. */}if(revision!==backdropRevision||!host.isConnected)return;
      let layer=$(':scope > .photo-layer',host);if(url&&!layer){layer=document.createElement('div');layer.className='photo-layer';layer.setAttribute('aria-hidden','true');host.prepend(layer);}host.classList.toggle('has-photo',!!url);
      if(layer){layer.hidden=!url;layer.style.backgroundImage=url?`url("${url}")`:'';layer.style.backgroundSize=b.fit;layer.style.backgroundPosition=b.position;layer.style.setProperty('--photo-shade',String(Math.max(settings.autoContrast?60:0,b.shade)/100));layer.style.setProperty('--photo-blur',`${b.blur}px`);}
    }));if(revision===backdropRevision){applySurfaceStyles();pruneAssetURLs();}
  }
  function computeShapeCSS(r={}){
    if(r.shape==='sketch')return '26px 12px 24px 10px / 14px 26px 12px 24px';
    if(r.shape==='pill')return '34px';
    if(r.shape==='sharp')return '0px';
    if(r.radius!=null)return `${r.radius}px`;
    if(settings.use4Corners)return `${settings.cornerTL}px ${settings.cornerTR}px ${settings.cornerBR}px ${settings.cornerBL}px`;
    if(settings.shapeProfile==='drawn')return '24px 13px 22px 11px / 13px 24px 11px 22px';
    if(settings.shapeProfile==='pill')return '34px';
    if(settings.shapeProfile==='brutalist')return '0px';
    if(settings.shapeProfile==='cyber')return '18px 4px 18px 4px';
    return `${settings.radius}px`;
  }
  function applySurfaceStyles(){
    const p=resolvedColors();
    for(const [node,bgKey,id] of [[$('#main'),'surface','main'],[$('#hero'),'hero','hero'],...panelIds().map(id=>[$(`[data-panel="${id}"]`),id==='navigation'?'sidebar':id==='player'?'player':'surface',id])]){
      if(!node)continue;const r=settings.panelLayout[id]||{},photo=node.classList.contains('has-photo'),bg=r.color||p[bgKey],preferred=r.ink||p.text;
      const op=r.opacity!=null?r.opacity:settings.surfaceOpacity;
      const guarded=settings.autoContrast&&!photo?guardedSurface(bg,preferred,p.muted,op):{ink:photo&&settings.autoContrast?'#f7f7f2':preferred,muted:photo&&settings.autoContrast?'#eeeeea':p.muted,alpha:op/100},ink=guarded.ink,muted=guarded.muted;
      node.style.setProperty('--text',ink);node.style.setProperty('--muted',muted);node.style.setProperty('--panel-ink',ink);node.style.setProperty('--local-bg',`rgb(${rgbTriplet(bg)} / ${guarded.alpha})`);node.style.setProperty('--panel-color',bg);node.style.setProperty('--local-line',r.line||p.outline);
      const shapeVal=computeShapeCSS(r);
      node.style.setProperty('--local-radius',`${r.radius??settings.radius}px`);
      node.style.setProperty('--local-shape',shapeVal);
      node.style.setProperty('--local-border-width',`${r.borderWidth??settings.borderWidth}px`);
      node.style.setProperty('--local-scale',String((r.scale??100)/100));
      const content=$('.panel-content',node);if(content&&r.padding!=null)content.style.padding=`${r.padding}px`;else if(content)content.style.removeProperty('padding');
      node.dataset.header=String(r.header!==false);node.classList.toggle('has-panel-color',!!r.color);
    }
  }
  async function normalizePhoto(file){
    const isGif=file.type==='image/gif'||/\.gif$/i.test(file.name||'');
    const isSvg=file.type==='image/svg+xml'||/\.svg$/i.test(file.name||'');
    if((!['image/gif','image/jpeg','image/png','image/webp','image/avif','image/svg+xml'].includes(file.type)&&!isGif&&!isSvg)||file.size>25*1024*1024)throw new Error(t('photoInvalid'));
    if(isGif||isSvg||file.type==='image/webp'){
      return {blob:file,thumb:file};
    }
    let bitmap;try{bitmap=await createImageBitmap(file);}catch{const url=URL.createObjectURL(file);try{bitmap=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=url;});}finally{URL.revokeObjectURL(url);}}
    try{const canvas=document.createElement('canvas'),scale=Math.min(1,2048/Math.max(bitmap.width,bitmap.height));canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#111111';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.86));const ratio=Math.min(1,320/canvas.width),thumb=document.createElement('canvas');thumb.width=Math.round(canvas.width*ratio);thumb.height=Math.max(1,Math.round(canvas.height*ratio));thumb.getContext('2d').drawImage(canvas,0,0,thumb.width,thumb.height);const small=await new Promise(resolve=>thumb.toBlob(resolve,'image/jpeg',.75));if(!blob||!small)throw new Error(t('photoInvalid'));return {blob,thumb:small};}finally{bitmap.close?.();}
  }
  async function storePhoto(asset){const id=`asset-${uid().replace(/[^a-z0-9-]/g,'')}`;if(db){try{await dbWrite(['assets'],tx=>tx.objectStore('assets').put(asset,id));return id;}catch{storageWarning('storageFull');}}else storageWarning('storageUnavailable');temporaryAssets.set(id,asset);return id;}
  async function importPhoto(file,target){if(!file)return;try{const asset=await normalizePhoto(file),id=await storePhoto(asset);settings.backdrops[target]={...backdropFor(target),image:id};if(target==='hero'){settings.heroScene='custom-photo';renderHeroScene();}if(target==='workspace'&&settings.surfaceOpacity===100){settings.surfaceOpacity=80;document.documentElement.style.setProperty('--surface-opacity','.8');}await applyAllBackdrops();saveState();if($('#settingsDialog').open)renderSettings();if($('#editDialog').open&&$('#editFields').dataset.panel===target)renderPanelPhotoBlock(target);toast(t('saved'));}catch{toast(t('photoInvalid'),true);}}
  function renderPanelPhotoBlock(id){const root=$('#panelPhotoEditor');if(root){root.innerHTML=backgroundEditorHTML(id);void loadPhotoThumbnails();}}
  function downloadJSON(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  const blobDataURL=blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
  async function exportSavedTheme(id){const theme=settings.savedThemes.find(p=>p.id===id);if(!theme)return;const assets={};for(const image of new Set(Object.values(theme.visual.backdrops).map(v=>v.image).filter(Boolean))){const asset=temporaryAssets.get(image)||await dbRead('assets',image);if(asset?.blob)assets[image]=await blobDataURL(asset.blob);}downloadJSON({format:'ZENITH_THEME',version:1,theme,assets},'ZENITH-theme.json');}
  async function importSavedTheme(file){
    if(!file)return;if(settings.savedThemes.length>=24){toast(t('themeLimit'));return;}
    try{if(file.size>35*1024*1024)throw new Error();const data=JSON.parse(await file.text());if(data.format!=='ZENITH_THEME'||data.version!==1||!data.theme)throw new Error();const themes=cleanSavedThemes([{...data.theme,id:uid()}]),theme=themes[0];if(!theme)throw new Error();
      for(const old of new Set(Object.values(theme.visual.backdrops).map(v=>v.image).filter(Boolean))){const raw=data.assets?.[old];if(typeof raw!=='string'||raw.length>12*1024*1024||!/^data:image\/(jpeg|png|webp|avif);base64,[A-Za-z0-9+/=]+$/.test(raw))throw new Error();const [header,encoded]=raw.split(','),binary=atob(encoded),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0)),blob=new Blob([bytes],{type:header.slice(5,header.indexOf(';'))}),id=await storePhoto(await normalizePhoto(blob));for(const b of Object.values(theme.visual.backdrops))if(b.image===old)b.image=id;}
      settings.savedThemes.push(theme);saveState();renderSettings();toast(t('themeSaved'));
    }catch{toast(t('badSettings'),true);}
  }
  const FONT_STACKS={
    default:'"Trebuchet MS","Segoe UI",Arial,sans-serif',
    sans:'Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
    mono:'"JetBrains Mono","Fira Code",Consolas,monospace',
    serif:'Georgia,"Times New Roman",serif',
    rounded:'"Nunito","Comfortaa","Segoe UI Rounded","Trebuchet MS",sans-serif'
  };
  const MOTION_CURVES={
    spring:'cubic-bezier(.22,1.18,.32,1)',
    smooth:'cubic-bezier(.2,.85,.25,1)',
    snappy:'cubic-bezier(.16,1,.3,1)',
    linear:'linear'
  };
  function applyTheme(){
    const root=document.documentElement,scheme=themeName();root.dataset.theme=scheme;
    const palette=resolvedColors();
    for(const key of COLOR_KEYS)root.style.setProperty(COLOR_CSS(key),palette[key]);
    root.style.setProperty('--control-bg',palette.surface);root.style.setProperty('--control-text',settings.autoContrast?readableInk(palette.surface,palette.text):palette.text);root.style.setProperty('--hero-text',settings.autoContrast?readableInk(palette.hero,palette.text):palette.text);root.style.setProperty('--hover-text',settings.autoContrast?readableInk(palette.hover,palette.text):palette.text);
    root.style.setProperty('--surface-rgb',rgbTriplet(palette.surface));root.style.setProperty('--bg-rgb',rgbTriplet(palette.bg));root.style.setProperty('--surface-opacity',String(settings.surfaceOpacity/100));
    root.style.setProperty('--radius',`${settings.radius}px`);root.style.setProperty('--shadow',`${settings.shadow}px`);root.style.setProperty('--font-scale',String(settings.fontScale/100));
    root.style.setProperty('--workspace-gap',`${settings.workspaceGap}px`);
    root.style.setProperty('--workspace-margin',`${settings.workspaceMargin}px`);
    root.style.setProperty('--topbar-height',`${settings.topbarHeight}px`);
    root.style.setProperty('--border-width',`${settings.borderWidth}px`);
    root.style.setProperty('--border-style',settings.borderStyle||'solid');
    root.style.setProperty('--panel-padding',`${settings.panelPadding}px`);
    root.style.setProperty('--header-height',`${settings.headerHeight}px`);
    root.style.setProperty('--glass-blur',`${settings.glassBlur}px`);
    root.style.setProperty('--grid-step',`${Math.max(8,settings.gridSize*2)}px`);
    root.style.setProperty('--letter-spacing',`${(settings.letterSpacing/10).toFixed(1)}px`);
    root.style.setProperty('--font',FONT_STACKS[settings.fontFamily]||FONT_STACKS.default);
    root.style.setProperty('--motion',`${settings.animations?settings.motionDuration:0}ms`);
    root.style.setProperty('--ease',MOTION_CURVES[settings.motionCurve]||MOTION_CURVES.spring);
    root.style.setProperty('--panel-shape',computeShapeCSS({}));
    document.body.dataset.density=settings.density;
    for(const [name,on] of Object.entries({'no-motion':!settings.animations,'no-artwork':!settings.artwork,'no-shadows':settings.shadow===0,'simple-interface':settings.simple,'active-panel-glow':settings.activePanelGlow}))document.body.classList.toggle(name,on);
    $('#workspace')?.classList.toggle('show-grid-lines',!!settings.showGrid);
    $('#themeIcon')?.setAttribute('href',scheme==='light'?'#i-moon':'#i-sun');
    $('#lockPanelsIcon')?.setAttribute('href',settings.panelsLocked?'#i-lock':'#i-unlock');
    $('#lockPanelsBtn')?.setAttribute('aria-pressed',String(settings.panelsLocked));
    const customCSSNode=$('#userCustomCSS');if(customCSSNode)customCSSNode.textContent=settings.customCSS||'';
    $('meta[name="theme-color"]').content=getComputedStyle(root).getPropertyValue('--bg').trim();
    $('#hero').hidden=view!=='home'||!settings.showHero;$('#collectionSection').hidden=view!=='home';
    applySurfaceStyles();void applyAllBackdrops();drawIdleSpectrum();
    if(graph&&!audio.paused)startSpectrum();
  }
  let layoutHasRun=false;
  function applyLayout(animate=true){
    const oldBoxes=layoutHasRun?Object.fromEntries($$('[data-panel]').map(panel=>[panel.dataset.panel,panel.getBoundingClientRect()])):{};
    syncPanelElements();const space=workspaceSize();const mobile=!!narrowWindow?.matches,lastInZone={};
    const ordered=panelIds().sort((a,b)=>panelConfig(a).order-panelConfig(b).order);
    const hdrH=settings.headerHeight||37;
    for(const id of ordered){
      const panel=$(`[data-panel="${id}"]`),record=panelConfig(id);if(!panel)continue;
      const zone=mobile?(id==='navigation'?'top':id==='player'?'bottom':'float'):record.zone;
      panel.hidden=!record.visible||(id==='now'&&!settings.showNow)||(mobile&&id==='now'&&record.zone!=='float');
      panel.dataset.zone=zone;panel.dataset.collapsed=String(record.collapsed);panel.classList.toggle('is-floating',zone==='float');
      panel.style.removeProperty('transform');panel.style.removeProperty('width');panel.style.removeProperty('height');panel.style.removeProperty('flex');
      if(record.color){panel.style.setProperty('--panel-color',record.color);panel.style.setProperty('--panel-ink',contrastInk(record.color));panel.classList.add('has-panel-color');}else{panel.style.removeProperty('--panel-color');panel.style.removeProperty('--panel-ink');panel.classList.remove('has-panel-color');}
      const parent=zone==='float'?$('#floatingPanels'):$(`#dock-${zone}`),previous=lastInZone[zone],before=previous?previous.nextElementSibling:parent.firstElementChild;
      if(panel.parentElement!==parent||before!==panel)parent.insertBefore(panel,before);lastInZone[zone]=panel;
      if(zone==='float'){
        const rect=fitPanelRect(record,space);panel.style.width=`${rect.w}px`;panel.style.height=`${record.collapsed?hdrH+2:rect.h}px`;panel.style.transform=`translate3d(${rect.x}px,${rect.y}px,0)`;if(!panel.style.zIndex)panel.style.zIndex=String(10+record.order);
      }else{
        const vertical=zone==='left'||zone==='right';panel.style.removeProperty('z-index');panel.style.flex=record.collapsed&&vertical?`0 0 ${hdrH+2}px`:`${vertical?record.h:record.w} 1 0`;
      }
      panel.classList.toggle('compact-player',id==='player'&&zone==='float'&&parseFloat(panel.style.width)<640);
      renderPanelHead(panel,id);
    }
    const sideZones=['left','right'].filter(zone=>[...$(`#dock-${zone}`).children].some(panel=>!panel.hidden));
    const maxSide=Math.max(180,Math.min(580,(space.w-340-24)/Math.max(1,sideZones.length)));
    for(const zone of ['left','right','top','bottom']){
      const dock=$(`#dock-${zone}`),visible=[...dock.children].filter(panel=>!panel.hidden);dock.hidden=!visible.length;
      if(zone==='left'||zone==='right'){const width=Math.max(180,...visible.map(panel=>panelConfig(panel.dataset.panel).w));dock.style.width=`${Math.min(width,maxSide)}px`;}else{
        const sizes=visible.map(panel=>{const id=panel.dataset.panel,r=panelConfig(id);if(r.collapsed)return hdrH+2;if(id==='navigation'&&!panelWidget(id))return clamp(r.h||68,54,320);if(id==='player'&&!panelWidget(id))return clamp(r.h||118,82,360);return clamp(r.h||180,70,420);});
        dock.style.height=visible.length?`${Math.min(Math.max(...sizes),Math.max(96,space.h*.48))}px`:'';
      }
    }
    document.body.classList.toggle('panels-locked',settings.panelsLocked);
    $('#lockPanelsIcon')?.setAttribute('href',settings.panelsLocked?'#i-lock':'#i-unlock');
    const dur=settings.animations?Math.max(120,settings.motionDuration||280):0,easing=MOTION_CURVES[settings.motionCurve]||MOTION_CURVES.spring;
    if(animate&&dur>0&&layoutHasRun&&settings.animations&&!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches){
      $$('[data-panel]').forEach(panel=>{const old=oldBoxes[panel.dataset.panel],now=panel.getBoundingClientRect();if(panel.hidden||!old?.width||!now.width||!now.height)return;const dx=old.x-now.x,dy=old.y-now.y,sx=old.width/now.width,sy=old.height/now.height;const base=panel.style.transform||'translate(0,0)';if(Math.abs(dx)+Math.abs(dy)+Math.abs(1-sx)+Math.abs(1-sy)>.01){panel.getAnimations?.().forEach(a=>a.cancel());panel.animate?.([{transform:`translate(${dx}px,${dy}px) ${base} scale(${sx},${sy})`,transformOrigin:'0 0',opacity:.86},{transform:base,transformOrigin:'0 0',opacity:1}],{duration:dur,easing});}});
    }
    layoutHasRun=true;observeAllPanelSizes();applySurfaceStyles();void applyAllBackdrops();renderHeroScene();resizeSpectrum();startSpectrum();
  }
  function applySettings(){
    applyTheme();applyLayout();audio.volume=settings.volume/100;audio.playbackRate=settings.speed;audio.preservesPitch=true;
    $('#volume').value=settings.volume;rangeFill($('#volume'));$('#sortSelect').value=settings.sort;
    if(graph)rebuildGraph();updatePlaybackUI();renderAll();if($('#settingsDialog').open)renderSettings();saveState();
  }
  function rangeFill(input){const min=Number(input.min)||0,max=Number(input.max)||100;input.style.setProperty('--range',`${(Number(input.value)-min)/(max-min)*100}%`);}

  async function loadCover(id){
    if(!settings.artwork)return null;
    if(coverCache.has(id)){const value=coverCache.get(id);coverCache.delete(id);coverCache.set(id,value);return value;}
    if(coverRequests.has(id))return coverRequests.get(id);
    const task=(async()=>{try{const blob=temporaryCovers.get(id)||await dbRead('covers',id);if(!blob)return null;const url=URL.createObjectURL(blob);coverCache.set(id,url);
      while(coverCache.size>160){const key=coverCache.keys().next().value;if(key===currentId){const value=coverCache.get(key);coverCache.delete(key);coverCache.set(key,value);continue;}URL.revokeObjectURL(coverCache.get(key));coverCache.delete(key);}return url;
    }catch{return null;}finally{coverRequests.delete(id);}})();coverRequests.set(id,task);return task;
  }
  function coverMarkup(track,extra=''){
    return `<span class="cover ${extra}" ${track.cover&&settings.artwork?`data-cover="${escapeHTML(track.id)}"`:''}>${icon(track.demo?'music':'disc')}</span>`;
  }
  function observeCovers(){
    coverObserver?.disconnect();
    const revision=renderRevision;
    const fill=async node=>{const id=node.dataset.cover;const url=await loadCover(id);if(url&&node.isConnected&&revision===renderRevision&&node.dataset.cover===id){const img=document.createElement('img');img.src=url;img.alt='';img.loading='lazy';node.replaceChildren(img);}};
    const nodes=$$('[data-cover]');
    if(typeof IntersectionObserver!=='undefined'){
      coverObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){coverObserver.unobserve(entry.target);void fill(entry.target);}},{rootMargin:'80px'});
      nodes.forEach(node=>coverObserver.observe(node));
    }else nodes.forEach(node=>void fill(node));
  }
  function albumKey(track){return `${track.artist||''}\u0001${track.album||''}`;}
  function albumGroups(){const groups=new Map();for(const track of tracks){const key=albumKey(track);if(!groups.has(key))groups.set(key,{key,title:track.album||t('unknownAlbum'),artist:track.artist||t('unknownArtist'),tracks:[]});groups.get(key).tracks.push(track);}return [...groups.values()];}
  function normalizeSearchText(str){
    return String(str||'').toLocaleLowerCase(settings.language).replace(/ё/g,'е').trim();
  }
  function scoreTrackMatch(track,rawNeedle){
    const needle=normalizeSearchText(rawNeedle);if(!needle)return 1;
    const title=normalizeSearchText(track.title),artist=normalizeSearchText(track.artist),album=normalizeSearchText(track.album),name=normalizeSearchText(track.name);
    const full=`${title} ${artist} ${album} ${name}`;
    if(title===needle)return 120;
    if(title.startsWith(needle))return 105;
    if(artist.startsWith(needle))return 95;
    if(title.split(/[\s\-—_.,()]+/).some(w=>w.startsWith(needle)))return 88;
    if(artist.split(/[\s\-—_.,()]+/).some(w=>w.startsWith(needle)))return 82;
    if(title.includes(needle))return 75;
    if(artist.includes(needle))return 68;
    if(album.includes(needle))return 60;
    const tokens=needle.split(/\s+/).filter(Boolean);
    if(tokens.length>1&&tokens.every(tok=>full.includes(tok)))return 65;
    // Fuzzy subsequence & typo match by letters
    let qi=0,consec=0,bestConsec=0;
    for(let i=0;i<title.length&&qi<needle.length;i++){
      if(title[i]===needle[qi]){qi++;consec++;if(consec>bestConsec)bestConsec=consec;}else consec=0;
    }
    if(qi===needle.length&&needle.length>=2)return 42+Math.min(20,bestConsec*4);
    qi=0;
    for(let i=0;i<full.length&&qi<needle.length;i++)if(full[i]===needle[qi])qi++;
    if(qi===needle.length&&needle.length>=3)return 32;
    return 0;
  }
  function visibleTracks(){
    let result=tracks;
    if(view==='favorites')result=result.filter(track=>track.favorite);
    else if(view==='recent')result=result.filter(track=>track.lastPlayed);
    else if(view==='album')result=result.filter(track=>albumKey(track)===albumFilter);
    else if(view.startsWith('playlist:')){const playlist=playlists.find(p=>`playlist:${p.id}`===view);result=(playlist?.ids||[]).map(id=>trackMap.get(id)).filter(Boolean);}
    const needle=normalizeSearchText(query);
    if(needle){
      const scored=result.map(track=>({track,score:scoreTrackMatch(track,needle)})).filter(item=>item.score>0);
      return scored.sort((a,b)=>b.score-a.score||b.track.added-a.track.added).map(item=>item.track);
    }
    const locale=settings.language;return [...result].sort((a,b)=>view==='recent'?(b.lastPlayed||0)-(a.lastPlayed||0):settings.sort==='added'?b.added-a.added:settings.sort==='duration'?(b.duration||0)-(a.duration||0):String(a[settings.sort]||'').localeCompare(String(b[settings.sort]||''),locale,{numeric:true,sensitivity:'base'}));
  }
  function pageLabel(){if(view.startsWith('playlist:'))return playlists.find(p=>`playlist:${p.id}`===view)?.name||t('playlists');if(view==='album')return tracks.find(track=>albumKey(track)===albumFilter)?.album||t('unknownAlbum');return t(view);}
  function renderNavigation(){
    $$('.nav-item[data-view]').forEach(node=>{const active=node.dataset.view===view;node.classList.toggle('active',active);if(active)node.setAttribute('aria-current','page');else node.removeAttribute('aria-current');});
    $('#libraryCount').textContent=tracks.length;
    $('#playlistNav').innerHTML=playlists.map(p=>`<button class="playlist-item ${view===`playlist:${p.id}`?'active':''}" data-view="playlist:${escapeHTML(p.id)}"><span class="playlist-dot"></span><span>${escapeHTML(p.name)}</span></button>`).join('');
    $('#favoriteCount').textContent=`${tracks.filter(track=>track.favorite).length} ${t('tracks')}`;$('#albumCount').textContent=`${albumGroups().length} ${t('albumCount')}`;
    let shortcuts=$('#userPlaylists');if(!shortcuts){shortcuts=document.createElement('div');shortcuts.id='userPlaylists';shortcuts.className='home-playlists';$('#collectionSection').append(shortcuts);}
    shortcuts.innerHTML=playlists.map(p=>`<button class="pill small" data-view="playlist:${escapeHTML(p.id)}">${icon('music')}<span>${escapeHTML(p.name)}</span><small>${p.ids.filter(id=>trackMap.has(id)).length}</small></button>`).join('')+`<button class="new-playlist" data-action="newPlaylist">${icon('plus')}<span>${t('newPlaylist')}</span></button>`;
  }
  function emptyState(){
    let heading='emptyTitle',description='emptyDescription',symbol='upload',actions=true;
    if(query){heading='nothingFound';description='trySearch';symbol='search';actions=false;}
    else if(view==='favorites'){heading='emptyFavorites';description='favoritesHint';symbol='heart';actions=false;}
    else if(view==='recent'){heading='emptyRecent';description='recentHint';symbol='clock';actions=false;}
    else if(view.startsWith('playlist:')){heading='emptyPlaylist';description='playlistHint';symbol='music';actions=false;}
    return `<div class="empty-state"><div class="empty-symbol">${icon(symbol)}</div><h3>${escapeHTML(t(heading))}</h3><p>${escapeHTML(t(description))}</p>${actions?`<div class="empty-actions"><button data-action="importFiles">${icon('plus')}${escapeHTML(t('chooseFiles'))}</button><button data-action="demo">${icon('play')}${escapeHTML(t('tryDemo'))}</button></div>`:''}</div>`;
  }
  const trackArtist=track=>track.artist||t('unknownArtist');
  const buttonIcon=(action,name,label,id='',extra='')=>`<button class="icon-button ${extra}" data-action="${action}"${id?` data-id="${escapeHTML(id)}"`:''} title="${escapeHTML(t(label))}" aria-label="${escapeHTML(t(label))}">${icon(name)}</button>`;
  function trackActions(track){return `<div class="track-actions">${buttonIcon('favorite','heart','favoriteAction',track.id,track.favorite?'favorite-active':'')}${buttonIcon('trackMenu','more','more',track.id)}</div>`;}
  let selectedTrackIds=new Set(),lastSelectedTrackId='';
  function pruneSelection(){
    for(const id of [...selectedTrackIds])if(!trackMap.has(id))selectedTrackIds.delete(id);
  }
  function renderBatchBar(list){
    pruneSelection();
    const bar=$('#batchActionBar');if(!bar)return;
    const count=selectedTrackIds.size;
    const allSelected=list.length>0&&list.every(tr=>selectedTrackIds.has(tr.id));
    const selBtn=$('#selectAllBtn');
    if(selBtn){
      selBtn.classList.toggle('primary',count>0);
      $('span',selBtn).textContent=count>0?`${t('selectedCount',{n:count})}`:t('selectTracks');
    }
    if(!count){bar.hidden=true;bar.innerHTML='';return;}
    bar.hidden=false;
    bar.innerHTML=`<div class="batch-info"><button type="button" class="z-check ${allSelected?'checked':''}" data-action="toggleSelectAll" title="${escapeHTML(t('selectAll'))}">${icon('check')}</button><span>${escapeHTML(t('selectedCount',{n:count}))}</span></div><div class="batch-buttons"><button class="pill small" data-action="batchPlay">${icon('play')}<span>${escapeHTML(t('play'))}</span></button><button class="pill small" data-action="batchQueue">${icon('next')}<span>${escapeHTML(t('addQueue'))}</span></button><button class="pill small" data-action="batchAddPlaylist">${icon('plus')}<span>${escapeHTML(t('addPlaylist'))}</span></button><button class="pill small" data-action="batchFavorite">${icon('heart')}<span>${escapeHTML(t('favorites'))}</span></button><button class="pill small danger-button" data-action="batchDelete">${icon('trash')}<span>${escapeHTML(t(view.startsWith('playlist:')?'removeFromPlaylist':'remove'))}</span></button><button class="pill small" data-action="clearSelection">${icon('close')}<span>${escapeHTML(t('clearSelection'))}</span></button></div>`;
  }
  function renderLibrary(){
    renderRevision++;
    const list=visibleTracks();$('#pageTitle').textContent=pageLabel();$('#pageTitle').removeAttribute('data-i18n');$('#listTitle').textContent=view==='home'||view==='library'?t('collection'):pageLabel();$('#listTitle').removeAttribute('data-i18n');
    $('#hero').hidden=view!=='home'||!settings.showHero;$('#collectionSection').hidden=view!=='home';$('#playlistMore').hidden=!view.startsWith('playlist:');$('#viewToggle use').setAttribute('href',settings.viewMode==='list'?'#i-grid':'#i-list');
    $('#resultCount').textContent=list.length;$('#pagination').hidden=true;
    renderBatchBar(list);
    if(view==='albums'){
      const needle=normalizeSearchText(query);const groups=albumGroups().filter(group=>!needle||normalizeSearchText(`${group.title} ${group.artist}`).includes(needle));$('#resultCount').textContent=groups.length;
      const {slice}=paginate(groups);
      $('#trackContent').innerHTML=groups.length?`<div class="track-card-grid">${slice.map(group=>`<button class="track-card album-card" data-action="openAlbum" data-id="${escapeHTML(group.tracks[0].id)}">${coverMarkup(group.tracks.find(track=>track.cover)||group.tracks[0])}<span class="track-text"><strong>${escapeHTML(group.title)}</strong><small>${escapeHTML(group.artist)}</small><small>${group.tracks.length} ${t('tracks')}</small></span></button>`).join('')}</div>`:emptyState();
    }else if(!list.length)$('#trackContent').innerHTML=emptyState();
    else {
      const {slice,start}=paginate(list);
      const allVisSelected=slice.length>0&&slice.every(tr=>selectedTrackIds.has(tr.id));
      if(settings.viewMode==='grid')$('#trackContent').innerHTML=`<div class="track-card-grid">${slice.map(track=>{const sel=selectedTrackIds.has(track.id);return `<article class="track-card ${currentId===track.id?'current':''} ${sel?'selected':''}" data-track="${escapeHTML(track.id)}"><button type="button" class="z-check track-card-check ${sel?'checked':''}" data-action="selectTrack" data-id="${escapeHTML(track.id)}" aria-label="${escapeHTML(t('selectTracks'))}">${icon('check')}</button><button class="cover-play" data-action="playTrack" data-id="${escapeHTML(track.id)}" aria-label="${escapeHTML(t('play')+' '+track.title)}">${coverMarkup(track)}</button><div class="track-text"><strong>${escapeHTML(track.title)}</strong><small>${escapeHTML(trackArtist(track))}</small></div><div class="track-card-bottom"><span class="track-duration">${track.duration?formatTime(track.duration):'—'}</span>${trackActions(track)}</div></article>`;}).join('')}</div>`;
      else $('#trackContent').innerHTML=`<table class="track-table"><thead><tr><th><button type="button" class="z-check ${allVisSelected?'checked':''}" data-action="toggleSelectAll" title="${escapeHTML(t('selectAll'))}" aria-label="${escapeHTML(t('selectAll'))}">${icon('check')}</button></th><th>${t('title')}</th><th>${t('album')}</th><th>${icon('clock')}</th><th><span class="sr-only">${t('more')}</span></th></tr></thead><tbody>${slice.map((track,i)=>{const sel=selectedTrackIds.has(track.id);return `<tr data-track="${escapeHTML(track.id)}" class="${track.id===currentId?'current':''} ${sel?'selected':''}"><td class="track-index"><div class="track-index-cell"><button type="button" class="z-check ${sel?'checked':''}" data-action="selectTrack" data-id="${escapeHTML(track.id)}" aria-label="${escapeHTML(t('selectTracks'))}">${icon('check')}</button><button data-action="playTrack" data-id="${escapeHTML(track.id)}" aria-label="${escapeHTML(t('play')+' '+track.title)}"><span>${String(start+i+1).padStart(2,'0')}</span>${icon(track.id===currentId&&!audio.paused?'pause':'play')}</button></div></td><td><div class="track-main">${coverMarkup(track)}<div class="track-text"><button class="track-name-button" data-action="playTrack" data-id="${escapeHTML(track.id)}"><strong>${escapeHTML(track.title)}</strong></button><small>${escapeHTML(trackArtist(track))}${track.temporary?' · ◌':''}</small></div></div></td><td class="track-album" title="${escapeHTML(track.album||t('unknownAlbum'))}">${escapeHTML(track.album||t('unknownAlbum'))}</td><td class="track-duration" data-duration="${escapeHTML(track.id)}">${track.duration?formatTime(track.duration):'—'}</td><td>${trackActions(track)}</td></tr>`;}).join('')}</tbody></table>`;
    }
    observeCovers();
    if(typeof syncCustomSelects==='function')syncCustomSelects($('#main'));
  }
  function paginate(list){
    const total=Math.max(1,Math.ceil(list.length/settings.pageSize));page=clamp(page,1,total);const start=(page-1)*settings.pageSize;
    $('#pagination').hidden=total<=1;$('#pagination').innerHTML=`<button class="icon-button" data-action="prevPage" ${page<=1?'disabled':''} aria-label="${escapeHTML(t('previous'))}">${icon('prev')}</button><span>${page} / ${total}</span><button class="icon-button" data-action="nextPage" ${page>=total?'disabled':''} aria-label="${escapeHTML(t('next'))}">${icon('next')}</button>`;
    return {slice:list.slice(start,start+settings.pageSize),start};
  }
  function selectView(nextView){view=nextView;page=1;query='';$('#search').value='';renderNavigation();renderLibrary();$('#main').scrollTop=0;}
  function upcomingIds(){
    const manual=manualQueue.filter(id=>trackMap.has(id));let upcoming=[];
    if(shuffle)upcoming=shuffleBag.filter(id=>trackMap.has(id)&&id!==currentId);
    else {const index=queue.indexOf(currentId);upcoming=queue.slice(index+1).filter(id=>trackMap.has(id));if(repeat==='all'&&index>=0)upcoming.push(...queue.slice(0,index+1).filter(id=>trackMap.has(id)));}
    return [...manual,...upcoming.filter(id=>!manual.includes(id))];
  }
  function renderQueue(){
    const ids=upcomingIds();$('#queueCount').textContent=ids.length;
    $('#queueList').innerHTML=ids.length?ids.slice(0,5).map((id,index)=>{const track=trackMap.get(id);return `<div class="queue-item">${coverMarkup(track)}<div class="track-text"><button class="track-name-button" data-action="queuePlay" data-id="${escapeHTML(id)}"><strong>${escapeHTML(track.title)}</strong></button><small>${escapeHTML(trackArtist(track))}</small></div>${index>0?buttonIcon('queueUp','prev','queueUp',id):''}${buttonIcon('queueRemove','close','queueRemove',id)}</div>`;}).join(''):`<p class="queue-empty">${escapeHTML(t('emptyQueue'))}</p>`;
    refreshWidgets('queue');
  }
  async function renderCurrentArtwork(){
    const token=++currentCoverToken,track=currentTrack();$('#playerCover').innerHTML=icon('disc');$('#nowArtwork').innerHTML='<span>♪</span>';
    if(!track?.cover||!settings.artwork)return;const url=await loadCover(track.id);if(!url||token!==currentCoverToken)return;
    for(const id of ['playerCover','nowArtwork']){const image=document.createElement('img');image.src=url;image.alt='';$(`#${id}`).replaceChildren(image);}
  }
  function renderCurrent(){
    const track=currentTrack();$('#playerTitle').textContent=track?.title||t('noTrack');$('#playerArtist').textContent=track?trackArtist(track):t('addYourTracks');$('#nowTitle').textContent=track?.title||t('waitingMusic');$('#nowArtist').textContent=track?trackArtist(track):t('chooseTrack');
    for(const id of ['playerTitle','playerArtist','nowTitle','nowArtist'])$(`#${id}`).removeAttribute('data-i18n');
    $('#formatBadge').textContent=track?`${track.format} · ${track.sampleRate?`${(track.sampleRate/1000).toFixed(1)} kHz`:bytes(track.size)}`:'LOCAL AUDIO';
    for(const id of ['nowFavorite','playerFavorite']){const node=$(`#${id}`);node.classList.toggle('favorite-active',!!track?.favorite);node.setAttribute('aria-pressed',String(!!track?.favorite));node.disabled=!track;}
    document.title=track?`${track.title} — ZENITH`:'ZENITH — Drawn to music';void renderCurrentArtwork();refreshWidgets('spectrum');refreshWidgets('artworkPanel');refreshWidgets('miniPlayer');
  }
  function renderAll(){localize();renderNavigation();renderQueue();renderLibrary();renderCurrent();refreshWidgets();$$('[data-panel]').forEach(panel=>renderPanelHead(panel,panel.dataset.panel));syncEQControls();updatePlaybackUI();if(!$('#storageWarning').hidden)$('#storageWarning').textContent=t($('#storageWarning').dataset.message);}

  // One HTMLAudioElement, one lazily constructed Web Audio graph.
  function ensureAudioGraph(){
    if(graph||graphFailed)return;
    const Context=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Context){graphFailed=true;return;}
    let context,source;
    try{
      context=new Context({latencyHint:'playback'});source=context.createMediaElementSource(audio);
      const preamp=context.createGain(),mono=context.createGain(),panner=context.createStereoPanner(),limiter=context.createDynamicsCompressor(),analyser=context.createAnalyser();
      const filters=[60,120,250,500,1000,2000,4000,8000].map(frequency=>{const filter=context.createBiquadFilter();filter.type='peaking';filter.frequency.value=frequency;filter.Q.value=1;return filter;});
      limiter.threshold.value=-1;limiter.knee.value=0;limiter.ratio.value=20;limiter.attack.value=.003;limiter.release.value=.1;analyser.smoothingTimeConstant=.8;
      graph={context,source,preamp,mono,panner,limiter,filters,analyser,nodes:[source,preamp,mono,panner,limiter,...filters,analyser],data:null};rebuildGraph();
    }catch(error){
      // If source creation succeeded, reconnect it directly: an attached media
      // element no longer outputs sound independently of its AudioContext.
      try{source?.connect(context.destination);}catch{/* Nothing attached. */}
      if(source)graph={context,source,nodes:[source],minimal:true};else void context?.close().catch(()=>{});
      graphFailed=true;console.warn('Web Audio effects unavailable:',error);
    }
  }
  function rebuildGraph(){
    if(!graph||graph.minimal)return;
    const {context,source,preamp,mono,panner,limiter,filters,analyser}=graph;
    graph.nodes.forEach(node=>{try{node.disconnect();}catch{/* Already disconnected. */}});
    let tail=source;
    if(settings.audioMode==='effects'){
      preamp.gain.setTargetAtTime(10**(settings.preamp/20),context.currentTime,.025);tail.connect(preamp);tail=preamp;
      filters.forEach((filter,i)=>{filter.gain.setTargetAtTime(settings.eq[i],context.currentTime,.025);tail.connect(filter);tail=filter;});
      mono.channelCount=settings.mono?1:2;mono.channelCountMode='explicit';mono.channelInterpretation='speakers';tail.connect(mono);tail=mono;
      panner.pan.setTargetAtTime(settings.balance/100,context.currentTime,.025);tail.connect(panner);tail=panner;
      if(settings.limiter){tail.connect(limiter);tail=limiter;}
    }
    tail.connect(context.destination);
    if(settings.spectrum&&settings.audioMode!=='economy')tail.connect(analyser);
    analyser.fftSize=settings.preset==='economy'?512:2048;analyser.minDecibels=-86;analyser.maxDecibels=-14;graph.data=new Uint8Array(analyser.frequencyBinCount);
    startSpectrum();
  }
  async function playTrack(id,autoplay=true,sourceIds=null){
    const track=trackMap.get(id);if(!track)return;
    if(id===currentId&&audio.src&&autoplay&&!sourceIds){await togglePlay();return;}
    if(autoplay){ensureAudioGraph();if(graph?.context.state==='suspended')void graph.context.resume().catch(()=>{});}
    const token=++playToken;audio.pause();audio.removeAttribute('src');audio.load();if(currentURL){URL.revokeObjectURL(currentURL);currentURL='';}document.body.classList.add('is-buffering');
    if(currentId&&currentId!==id)playHistory.push(currentId);if(playHistory.length>250)playHistory.shift();
    currentId=id;if(sourceIds){queue=[...sourceIds];resetShuffleBag();}else if(!queue.includes(id)){queue=visibleTracks().map(item=>item.id);if(!queue.includes(id))queue=tracks.map(item=>item.id);resetShuffleBag();}
    shuffleBag=shuffleBag.filter(item=>item!==id);renderCurrent();renderQueue();renderLibrary();updatePlaybackUI();saveState();
    try{
      const file=await getAudioFile(id);if(token!==playToken)return;if(!file)throw new Error('missing');
      const oldURL=currentURL;currentURL=URL.createObjectURL(file);audio.src=currentURL;audio.load();if(oldURL)URL.revokeObjectURL(oldURL);
      if(autoplay){await audio.play();if(token!==playToken)return;}
    }catch(error){if(token!==playToken)return;audio.pause();document.body.classList.remove('is-buffering');if(error.name!=='AbortError')toast(t(error.message==='missing'?'fileMissing':'playbackError'),true);}
    finally{if(token===playToken){document.body.classList.remove('is-buffering');updatePlaybackUI();}}
  }
  async function togglePlay(){
    if(!currentId||!audio.src){const first=visibleTracks()[0]||tracks[0];if(!first){toast(t('noPlayable'));$('#fileInput').click();return;}await playTrack(first.id,true,visibleTracks().map(track=>track.id));return;}
    if(!audio.paused){audio.pause();return;}
    ensureAudioGraph();if(graph?.context.state==='suspended')await graph.context.resume();
    try{await audio.play();}catch(error){if(error.name!=='AbortError')toast(t('playbackError'),true);}
  }
  function randomize(items){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
  function resetShuffleBag(){shuffleBag=randomize(queue.filter(id=>id!==currentId&&trackMap.has(id)));}
  async function nextTrack(automatic=false){
    if(!currentId){await togglePlay();return;}
    if(automatic&&repeat==='one'){audio.currentTime=0;await togglePlay();return;}
    let id;while(manualQueue.length&&!id){const candidate=manualQueue.shift();if(trackMap.has(candidate))id=candidate;}
    if(!id&&shuffle){if(!shuffleBag.length&&repeat==='all')resetShuffleBag();id=shuffleBag.shift();if(!id&&repeat==='all'&&queue.length===1)id=queue[0];}
    else if(!id){const index=queue.indexOf(currentId);id=queue.slice(index+1).find(candidate=>trackMap.has(candidate));if(!id&&repeat==='all')id=queue.find(candidate=>trackMap.has(candidate));}
    if(id){if(id===currentId){audio.currentTime=0;if(audio.paused)await togglePlay();}else await playTrack(id,true);}else{audio.pause();toast(t('queueEnd'));renderQueue();}
  }
  async function previousTrack(){
    if(audio.currentTime>3){audio.currentTime=0;return;}
    let id=playHistory.pop();if(!id){const index=queue.indexOf(currentId);id=index>0?queue[index-1]:queue[0];}
    if(id&&id!==currentId){const history=[...playHistory];await playTrack(id,true);playHistory=history;}else audio.currentTime=0;
  }
  function updatePlaybackUI(){
    const playing=!!currentId&&!audio.paused;document.body.classList.toggle('is-playing',playing);
    $('#playButton use').setAttribute('href',playing?'#i-pause':'#i-play');$('#playButton').title=t(playing?'pause':'play');$('#playButton').setAttribute('aria-label',$('#playButton').title);$('#playButton').dataset.i18nTitle=playing?'pause':'play';
    $('#shuffleButton').setAttribute('aria-pressed',String(shuffle));$('#repeatButton').setAttribute('aria-pressed',String(repeat!=='off'));$('#repeatButton b').hidden=repeat!=='one';$('#repeatButton').title=t(repeat==='one'?'repeatOne':repeat==='all'?'repeatAll':'repeatOff');
    $('#muteButton use').setAttribute('href',audio.muted||settings.volume===0?'#i-mute':'#i-volume');$('#volume').value=settings.volume;rangeFill($('#volume'));
    $$('[data-track]').forEach(row=>{row.classList.toggle('current',row.dataset.track===currentId);$('.track-index use',row)?.setAttribute('href',row.dataset.track===currentId&&playing?'#i-pause':'#i-play');});
    refreshWidgets('miniPlayer');updateTime();startSpectrum();
  }
  function updateTime(){const duration=Number.isFinite(audio.duration)?audio.duration:(currentTrack()?.duration||0);$('#currentTime').textContent=formatTime(audio.currentTime);$('#duration').textContent=formatTime(duration);const seek=$('#seek');seek.disabled=!duration||!currentId;if(document.activeElement!==seek)seek.value=duration?clamp(audio.currentTime/duration*1000,0,1000):0;rangeFill(seek);}

  // All live canvases use one analyser, one time-domain buffer and one RAF loop.
  function spectrumCanvases(){return $$('#spectrum,.widget-spectrum,#studioSpectrum');}
  function visibleSpectrumCanvases(){return spectrumCanvases().filter(canvas=>{const panel=canvas.closest('[data-panel]');return !canvas.closest('[hidden]')&&panel?.dataset.collapsed!=='true'&&canvas.clientWidth>0&&canvas.clientHeight>0;});}
  function resizeSpectrum(){const scale=settings.preset==='full'?Math.min(globalThis.devicePixelRatio||1,2):1;for(const canvas of spectrumCanvases()){const w=Math.max(1,Math.round(canvas.clientWidth*scale)),h=Math.max(1,Math.round(canvas.clientHeight*scale));if(!canvas.clientWidth||!canvas.clientHeight)continue;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}}if(!visualFrame)drawIdleSpectrum();}
  function spectrumAllowed(){return settings.spectrum&&settings.audioMode!=='economy'&&!document.hidden&&visibleSpectrumCanvases().length>0;}
  function spectrumOptions(){return {gain:settings.spectrumGain/100,stroke:settings.spectrumStroke,glow:settings.preset==='economy'?0:settings.spectrumGlow,gradient:settings.spectrumGradient,mirror:settings.spectrumMirror,motion:settings.animations&&!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches};}
  function spectrumColors(){const p=resolvedColors();return [settings.spectrumColor||p.visualizer,settings.spectrumColor2||p.accent];}
  const smoothSpectrumState=new WeakMap();
  function getCanvasSmoothState(canvas,count){
    let st=smoothSpectrumState.get(canvas);
    if(!st||st.levels.length!==count){
      st={levels:new Float32Array(count),peaks:new Float32Array(count),wave:new Float32Array(128)};
      smoothSpectrumState.set(canvas,st);
    }
    return st;
  }
  function drawSpectrum(ctx,w,h,levels,wave,mode,opt,colors,time=0,peaks=null){
    if(!w||!h)return;ctx.clearRect(0,0,w,h);ctx.save();const count=levels.length,pad=Math.min(Math.max(3,opt.stroke),Math.max(1,h*.12)),height=Math.max(1,h-pad*2),mid=h/2,step=w/count;
    const idxMap=i=>opt.mirror?Math.min(count-1,Math.floor(Math.abs(i-count/2)*2)):i;
    const value=i=>Math.min(1,Math.max(0,(levels[idxMap(i)]||0)*opt.gain));
    const peakVal=i=>peaks?Math.min(1,Math.max(0,(peaks[idxMap(i)]||0)*opt.gain)):value(i);
    let paint=colors[0];if(opt.gradient){const gradient=ctx.createLinearGradient(0,h,w,0);gradient.addColorStop(0,colors[0]);gradient.addColorStop(0.55,colors[1]);gradient.addColorStop(1,colors[0]);paint=gradient;}
    ctx.strokeStyle=paint;ctx.fillStyle=paint;ctx.lineWidth=opt.stroke;ctx.lineCap='round';ctx.lineJoin='round';
    const avgEnergy=levels.reduce((s,v)=>s+v,0)/Math.max(1,count);
    ctx.shadowColor=colors[0];ctx.shadowBlur=opt.glow?opt.glow*(0.8+avgEnergy*0.9):0;
    if(mode==='bars'||mode==='dots'||mode==='mirror'){
      for(let i=0;i<count;i++){const v=value(i),bar=Math.max(2.5,v*height),x=i*step+step/2,width=Math.max(1.5,step*.64);
        if(mode==='dots'){const radius=Math.max(.8,Math.min(width*.36,5,height/4));for(let y=h-pad-radius;y>=h-pad-Math.max(bar,radius*2);y-=radius*2+2.5){ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();}}
        else{
          ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,mode==='mirror'?mid-bar/2:h-pad);ctx.lineTo(x,mode==='mirror'?mid+bar/2:h-pad-bar);ctx.stroke();
          if(mode==='bars'&&peaks){const pv=peakVal(i)*height;if(pv>bar+3){ctx.globalAlpha=0.75;ctx.beginPath();ctx.arc(x,Math.max(pad,h-pad-pv-2),Math.max(1,width*0.42),0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}}
        }
      }
    }else if(mode==='wave'||mode==='ribbon'){
      const points=wave.length||64,amplitude=height*.45;ctx.beginPath();
      for(let i=0;i<points;i++){
        const x=i/(points-1)*w,y=mid+Math.max(-1,Math.min(1,(wave[i]||0)*opt.gain))*amplitude;
        if(!i)ctx.moveTo(x,y);
        else{const px=(i-1)/(points-1)*w,py=mid+Math.max(-1,Math.min(1,(wave[i-1]||0)*opt.gain))*amplitude;ctx.quadraticCurveTo(px,py,(px+x)/2,(py+y)/2);}
      }
      if(mode==='ribbon'){
        for(let i=points-1;i>=0;i--){const x=i/(points-1)*w,y=mid-Math.max(-1,Math.min(1,(wave[i]||0)*opt.gain))*amplitude;ctx.lineTo(x,y);}
        ctx.closePath();ctx.globalAlpha=.36;ctx.fill();ctx.globalAlpha=1;
      }
      ctx.stroke();
    }else if(mode==='ring'||mode==='orbit'){
      const radius=Math.max(4,Math.min(w,h)*(0.23+avgEnergy*0.04)),reach=Math.min(w,h)*.23,cx=w/2,cy=mid,rotation=opt.motion?time/9000:0;
      if(mode==='ring'){ctx.lineWidth=Math.max(1.2,Math.min(opt.stroke,3));ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.stroke();for(let i=0;i<count;i++){const a=i/count*Math.PI*2-Math.PI/2+rotation*0.4,r=radius+3+value(i)*reach;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*(radius+2),cy+Math.sin(a)*(radius+2));ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.stroke();}}
      else{ctx.beginPath();for(let i=0;i<=count;i++){const index=i%count,a=i/count*Math.PI*2+rotation,r=radius+value(index)*reach,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;if(!i)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();ctx.globalAlpha=.22;ctx.fill();ctx.globalAlpha=1;ctx.stroke();for(let i=0;i<6;i++){const a=i/6*Math.PI*2-rotation*1.3,r=radius+reach*.75;ctx.beginPath();ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,2+value(Math.floor(i/6*count))*3.5,0,Math.PI*2);ctx.fill();}}
    }else if(mode==='mountains'){
      ctx.beginPath();ctx.moveTo(0,h-pad);
      for(let i=0;i<count;i++){
        const x=i/(count-1)*w,y=h-pad-Math.max(2,value(i)*height*.92);
        if(!i)ctx.lineTo(x,y);
        else{const px=(i-1)/(count-1)*w,py=h-pad-Math.max(2,value(i-1)*height*.92);ctx.quadraticCurveTo(px,py,(px+x)/2,(py+y)/2);}
      }
      ctx.lineTo(w,h-pad);ctx.closePath();ctx.globalAlpha=.32;ctx.fill();ctx.globalAlpha=1;ctx.stroke();
    }
    ctx.restore();
  }
  function sampleSpectrum(){return {levels:Float32Array.from({length:48},(_,i)=>.14+.58*Math.abs(Math.sin(i*.23)*Math.cos(i*.07))),wave:Float32Array.from({length:128},(_,i)=>Math.sin(i*.19)*(.24+.42*Math.sin(i*.045)**2))};}
  function drawSpectrumPreviews(){const sample=sampleSpectrum(),colors=spectrumColors(),opt={...spectrumOptions(),glow:0,motion:false};$$('[data-spectrum-preview]').forEach(canvas=>{const ctx=canvas.getContext('2d');if(ctx)drawSpectrum(ctx,canvas.width,canvas.height,sample.levels,sample.wave,canvas.dataset.spectrumPreview,opt,colors);});}
  function canvasSpectrumStyle(canvas){const id=canvas.closest('[data-panel]')?.dataset.panel,style=id&&panelConfig(id).spectrumStyle;return SPECTRUM_STYLES.includes(style)?style:settings.spectrumStyle;}
  function drawIdleSpectrum(){const colors=spectrumColors(),opt=spectrumOptions(),sample=sampleSpectrum();for(const canvas of visibleSpectrumCanvases()){const ctx=canvas.getContext('2d');if(!ctx)continue;const preview=canvas.id==='studioSpectrum';drawSpectrum(ctx,canvas.width,canvas.height,preview?sample.levels:new Float32Array(settings.spectrumCount),preview?sample.wave:new Float32Array(128),canvasSpectrumStyle(canvas),opt,colors);}const label=$('#spectrumPreviewLabel');if(label)label.textContent=t('spectrumSample');}
  let currentBeatEnergy=0;
  function startSpectrum(){
    cancelAnimationFrame(visualFrame);visualFrame=0;const enabled=settings.spectrum&&settings.audioMode!=='economy';$('#spectrum').hidden=!enabled;$('#spectrumOff').hidden=enabled;
    $$('[data-widget="spectrum"] .status-dot').forEach(node=>node.style.opacity=enabled&&!audio.paused?'1':'.3');
    if(!spectrumAllowed()||audio.paused||!graph?.analyser){currentBeatEnergy=0;drawIdleSpectrum();return;}
    resizeSpectrum();const targets=visibleSpectrumCanvases().map(canvas=>({canvas,ctx:canvas.getContext('2d')})).filter(p=>p.ctx);if(!targets.length)return;
    const count=Math.round(settings.spectrumCount),rawLevels=new Float32Array(count),rawWave=new Float32Array(128),timeData=new Uint8Array(graph.analyser.fftSize),colors=spectrumColors(),opt=spectrumOptions();
    graph.analyser.smoothingTimeConstant=clamp(settings.spectrumSmooth/100*0.78,0.15,0.82);
    const previewLabel=$('#spectrumPreviewLabel');if(previewLabel)previewLabel.textContent=t('spectrumLive');
    const usableBins=Math.max(32,Math.floor(graph.data.length*0.72));
    const attack=0.54,release=clamp(0.08+(1-settings.spectrumSmooth/100)*0.26,0.06,0.34);
    const tick=now=>{if(audio.paused||!settings.spectrum||settings.audioMode==='economy'||document.hidden||!graph?.analyser){visualFrame=0;currentBeatEnergy=0;drawIdleSpectrum();return;}
      visualFrame=requestAnimationFrame(tick);if(now-visualLast<1000/settings.fps)return;visualLast=now;graph.analyser.getByteFrequencyData(graph.data);graph.analyser.getByteTimeDomainData(timeData);
      let bassSum=0;
      for(let i=0;i<count;i++){
        const r0=i/count,r1=(i+1)/count;
        const start=Math.floor(Math.pow(usableBins,r0))-1,end=Math.max(start+1,Math.floor(Math.pow(usableBins,r1))-1);
        let sum=0,peakBin=0;
        for(let j=Math.max(0,start);j<Math.min(end,usableBins);j++){const v=graph.data[j];sum+=v;if(v>peakBin)peakBin=v;}
        const avg=(sum/Math.max(1,end-start)*0.65+peakBin*0.35)/255;
        const tilt=1+r0*0.88;
        rawLevels[i]=Math.min(1,Math.pow(avg,0.82)*tilt);
        if(i<Math.max(4,count*0.18))bassSum+=rawLevels[i];
      }
      currentBeatEnergy=bassSum/Math.max(1,Math.floor(count*0.18));
      for(let i=0;i<rawWave.length;i++)rawWave[i]=(timeData[Math.floor(i/rawWave.length*timeData.length)]-128)/128;
      for(const {canvas,ctx} of targets){
        const st=getCanvasSmoothState(canvas,count);
        for(let i=0;i<count;i++){
          const target=rawLevels[i],cur=st.levels[i];
          st.levels[i]=target>cur?cur+(target-cur)*attack:cur+(target-cur)*release;
          if(st.levels[i]>=st.peaks[i])st.peaks[i]=st.levels[i];
          else st.peaks[i]=Math.max(0,st.peaks[i]-0.008);
        }
        for(let i=0;i<rawWave.length;i++)st.wave[i]+=((rawWave[i]||0)-st.wave[i])*0.48;
        drawSpectrum(ctx,canvas.width,canvas.height,st.levels,st.wave,canvasSpectrumStyle(canvas),opt,colors,now,st.peaks);
      }
    };visualFrame=requestAnimationFrame(tick);
  }
  function spectrumSettingsHTML(){return `<h3>${t('spectrum')}</h3><p class="settings-intro">${t('spectrumIntro')}</p><div class="spectrum-stage"><canvas id="studioSpectrum" width="800" height="240" aria-hidden="true"></canvas><span id="spectrumPreviewLabel">${t('spectrumSample')}</span></div><div class="spectrum-gallery">${SPECTRUM_STYLES.map(style=>`<button class="spectrum-style ${settings.spectrumStyle===style?'selected':''}" data-action="spectrumStyle" data-value="${style}" aria-pressed="${settings.spectrumStyle===style}"><canvas data-spectrum-preview="${style}" width="200" height="100" aria-hidden="true"></canvas><strong>${t(style)}</strong>${settings.spectrumStyle===style?icon('check'):''}</button>`).join('')}</div>`+group('',settingToggle('spectrum')+settingRange('spectrumGain','spectrumGain',25,250,5,'%')+settingRange('spectrumSmooth','spectrumSmooth',0,95,5,'%')+settingRange('spectrumCount','spectrumCount',16,96,8)+settingRange('spectrumStroke','spectrumStroke',1,8,1,'px')+settingRange('spectrumGlow','spectrumGlow',0,20,1)+settingToggle('spectrumGradient')+settingToggle('spectrumMirror'))+`<div class="colors-grid">${[['spectrumColor','spectrumColor'],['spectrumColor2','spectrumColor2']].map(([key,label],i)=>`<label class="color-row"><span>${t(label)}</span><input type="color" data-spectrum-color="${key}" value="${spectrumColors()[i]}" aria-label="${t(label)}"></label>`).join('')}</div><div class="settings-buttons">${settingButton('spectrumThemeColors','spectrumColorsTheme')}${settingButton('addSpectrum','addSpectrum')}${settingButton('spectrumReset','spectrumReset')}</div>${note('spectrumTip')}`;}

  const TABS=[['general','settings'],['appearance','sun'],['layout','layout'],['giga','sliders'],['spectrum','music'],['audio','headphones'],['performance','zap'],['storage','folder'],['shortcuts','list'],['about','info']];
  const settingLabel=(key,description)=>`<div><span class="setting-label">${escapeHTML(t(key))}</span>${description?`<span class="setting-description">${escapeHTML(t(description))}</span>`:''}</div>`;
  const settingToggle=(key,label=key,description='')=>`<div class="setting-row">${settingLabel(label,description)}<label class="switch"><input type="checkbox" data-setting="${key}" ${settings[key]?'checked':''} aria-label="${escapeHTML(t(label))}"><span></span></label></div>`;
  const settingSelect=(key,label,choices,description='')=>`<div class="setting-row">${settingLabel(label,description)}<div class="setting-control"><select data-setting="${key}" aria-label="${escapeHTML(t(label))}">${choices.map(([value,text])=>`<option value="${escapeHTML(value)}" ${String(settings[key])===String(value)?'selected':''}>${escapeHTML(text)}</option>`).join('')}</select></div></div>`;
  const settingRange=(key,label,min,max,step=1,suffix='')=>`<div class="setting-row">${settingLabel(label)}<div class="setting-control"><input type="range" data-setting="${key}" min="${min}" max="${max}" step="${step}" value="${settings[key]}" aria-label="${escapeHTML(t(label))}"><output data-output="${key}">${settings[key]}${suffix}</output></div></div>`;
  const group=(heading,content)=>`<section class="setting-group">${heading?`<h4>${escapeHTML(t(heading))}</h4>`:''}${content}</section>`;
  const note=key=>`<p class="info-note">${escapeHTML(t(key))}</p>`;
  const settingButton=(action,label,danger=false)=>`<button class="button secondary${danger?' danger-button':''}" data-action="${action}">${escapeHTML(t(label))}</button>`;
  const EQ_PRESETS={flat:[0,0,0,0,0,0,0,0],bass:[5,4,2,0,-1,0,1,1],warm:[3,2,1,0,0,-1,-2,-2],vocal:[-3,-2,0,2,3,3,1,-1],bright:[-2,-1,0,0,1,2,3,4]};
  function syncEQControls(source){
    $$('[data-eq]').forEach(node=>{const index=Number(node.dataset.eq);if(node!==source)node.value=settings.eq[index];});
    $$('[data-eq-output]').forEach(node=>{const value=settings.eq[Number(node.dataset.eqOutput)];node.textContent=`${value>0?'+':''}${value} dB`;});
    $$('[data-setting="audioMode"]').forEach(node=>{node.value=settings.audioMode;});
    $$('[data-setting="eqPreset"]').forEach(node=>{node.value=settings.eqPreset;});
    $$('[data-action="setAudioMode"]').forEach(btn=>{const on=btn.dataset.value===settings.audioMode;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on));});
    $$('[data-action="setEqPreset"]').forEach(btn=>{const on=btn.dataset.value===settings.eqPreset;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on));});
    $$('[data-widget-audio-mode]').forEach(node=>node.textContent=t(settings.audioMode==='effects'?'effects':settings.audioMode==='economy'?'audioEconomy':'original'));
    const engineNote=$('#audioEngineNote');
    if(engineNote)engineNote.textContent=`${t('audioStatus')}: ${graph?`${Math.round(graph.context.sampleRate/100)/10} kHz · ${t(settings.audioMode==='effects'?'effects':settings.audioMode==='economy'?'audioEconomy':'original')}`:t('inactive')}`;
    if(typeof syncCustomSelects==='function')syncCustomSelects();
  }
  function changeEQ(node){
    const index=Number(node.dataset.eq);if(!Number.isInteger(index)||index<0||index>7)return;
    settings.eq[index]=clamp(node.value,-12,12);settings.eqPreset='custom';settings.audioMode='effects';settings.preset='custom';syncEQControls(node);rebuildGraph();saveState();
  }
  function openSettings(tab='general'){settingsTab=tab;renderSettings();openDialogAnimated($('#settingsDialog'));}
  function renderSettings(){
    const root=$('#settingsContent');$('#settingsTabs').innerHTML=TABS.map(([name,symbol])=>`<button class="settings-tab ${settingsTab===name?'active':''}" data-settings-tab="${name}" aria-current="${settingsTab===name?'page':'false'}">${icon(symbol)}${escapeHTML(t(name))}</button>`).join('');
    let content='';
    if(settingsTab==='general')content=`<h3>${t('general')}</h3><p class="settings-intro">${t('generalIntro')}</p>`+
      group('',settingSelect('language','language',Object.entries(LANGUAGE_NAMES))+note('languageNote'))+
      group('',settingToggle('rememberPosition','rememberPosition','rememberPositionDesc')+settingToggle('shortcuts','enableShortcuts','enableShortcutsDesc'))+
      group('',`<div class="settings-buttons">${settingButton('exportSettings','exportSettings')}${settingButton('importSettings','importSettings')}</div>`+note('settingsExported'))+
      group('',settingButton('resetAll','resetAll'));
    if(settingsTab==='appearance')content=appearanceHTML();
    if(settingsTab==='layout')content=`<h3>${t('layout')}</h3><p class="settings-intro">${t('layoutIntro')}</p>`+panelSettingsHTML()+
      group('',settingToggle('showHero')+settingToggle('simple','simple','simpleDesc'));
    if(settingsTab==='giga')content=gigaSettingsHTML();
    if(settingsTab==='spectrum')content=spectrumSettingsHTML();
    if(settingsTab==='performance')content=`<h3>${t('performance')}</h3><p class="settings-intro">${t('performanceIntro')}</p><div class="preset-choices">${['economy','balanced','full'].map(name=>`<button class="preset-choice ${settings.preset===name?'selected':''}" data-action="performancePreset" data-value="${name}"><strong>${t(name)}</strong><span>${t(`${name}Desc`)}</span></button>`).join('')}</div>`+
      group('',settingToggle('animations')+settingToggle('spectrum')+settingSelect('spectrumStyle','spectrumStyle',SPECTRUM_STYLES.map(value=>[value,t(value)]))+settingSelect('fps','frameRate',[[15,'15 fps'],[30,'30 fps'],[60,'60 fps']])+settingSelect('pageSize','pageSize',[[20,'20'],[60,'60'],[120,'120']]))+note('performanceNote');
    if(settingsTab==='audio'){
      const activeSleepMin=sleepDeadline?Math.ceil((sleepDeadline-Date.now())/60000):0;
      content=`<h3>${t('audio')}</h3><p class="settings-intro">${t('audioIntro')}</p>`+
        group('',
          settingSelect('audioMode','audioMode',[['original',t('original')],['effects',t('effects')],['economy',t('audioEconomy')]])+
          `<div class="audio-quick-pills" role="group" aria-label="${escapeHTML(t('audioMode'))}">${[['original','original'],['effects','effects'],['economy','audioEconomy']].map(([val,labelKey])=>`<button type="button" class="audio-pill-btn ${settings.audioMode===val?'active':''}" data-action="setAudioMode" data-value="${val}" aria-pressed="${settings.audioMode===val}">${escapeHTML(t(labelKey))}</button>`).join('')}</div>`+
          note('audioNote')
        )+
        group('equalizer',
          settingSelect('eqPreset','eqPreset',[...Object.keys(EQ_PRESETS),'custom'].map(key=>[key,t(key)]))+
          `<div class="audio-quick-pills" role="group" aria-label="${escapeHTML(t('eqPreset'))}">${Object.keys(EQ_PRESETS).map(key=>`<button type="button" class="audio-pill-btn ${settings.eqPreset===key?'active':''}" data-action="setEqPreset" data-value="${key}" aria-pressed="${settings.eqPreset===key}">${escapeHTML(t(key))}</button>`).join('')}<button type="button" class="audio-pill-btn ${settings.eqPreset==='custom'?'active':''}" data-action="setEqPreset" data-value="custom" aria-pressed="${settings.eqPreset==='custom'}">${escapeHTML(t('custom'))}</button></div>`+
          `<div class="eq-grid">${[60,120,250,500,1000,2000,4000,8000].map((hz,i)=>`<label class="eq-band"><output data-eq-output="${i}">${settings.eq[i]>0?'+':''}${settings.eq[i]} dB</output><input type="range" min="-12" max="12" step="1" data-eq="${i}" value="${settings.eq[i]}" aria-label="${hz} Hz"><span>${hz>=1000?`${hz/1000}k`:hz}</span></label>`).join('')}</div>`+
          settingRange('preamp','preamp',-18,6,1,' dB')+
          settingRange('balance','balance',-100,100,5,'%')+
          settingToggle('mono')+
          settingToggle('limiter','limiter','limiterDesc')
        )+
        group('',
          settingRange('speed','speed',.5,2,.05,'×')+
          `<div class="setting-row">${settingLabel('sleep')}<select id="sleepSelect" aria-label="${t('sleep')}"><option value="0">${sleepDeadline?`${activeSleepMin} ${t('minutes')}`:t('off')}</option>${[15,30,60,90].map(n=>`<option value="${n}">${n} ${t('minutes')}</option>`).join('')}${sleepDeadline?`<option value="-1">${t('off')}</option>`:''}</select></div>`+
          `<div class="audio-quick-pills" role="group" aria-label="${escapeHTML(t('sleep'))}">${[[0,t('off')],[15,`15 ${t('minutes')}`],[30,`30 ${t('minutes')}`],[60,`60 ${t('minutes')}`],[90,`90 ${t('minutes')}`]].map(([mins,label])=>{const isSel=mins===0?!sleepDeadline:(Math.abs(activeSleepMin-mins)<=2);return `<button type="button" class="audio-pill-btn ${isSel?'active':''}" data-action="setSleepTimer" data-value="${mins}" aria-pressed="${isSel}">${escapeHTML(label)}</button>`;}).join('')}</div>`+
          `<div class="settings-buttons" style="margin-top:14px"><button type="button" class="button secondary" data-action="flatEQ">${icon('refresh')}${escapeHTML(t('flat'))} EQ</button><button type="button" class="button secondary" data-action="resetAudioSettings">${icon('sliders')}${escapeHTML(t('resetAudio'))}</button></div>`
        )+
        `<div class="info-note" id="audioEngineNote">${t('audioStatus')}: ${graph?`${Math.round(graph.context.sampleRate/100)/10} kHz · ${t(settings.audioMode==='effects'?'effects':settings.audioMode==='economy'?'audioEconomy':'original')}`:t('inactive')}</div>`;
    }
    if(settingsTab==='storage'){
      const sum=tracks.reduce((total,track)=>total+track.size,0);const transient=tracks.filter(track=>track.temporary).length;
      content=`<h3>${t('storage')}</h3><p class="settings-intro">${t('storageIntro')}</p>`+
        group('',`<div class="setting-row">${settingLabel('usedByLibrary')}<strong>${bytes(sum)}</strong></div><p class="setting-description">${tracks.length} ${t('tracks')}${transient?` · ◌ ${transient} ${t('sessionOnly')}`:''}</p><p id="storageEstimate" class="setting-description"></p>`)+
        group('',settingToggle('persistMusic','persistMusic','persistMusicDesc')+settingToggle('duplicates','duplicates','duplicatesDesc')+settingToggle('readTags','readTags','readTagsDesc'))+
        group('',`<div class="settings-buttons">${settingButton('importFolder','folder')}${settingButton('retainStorage','retainStorage')}</div>`)+note('storageNote')+
        group('',`<div class="settings-buttons">${settingButton('cleanupDemo','cleanupDemo')}${settingButton('clearLibrary','clearLibrary',true)}</div>`);
      if(navigator.storage?.estimate)navigator.storage.estimate().then(estimate=>{const node=$('#storageEstimate');if(node)node.textContent=`${t('browserStorage')}: ${bytes(estimate.usage||0)} / ${bytes(estimate.quota||0)}`;}).catch(()=>{});
    }
    if(settingsTab==='shortcuts')content=`<h3>${t('shortcuts')}</h3><p class="settings-intro">${t('enableShortcutsDesc')}</p>`+settingToggle('shortcuts','enableShortcuts')+`<table class="shortcut-table"><tbody>${[[t('togglePlayback'),t('space')],[t('previous'),'Alt + ←'],[t('next'),'Alt + →'],[t('seekShortcut'),'← / →'],[t('volumeShortcut'),'↑ / ↓'],[t('mute'),'M'],[t('favoriteAction'),'L'],[t('shuffle'),'S'],[t('repeat'),'R'],[t('searchShortcut'),'/'],[t('settings'),'Ctrl + ,'],[t('close'),'Esc']].map(([label,key])=>`<tr><td>${label}</td><td><kbd>${key}</kbd></td></tr>`).join('')}</tbody></table>`;
    if(settingsTab==='about')content=`<h3>ZENITH<span class="about-spark"> ✳</span></h3><p class="settings-intro">${t('aboutIntro')}<br>${t('version')}</p>`+note('aboutCopy')+group('help',`<p class="settings-intro">${t('localHelp')}</p>`)+note('codecNote')+group('',`<p class="settings-intro">${t('demoDescription')}</p>${settingButton('demo','tryDemo')}`);
    root.innerHTML=content;$$('input[type="range"]',root).forEach(rangeFill);localize($('#settingsDialog'));syncCustomSelects(root);void loadPhotoThumbnails();if(settingsTab==='spectrum'){resizeSpectrum();drawSpectrumPreviews();}startSpectrum();
  }
  function setPerformance(name){
    settings.preset=name;
    if(name==='economy')Object.assign(settings,{animations:false,spectrum:false,fps:15,pageSize:20,audioMode:'economy'});
    if(name==='balanced')Object.assign(settings,{animations:true,spectrum:true,fps:60,pageSize:60,audioMode:'original'});
    if(name==='full')Object.assign(settings,{animations:true,spectrum:true,fps:60,pageSize:120,audioMode:'original'});
    applySettings();
  }
  function settingUnit(key){
    if(key==='preamp')return ' dB';
    if(key==='speed')return '×';
    if(['fontScale','balance','surfaceOpacity','spectrumGain','spectrumSmooth'].includes(key))return '%';
    if(key==='motionDuration')return ' ms';
    if(key==='letterSpacing')return '×0.1px';
    if(['radius','shadow','workspaceGap','workspaceMargin','topbarHeight','borderWidth','panelPadding','headerHeight','glassBlur','gridSize','snapDistance','cornerTL','cornerTR','cornerBR','cornerBL','spectrumStroke'].includes(key))return 'px';
    return '';
  }
  function updateSetting(key,value,live=false){
    if(!Object.hasOwn(DEFAULTS,key))return;
    if(RANGES[key])value=clamp(value,...RANGES[key]);
    settings=sanitizeSettings({...settings,[key]:value});
    if(['animations','spectrum','fps','pageSize','audioMode'].includes(key))settings.preset='custom';
    if(key==='eqPreset'&&EQ_PRESETS[value]){settings.eq=[...EQ_PRESETS[value]];settings.audioMode='effects';}
    if(['preamp','balance','mono','limiter'].includes(key)){settings.audioMode='effects';const mode=$('[data-setting="audioMode"]');if(mode)mode.value='effects';}
    $$(`[data-output="${key}"]`).forEach(output=>{output.textContent=`${settings[key]}${settingUnit(key)}`;});
    if(key==='language'){renderAll();renderSettings();return saveState();}
    if(key.endsWith('Dock'))setPanelZone(key.slice(0,-4),settings[key]);
    if(key==='showNow')panelConfig('now').visible=settings.showNow;
    if(key.endsWith('Dock')||['showNow','panelsLocked','headerHeight','workspaceGap','workspaceMargin'].includes(key))applyLayout(false);
    applyTheme();
    if(['audioMode','eqPreset','preamp','balance','mono','limiter','spectrum','fps'].includes(key))rebuildGraph();
    if(['audioMode','eqPreset','preamp','balance','mono','limiter'].includes(key))syncEQControls();
    if(key.startsWith('spectrum')||key==='audioMode'){startSpectrum();drawSpectrumPreviews();}
    if(key==='speed')audio.playbackRate=settings.speed;
    if(['pageSize','sort','viewMode','artwork'].includes(key)){page=1;renderLibrary();}
    if(key==='artwork')renderCurrent();
    if(!live&&['theme','use4Corners','shapeProfile'].includes(key))renderSettings();
    const cssPreview=$('#cssVarsPreview');if(cssPreview)cssPreview.textContent=activeCSSVariablesText();
    saveState();
  }
  function setSleep(minutes){clearTimeout(sleepTimer);sleepDeadline=minutes>0?Date.now()+minutes*60000:0;if(minutes>0)sleepTimer=setTimeout(()=>{audio.pause();sleepDeadline=0;toast(t('timerEnded'));if($('#settingsDialog').open&&settingsTab==='audio')renderSettings();},minutes*60000);toast(t(minutes>0?'timerSet':'timerOff',{n:minutes}));}

  function openForm(title,fields,onSubmit,submitLabel='save'){
    delete $('#editFields').dataset.panel;$('#editTitle').textContent=title;$('#editFields').innerHTML=fields;const submit=$('#editForm [type="submit"]');submit.textContent=t(submitLabel);submit.dataset.i18n=submitLabel;editCallback=onSubmit;
    syncCustomSelects($('#editDialog'));if(!$('#editDialog').open)openDialogAnimated($('#editDialog'));const field=$('#editFields input');if(field){field.focus();field.select();}
  }
  function confirmAction(title,message,callback){openForm(title,`<p class="dialog-message">${escapeHTML(message)}</p>`,callback,'confirm');}
  function textField(name,label,value='',required=false){return `<label>${escapeHTML(t(label))}<input name="${name}" value="${escapeHTML(value)}" maxlength="200" ${required?'required':''} autocomplete="off"></label>`;}
  function newPlaylist(afterCreate){openForm(t('newPlaylist'),textField('name','playlistName','',true),form=>{const name=form.get('name').trim();if(!name){toast(t('invalidName'));return false;}const playlist={id:uid(),name:name.slice(0,100),ids:[]};playlists.push(playlist);saveState();renderNavigation();afterCreate?.(playlist);toast(t('playlistCreated'));});}
  function addToPlaylist(id){
    if(!trackMap.has(id))return;
    if(!playlists.length){newPlaylist(playlist=>{playlist.ids.push(id);saveState();renderAll();});return;}
    openForm(t('addPlaylist'),`<label>${t('pickPlaylist')}<select name="playlist">${playlists.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)}</option>`).join('')}</select></label>`,form=>{const playlist=playlists.find(p=>p.id===form.get('playlist'));if(!playlist)return;if(playlist.ids.includes(id)){toast(t('playlistExists'));return;}playlist.ids.push(id);saveState();renderAll();toast(t('playlistAdded'));});
  }
  async function toggleFavorite(id){const track=trackMap.get(id);if(!track)return;track.favorite=!track.favorite;await persistMetadata(track);renderNavigation();renderLibrary();renderCurrent();}
  function editTrack(id){const track=trackMap.get(id);if(!track)return;openForm(t('editTrack'),textField('title','title',track.title,true)+textField('artist','artist',track.artist)+textField('album','album',track.album),async form=>{const title=form.get('title').trim();if(!title){toast(t('invalidName'));return false;}track.title=title;track.artist=form.get('artist').trim();track.album=form.get('album').trim();await persistMetadata(track);renderAll();updateMediaSession();toast(t('metadataSaved'));});}
  function stopCurrent(){playToken++;currentId='';audio.pause();audio.removeAttribute('src');audio.load();if(currentURL)URL.revokeObjectURL(currentURL);currentURL='';updatePlaybackUI();saveState();}
  async function removeTracks(ids){
    const unique=new Set(ids);if(unique.has(currentId))stopCurrent();
    if(db)await dbWrite(['tracks','files','covers'],tx=>{for(const id of unique){tx.objectStore('tracks').delete(id);tx.objectStore('files').delete(id);tx.objectStore('covers').delete(id);}});
    tracks=tracks.filter(track=>!unique.has(track.id));for(const id of unique){trackMap.delete(id);temporaryFiles.delete(id);temporaryCovers.delete(id);if(coverCache.has(id))URL.revokeObjectURL(coverCache.get(id));coverCache.delete(id);}
    for(const playlist of playlists)playlist.ids=playlist.ids.filter(id=>!unique.has(id));queue=queue.filter(id=>!unique.has(id));manualQueue=manualQueue.filter(id=>!unique.has(id));shuffleBag=shuffleBag.filter(id=>!unique.has(id));playHistory=playHistory.filter(id=>!unique.has(id));
    saveState();renderAll();
  }
  function trackMenu(id,x,y){
    if(!trackMap.has(id))return;const menu=$('#contextMenu');
    const item=(action,label,symbol)=>`<button role="menuitem" data-action="${action}" data-id="${escapeHTML(id)}">${icon(symbol)}${escapeHTML(t(label))}</button>`;
    menu.innerHTML=item('playNext','addQueue','next')+item('addPlaylist','addPlaylist','plus')+item('favorite','favoriteAction','heart')+'<hr>'+item('editTrack','editTrack','settings')+(view.startsWith('playlist:')?item('removePlaylistTrack','removeFromPlaylist','close'):'')+item('deleteTrack','deleteTrack','trash');
    showMenu(menu,x,y);
  }
  function showMenu(menu,x,y){menu.hidden=false;menu.style.left=`${Math.max(8,Math.min(x,innerWidth-menu.offsetWidth-10))}px`;menu.style.top=`${Math.max(8,Math.min(y,innerHeight-menu.offsetHeight-10))}px`;$('button',menu)?.focus({preventScroll:true});}
  function closeMenu(){ $('#contextMenu').hidden=true; }
  function reorderQueue(ids){manualQueue=[];queue=[currentId,...ids].filter(Boolean);if(shuffle)shuffleBag=[...ids];renderQueue();observeCovers();}

  function exportPreferences(){const data={format:'ZENITH_LOCAL_SETTINGS',version:1,exported:new Date().toISOString(),settings,playlists};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='ZENITH-settings.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(t('settingsExported'));}
  async function importPreferences(file){
    if(!file)return;if(file.size>5*1024*1024){toast(t('badSettings'),true);return;}
    try{const data=JSON.parse(await file.text());if(data.format!=='ZENITH_LOCAL_SETTINGS'||data.version!==1||!data.settings)throw new Error('Invalid settings');settings=sanitizeSettings(data.settings);const incoming=cleanPlaylists(data.playlists);const merged=new Map(playlists.map(p=>[p.id,p]));for(const playlist of incoming)merged.set(playlist.id,playlist);playlists=[...merged.values()];applySettings();toast(t('themeImported'));}catch{toast(t('badSettings'),true);}
  }

  // Optional original demos are synthesized into ordinary WAV files locally.
  // They are never auto-imported, and do not masquerade as the user's music.
  function makeDemoWav(index,seconds=18){
    const rate=22050,length=Math.floor(rate*seconds),buffer=new ArrayBuffer(44+length*2),v=new DataView(buffer);
    const word=(p,text)=>[...text].forEach((c,i)=>v.setUint8(p+i,c.charCodeAt(0)));word(0,'RIFF');v.setUint32(4,36+length*2,true);word(8,'WAVE');word(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);word(36,'data');v.setUint32(40,length*2,true);
    const roots=[[130.81,155.56,174.61,116.54],[146.83,130.81,164.81,110],[110,130.81,98,146.83]][index%3],tempo=[84,96,72][index%3],beat=60/tempo;let seed=7219+index;
    for(let i=0;i<length;i++){
      const time=i/rate,bar=Math.floor(time/(beat*4))%4,root=roots[bar],phase=time%beat,half=time%(beat*.5),fade=Math.min(1,time/.4,(seconds-time)/1.2);
      let sample=0;
      for(const ratio of [1,1.2,1.5])sample+=Math.sin(2*Math.PI*root*ratio*time)*.045*(.75+.25*Math.sin(2*Math.PI*.16*time));
      sample+=Math.sin(2*Math.PI*root*.5*time)*.1*(.6+.4*Math.exp(-phase*6));
      const note=[1,1.5,2,1.2,1.5,2.4,2,1.5][Math.floor(time/(beat*.5))%8];sample+=Math.sin(2*Math.PI*root*note*2*time)*Math.exp(-half*10)*.06;
      sample+=Math.sin(2*Math.PI*(47*phase+10*(1-Math.exp(-phase*35))))*Math.exp(-phase*22)*.17;
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/4294967296*2-1;sample+=noise*Math.exp(-half*130)*.024;
      if(Math.floor(time/beat)%2===1)sample+=noise*Math.exp(-phase*40)*.04;
      v.setInt16(44+i*2,Math.round(clamp(sample*fade,-1,1)*32767),true);
    }
    return new Blob([buffer],{type:'audio/wav'});
  }
  async function loadDemo(){
    if(importing){toast(t('importBusy'));return;}
    const existing=tracks.filter(track=>track.demo);if(existing.length){await playTrack(existing[0].id,true,existing.map(track=>track.id));return;}
    toast(t('demoCreating'));await nextPaint();const files=[];const names=['Slow Sunday','Paper Satellites','After the Rain'];
    for(let i=0;i<3;i++){files.push(new File([makeDemoWav(i)],`ZENITH Demo - ${names[i]}.wav`,{type:'audio/wav',lastModified:1700000000000}));await nextPaint();}
    const ids=await importFiles(files,{demo:true});if(ids?.length){selectView('home');await playTrack(ids[0],true,ids);}
  }

  const actions={
    home:()=>selectView('home'),
    importFiles:()=>$('#fileInput').click(),
    importFolder:()=>$('#folderInput').click(),
    cancelImport:()=>{cancelImport=true;},
    demo:loadDemo,
    settings:()=>openSettings(),audioSettings:()=>openSettings('audio'),
    closeSettings:()=>closeDialogAnimated($('#settingsDialog')),closeEdit:()=>{$('#editDialog').close();editCallback=null;},
    theme:()=>runThemeWaveTransition(()=>{settings.theme=themeName()==='light'?'dark':'light';applyTheme();if($('#settingsDialog').open)renderSettings();saveState();}),
    setTheme:button=>runThemeWaveTransition(()=>{settings.theme=button.dataset.value;applyTheme();renderSettings();saveState();}),
    resetColors:()=>{settings.colors[themeName()]={};applyTheme();renderSettings();saveState();},
    resetAll:()=>confirmAction(t('resetAll'),t('resetConfirm'),()=>{settings=structuredClone(DEFAULTS);applySettings();toast(t('resetDone'));}),
    layout:()=>{layoutEditing=!layoutEditing;document.body.classList.toggle('is-editing',layoutEditing);$('#layoutNotice').hidden=!layoutEditing;if(!layoutEditing)endPanelDrag();else settings.panelsLocked=false;applyLayout(false);},
    layoutFromSettings:()=>{$('#settingsDialog').close();if(!layoutEditing)actions.layout();},
    resetLayout:()=>{settings.panelsLocked=false;applyWorkspacePreset('desk');},
    toggleNow:()=>{settings.showNow=!settings.showNow;panelConfig('now').visible=settings.showNow;if(narrowWindow?.matches&&settings.showNow)setPanelZone('now','float');applyLayout();saveState();},
    performancePreset:button=>setPerformance(button.dataset.value),
    play:togglePlay,previous:previousTrack,next:()=>nextTrack(),
    playAll:async()=>{const list=visibleTracks();if(list.length)await playTrack(list[0].id,true,list.map(track=>track.id));else toast(t('noPlayable'));},
    playTrack:button=>button.dataset.id===currentId?togglePlay():playTrack(button.dataset.id,true,visibleTracks().map(track=>track.id)),
    queuePlay:button=>playTrack(button.dataset.id,true),
    shuffle:()=>{shuffle=!shuffle;if(shuffle)resetShuffleBag();updatePlaybackUI();renderQueue();observeCovers();saveState();toast(t(shuffle?'shuffleOn':'shuffleOff'));},
    repeat:()=>{repeat={off:'all',all:'one',one:'off'}[repeat];updatePlaybackUI();renderQueue();observeCovers();saveState();toast(t(repeat==='off'?'repeatOff':repeat==='all'?'repeatAll':'repeatOne'));},
    mute:()=>{audio.muted=!audio.muted;updatePlaybackUI();},
    favorite:button=>toggleFavorite(button.dataset.id),favoriteCurrent:()=>toggleFavorite(currentId),
    newPlaylist:()=>newPlaylist(playlist=>selectView(`playlist:${playlist.id}`)),
    addPlaylist:button=>addToPlaylist(button.dataset.id),
    editTrack:button=>editTrack(button.dataset.id),
    deleteTrack:button=>{const id=button.dataset.id;confirmAction(t('deleteTrack'),t('deleteConfirm'),async()=>{await removeTracks([id]);toast(t('deleted'));});},
    playNext:button=>{const id=button.dataset.id;const rest=upcomingIds().filter(item=>item!==id);reorderQueue([id,...rest]);toast(t('queued'));},
    queueRemove:button=>reorderQueue(upcomingIds().filter(id=>id!==button.dataset.id)),
    queueUp:button=>{const ids=upcomingIds(),index=ids.indexOf(button.dataset.id);if(index>0)[ids[index-1],ids[index]]=[ids[index],ids[index-1]];reorderQueue(ids);},
    trackMenu:(button,event)=>{const rect=button.getBoundingClientRect();trackMenu(button.dataset.id,event.clientX||rect.left,event.clientY||rect.bottom);},
    openAlbum:button=>{const track=trackMap.get(button.dataset.id);if(track){albumFilter=albumKey(track);selectView('album');}},
    removePlaylistTrack:button=>{const playlist=playlists.find(p=>`playlist:${p.id}`===view);if(playlist){playlist.ids=playlist.ids.filter(id=>id!==button.dataset.id);saveState();renderLibrary();}},
    playlistOptions:button=>{const menu=$('#contextMenu'),rect=button.getBoundingClientRect();menu.innerHTML=`<button role="menuitem" data-action="renamePlaylist">${icon('settings')}${t('renamePlaylist')}</button><button role="menuitem" data-action="deletePlaylist">${icon('trash')}${t('deletePlaylist')}</button>`;showMenu(menu,rect.left,rect.bottom);},
    renamePlaylist:()=>{const playlist=playlists.find(p=>`playlist:${p.id}`===view);if(playlist)openForm(t('renamePlaylist'),textField('name','playlistName',playlist.name,true),form=>{const name=form.get('name').trim();if(!name)return false;playlist.name=name.slice(0,100);saveState();renderAll();});},
    deletePlaylist:()=>{const id=view.slice(9);confirmAction(t('deletePlaylist'),t('deletePlaylistConfirm'),()=>{playlists=playlists.filter(p=>p.id!==id);saveState();selectView('home');});},
    viewMode:()=>{settings.viewMode=settings.viewMode==='list'?'grid':'list';renderLibrary();saveState();},
    prevPage:()=>{page--;renderLibrary();$('.library-section').scrollIntoView({block:'start'});},
    nextPage:()=>{page++;renderLibrary();$('.library-section').scrollIntoView({block:'start'});},
    exportSettings:exportPreferences,importSettings:()=>$('#settingsInput').click(),
    retainStorage:async()=>{const granted=await navigator.storage?.persist?.().catch(()=>false);toast(t(granted?'retained':'notRetained'));},
    cleanupDemo:async()=>{await removeTracks(tracks.filter(track=>track.demo).map(track=>track.id));toast(t('demoRemoved'));if($('#settingsDialog').open)renderSettings();},
    clearLibrary:()=>confirmAction(t('clearLibrary'),t('clearConfirm'),async()=>{if(importing){toast(t('importBusy'));return;}await removeTracks(tracks.map(track=>track.id));playlists=[];saveState();selectView('home');if($('#settingsDialog').open)renderSettings();toast(t('cleared'));})
  };

  // Persistent desktop panels. Pointer movement updates one transform per frame.
  // Docked panels also reorder; floating panels have bounded, saved geometry.
  let panelDrag=null,panelFrame=0,floatZ=50,panelEditBackup=null;
  const panelIds=()=>['navigation','now','player',...settings.customPanels.map(widget=>widget.id)];
  const workspaceSize=()=>({w:$('#workspace').clientWidth||900,h:$('#workspace').clientHeight||650});
  function fitPanelRect(rect,space){
    const maxW=Math.max(1,space.w-12),maxH=Math.max(1,space.h-12);
    const w=clamp(rect.w||300,Math.min(180,maxW),Math.min(1600,maxW)),h=clamp(rect.h||300,Math.min(80,maxH),Math.min(1400,maxH));
    return {x:clamp(rect.x,Math.min(6,Math.max(0,space.w-w)),Math.max(0,space.w-w-6)),y:clamp(rect.y,Math.min(6,Math.max(0,space.h-h)),Math.max(0,space.h-h-6)),w,h};
  }
  function panelConfig(id){
    if(!settings.panelLayout[id]){
      const index=panelIds().indexOf(id),built={navigation:{zone:settings.navigationDock,w:208,h:500},now:{zone:settings.nowDock,w:284,h:540},player:{zone:settings.playerDock,w:660,h:122}}[id];
      settings.panelLayout[id]={zone:built?.zone||'float',x:28+Math.max(0,index-3)*30,y:28+Math.max(0,index-3)*25,w:built?.w||320,h:built?.h||300,order:Math.max(0,index),visible:true,collapsed:false,pinned:false,color:'',name:'',content:'native',ink:'',line:'',radius:null,borderWidth:null,opacity:null,padding:null,scale:null,shape:'inherit',header:true,notes:'',spectrumStyle:''};
    }
    return settings.panelLayout[id];
  }
  function contrastInk(hex){const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722>.36?'#252735':'#f6f7fb';}
  function panelTitle(id){const record=panelConfig(id),widget=settings.customPanels.find(p=>p.id===id);return record.name||widget?.title||t(widget?.type||(record.content&&record.content!=='native'?record.content:null)||{navigation:'navigation',now:'nowPlaying',player:'player'}[id]);}
  function renderPanelHead(panel,id){
    const record=panelConfig(id),head=$('.panel-head',panel);if(!head)return;
    panel.dataset.pinned=String(!!record.pinned);
    const signature=JSON.stringify([panelTitle(id),record.collapsed,record.zone,!!record.pinned,settings.language]);if(head.dataset.signature===signature)return;head.dataset.signature=signature;
    head.innerHTML=`<span class="panel-drag-mark">${icon('grip')}</span><span class="panel-name">${escapeHTML(panelTitle(id))}</span><div class="panel-head-actions"><button class="panel-tool ${record.pinned?'is-pinned':''}" data-action="pinPanel" data-id="${id}" aria-pressed="${!!record.pinned}" aria-label="${escapeHTML(t(record.pinned?'unpinPanel':'pinPanel'))}" title="${escapeHTML(t(record.pinned?'unpinPanel':'pinPanel'))}">${icon(record.pinned?'lock':'unlock')}</button><button class="panel-tool" data-action="collapsePanel" data-id="${id}" aria-label="${escapeHTML(t(record.collapsed?'panelExpand':'panelCollapse'))}" title="${escapeHTML(t(record.collapsed?'panelExpand':'panelCollapse'))}">${icon(record.collapsed?'expand':'collapse')}</button><button class="panel-tool" data-action="floatPanel" data-id="${id}" aria-label="${escapeHTML(t(record.zone==='float'?'panelDock':'panelFloat'))}" title="${escapeHTML(t(record.zone==='float'?'panelDock':'panelFloat'))}">${icon(record.zone==='float'?'layout':'float')}</button><button class="panel-tool panel-edit-button" data-action="panelOptions" data-id="${id}" aria-label="${escapeHTML(t('panelOptions'))}" title="${escapeHTML(t('panelOptions'))}">${icon('settings')}<span>${t('edit')}</span></button></div>`;
    head.title=t('panelKeys');head.setAttribute('aria-label',`${panelTitle(id)}. ${t('panelKeys')}`);head.dataset.drag=id;
    const grip=$('.panel-floating-grip',panel);if(grip){grip.dataset.drag=id;grip.innerHTML=`${icon('grip')}<span>${escapeHTML(panelTitle(id))}</span>`;}
  }
  function preparePanel(panel,id){
    if($('.panel-head',panel))return;
    [...panel.children].filter(node=>node.classList.contains('panel-handle')||node.classList.contains('player-grip')).forEach(node=>node.remove());
    const body=document.createElement('div');body.className='panel-content';while(panel.firstChild)body.append(panel.firstChild);
    const head=document.createElement('div');head.className='panel-head';head.tabIndex=0;head.setAttribute('role','group');
    const floatGrip=document.createElement('div');floatGrip.className='panel-floating-grip';floatGrip.dataset.drag=id;floatGrip.title=t('movePanel');
    panel.append(head,floatGrip,body);
    for(const edge of ['n','s','e','w','nw','ne','sw','se']){const handle=document.createElement('button');handle.type='button';handle.className=`panel-resize resize-${edge}`;handle.dataset.resize=id;handle.dataset.edge=edge;handle.tabIndex=-1;handle.setAttribute('aria-label',t('panelSize'));panel.append(handle);}
  }
  function widgetQueueHTML(){const ids=upcomingIds();return ids.length?ids.slice(0,60).map((id,index)=>{const track=trackMap.get(id);return `<div class="queue-item">${coverMarkup(track)}<div class="track-text"><button class="track-name-button" data-action="queuePlay" data-id="${escapeHTML(id)}"><strong>${escapeHTML(track.title)}</strong></button><small>${escapeHTML(trackArtist(track))}</small></div>${index?buttonIcon('queueUp','prev','queueUp',id):''}${buttonIcon('queueRemove','close','queueRemove',id)}</div>`;}).join(''):`<div class="widget-empty">${icon('music')}<p>${t('widgetEmpty')}</p></div>`;}
  function refreshWidgets(kind){
    for(const widget of activeWidgets()){
      if(kind&&kind!==widget.type)continue;const panel=$(`[data-panel="${widget.id}"]`),body=panel&&widgetBody(panel);if(!body)continue;
      const fresh=body.dataset.language!==settings.language||body.dataset.type!==widget.type;
      if(fresh){const previousCanvas=$('canvas',body);if(previousCanvas)resizeObserver?.unobserve(previousCanvas);}
      if(widget.type==='queue'&&(fresh||kind==='queue'))body.innerHTML=`<div class="widget-subtitle"><span>${t('upNext')}</span><b>${upcomingIds().length}</b></div><div class="widget-queue">${widgetQueueHTML()}</div>`;
      if(widget.type==='spectrum'&&fresh){body.innerHTML=`<div class="widget-subtitle"><span>LIVE FREQUENCIES</span><span class="status-dot"></span></div><canvas class="widget-spectrum" width="500" height="190" aria-hidden="true"></canvas><div class="widget-footer"><span data-widget-current>${escapeHTML(currentTrack()?.title||t('justListen'))}</span><button class="button secondary small" data-action="spectrumSettings">${t('edit')}</button></div>`;resizeObserver?.observe($('canvas',body));}
      if(widget.type==='spectrum')$('[data-widget-current]',body).textContent=currentTrack()?.title||t('justListen');
      if(widget.type==='equalizer'&&fresh)body.innerHTML=`<p class="widget-explainer">${t('equalizer')}</p><div class="eq-grid">${[60,120,250,500,1000,2000,4000,8000].map((hz,i)=>`<label class="eq-band"><output data-eq-output="${i}">${settings.eq[i]} dB</output><input type="range" min="-12" max="12" step="1" data-eq="${i}" value="${settings.eq[i]}" aria-label="${hz} Hz"><span>${hz>=1000?`${hz/1000}k`:hz}</span></label>`).join('')}</div><div class="widget-footer"><span data-widget-audio-mode>${t(settings.audioMode==='effects'?'effects':'original')}</span><button class="pill small" data-action="flatEQ">${t('flat')}</button></div>`;
      if(widget.type==='notes'&&fresh)body.innerHTML=`<textarea class="widget-notes" data-widget-note="${widget.id}" placeholder="${escapeHTML(t('notesPlaceholder'))}" maxlength="6000" aria-label="${escapeHTML(t('notes'))}">${escapeHTML(widget.notes)}</textarea><div class="widget-footer">${t('noteSaved')}</div>`;
      if(widget.type==='notes'){const field=$('textarea',body);if(field!==document.activeElement&&field.value!==widget.notes)field.value=widget.notes;}
      if(widget.type==='quickActions'&&fresh)body.innerHTML=`<div class="quick-grid">${[['importFiles','upload','addMusic'],['importFolder','folder','folder'],['playAll','play','playAll'],['newPlaylist','plus','newPlaylist'],['theme','sun','switchTheme'],['audioSettings','settings','audio']].map(([action,symbol,label])=>`<button data-action="${action}">${icon(symbol)}<span>${t(label)}</span></button>`).join('')}</div>`;
      if(widget.type==='miniPlayer'&&fresh)body.innerHTML=`<div class="widget-current-info"><strong data-mini-title></strong><small data-mini-artist></small></div><div class="transport widget-transport"><button class="button secondary" data-action="previous">${icon('prev')}${t('previous')}</button><button class="button primary" data-action="play" data-widget-play></button><button class="button secondary" data-action="next">${icon('next')}${t('next')}</button></div>`;
      if(widget.type==='miniPlayer'){$('[data-mini-title]',body).textContent=currentTrack()?.title||t('noTrack');$('[data-mini-artist]',body).textContent=currentTrack()?trackArtist(currentTrack()):t('chooseTrack');$('[data-widget-play]',body).innerHTML=icon(audio.paused?'play':'pause')+t(audio.paused?'play':'pause');}
      if(widget.type==='artworkPanel'&&(fresh||body.dataset.track!==currentId)){const track=currentTrack();body.innerHTML=`<div class="artwork-widget">${track?coverMarkup(track):icon('disc')}<strong>${escapeHTML(track?.title||t('noTrack'))}</strong><small>${escapeHTML(track?trackArtist(track):t('chooseTrack'))}</small></div>`;body.dataset.track=currentId;observeCovers();}
      if(widget.type==='photoPanel'&&fresh)body.innerHTML=`<div class="photo-widget-space"></div><button class="button secondary" data-action="choosePhoto" data-target="${widget.id}">${icon('image')}${t('choosePhoto')}</button>`;
      body.dataset.language=settings.language;body.dataset.type=widget.type;
    }
  }
  function setPanelZone(id,zone){const record=panelConfig(id);record.zone=zone;if(['navigation','now','player'].includes(id))settings[`${id}Dock`]=zone;}
  function addCustomPanel(type,title){
    if(settings.customPanels.length>=8){toast(t('panelLimit'));return null;}
    const id=`widget-${uid().replace(/[^a-z0-9-]/g,'').slice(0,50)}`;settings.customPanels.push({id,type,title:title||'',notes:''});panelConfig(id);return id;
  }
  function newPanelForm(){
    if(settings.customPanels.length>=8){toast(t('panelLimit'));return;}
    openForm(t('addPanel'),`<label>${t('panelType')}<select name="type">${WIDGET_TYPES.map(type=>`<option value="${type}">${t(type)}</option>`).join('')}</select></label>`+textField('name','panelTitle'),form=>{const type=String(form.get('type'));if(!WIDGET_TYPES.includes(type))return false;const id=addCustomPanel(type,String(form.get('name')||'').trim());if(id){applyLayout();saveState();if($('#settingsDialog').open)renderSettings();}});
  }
  function saveLayoutForm(){openForm(t('saveLayout'),textField('name','layoutName','',true),form=>{const name=String(form.get('name')).trim();if(!name)return false;const item={id:uid(),name,panels:structuredClone(settings.panelLayout),widgets:structuredClone(settings.customPanels)};if(settings.savedLayouts.length>=8)settings.savedLayouts.shift();settings.savedLayouts.push(item);saveState();toast(t('layoutSaved'));if($('#settingsDialog').open)renderSettings();});}
  const WORKSPACE_PRESET_META=[
    ['desk','presetDesk','presetDeskDesc','layout'],
    ['studio','presetStudio','presetStudioDesc','settings'],
    ['focus','presetFocus','presetFocusDesc','headphones'],
    ['free','presetFree','presetFreeDesc','float'],
    ['cockpit','presetCockpit','presetCockpitDesc','sliders'],
    ['vinyl','presetVinyl','presetVinylDesc','disc'],
    ['compact','presetCompact','presetCompactDesc','list'],
    ['dj','presetDj','presetDjDesc','zap']
  ];
  function buildDefaultPresetState(name){
    const space=workspaceSize(),panels={
      navigation:{zone:'left',x:20,y:24,w:210,h:500,order:0,visible:true,collapsed:false},
      now:{zone:'right',x:Math.max(260,space.w-312),y:24,w:286,h:540,order:1,visible:true,collapsed:false},
      player:{zone:'bottom',x:Math.max(24,Math.round((space.w-640)/2)),y:Math.max(120,space.h-156),w:640,h:122,order:2,visible:true,collapsed:false}
    },widgets=[];
    let showNow=true;
    if(name==='focus'){
      panels.navigation={...panels.navigation,zone:'top',h:68};
      panels.now={...panels.now,visible:false};
      panels.player={...panels.player,zone:'bottom',h:112};
      showNow=false;
    }else if(name==='studio'){
      panels.now.h=380;
      widgets.push({type:'equalizer',zone:'right',w:286,h:240,order:4},{type:'spectrum',zone:'bottom',w:340,h:136,order:5});
    }else if(name==='free'){
      panels.navigation={...panels.navigation,zone:'float',x:22,y:24,w:226,h:460};
      panels.now={...panels.now,zone:'float',x:Math.max(260,space.w-312),y:24,w:288,h:490};
      panels.player={...panels.player,zone:'float',x:Math.max(28,Math.round((space.w-620)/2)),y:Math.max(140,space.h-164),w:620,h:134};
    }else if(name==='cockpit'){
      panels.navigation={...panels.navigation,zone:'left',w:212,h:360};
      panels.now={...panels.now,zone:'right',w:292,h:360};
      widgets.push({type:'quickActions',zone:'left',w:212,h:220,order:4},{type:'notes',zone:'right',w:292,h:210,order:5},{type:'spectrum',zone:'bottom',w:320,h:126,order:6});
    }else if(name==='vinyl'){
      panels.navigation={...panels.navigation,zone:'right',w:204,h:500};
      panels.now={...panels.now,zone:'left',w:304,h:340,order:2};
      widgets.push({type:'artworkPanel',zone:'left',w:304,h:290,order:0});
    }else if(name==='compact'){
      panels.navigation={...panels.navigation,zone:'top',w:380,h:104,order:0};
      panels.player={...panels.player,zone:'top',w:540,h:104,order:1};
      panels.now={...panels.now,zone:'right',w:276,h:520,order:2};
    }else if(name==='dj'){
      panels.navigation={...panels.navigation,zone:'left',w:214,h:340,order:0};
      panels.now={...panels.now,zone:'right',w:290,h:320,order:1};
      panels.player={...panels.player,zone:'bottom',w:660,h:124,order:2};
      widgets.push({type:'spectrum',zone:'top',w:600,h:108,order:3},{type:'equalizer',zone:'right',w:290,h:250,order:4},{type:'queue',zone:'left',w:214,h:240,order:5});
    }
    return {panels,widgets,showNow};
  }
  function getWorkspacePresetPreview(name){
    const mod=settings.modifiedLayouts?.[name];
    if(mod?.panels&&Object.keys(mod.panels).length)return {name:mod.name||t(WORKSPACE_PRESET_META.find(m=>m[0]===name)?.[1]||name),panels:mod.panels,modified:true};
    const def=buildDefaultPresetState(name),previewPanels={...def.panels};
    def.widgets.forEach((w,i)=>{previewPanels[`w${i}`]={zone:w.zone,visible:true};});
    return {name:mod?.name||t(WORKSPACE_PRESET_META.find(m=>m[0]===name)?.[1]||name),panels:previewPanels,modified:!!mod};
  }
  function applyWorkspacePreset(name){
    const mod=settings.modifiedLayouts?.[name];
    if(mod?.panels&&Object.keys(mod.panels).length){
      const currentNotes=new Map(settings.customPanels.filter(p=>p.type==='notes').map(p=>[p.id,p.notes]));
      const widgets=cleanCustomPanels(mod.widgets||[]),ids=new Set(widgets.map(p=>p.id)),retained=settings.customPanels.filter(p=>!ids.has(p.id));
      const nextPanels=cleanPanelLayout(mod.panels);
      for(const widget of retained)nextPanels[widget.id]={...panelConfig(widget.id),visible:false};
      settings.panelLayout=nextPanels;settings.customPanels=[...widgets,...retained].slice(0,8);
      for(const widget of settings.customPanels)if(widget.type==='notes'&&currentNotes.has(widget.id))widget.notes=currentNotes.get(widget.id);
      settings.showNow=mod.showNow!==false&&panelConfig('now').visible!==false;
      for(const id of ['navigation','now','player'])settings[`${id}Dock`]=panelConfig(id).zone;
      applyLayout();saveState();if($('#settingsDialog').open)renderSettings();return;
    }
    const def=buildDefaultPresetState(name);
    for(const id of panelIds()){const p=panelConfig(id);p.collapsed=false;p.visible=['navigation','now','player'].includes(id);}
    for(const [id,cfg] of Object.entries(def.panels)){
      const r=panelConfig(id);Object.assign(r,cfg);setPanelZone(id,cfg.zone);
    }
    settings.showNow=def.showNow;
    for(const w of def.widgets){
      const id=settings.customPanels.find(p=>p.type===w.type)?.id||addCustomPanel(w.type,'');
      if(id){const r=panelConfig(id);Object.assign(r,{zone:w.zone,visible:true,collapsed:false,w:w.w,h:w.h,order:w.order});}
    }
    applyLayout();saveState();if($('#settingsDialog').open)renderSettings();
  }
  function cascadeFloatingPanels(){
    const space=workspaceSize();let idx=0;
    for(const id of panelIds()){
      const r=panelConfig(id);if(!r.visible)continue;
      setPanelZone(id,'float');r.collapsed=false;
      r.w=id==='player'?Math.min(600,space.w-40):Math.min(300,space.w-40);
      r.h=id==='player'?136:Math.min(420,space.h-60);
      r.x=clamp(24+idx*34,8,Math.max(8,space.w-r.w-12));
      r.y=clamp(24+idx*30,8,Math.max(8,space.h-r.h-12));
      r.order=idx++;
    }
    applyLayout(true);saveState();if($('#settingsDialog').open)renderSettings();
  }
  function tileFloatingPanels(){
    const space=workspaceSize(),visible=panelIds().filter(id=>panelConfig(id).visible);if(!visible.length)return;
    const cols=Math.min(3,Math.max(1,Math.ceil(Math.sqrt(visible.length)))),rows=Math.ceil(visible.length/cols);
    const gap=settings.workspaceGap||12,cellW=Math.floor((space.w-gap*(cols+1))/cols),cellH=Math.floor((space.h-gap*(rows+1))/rows);
    visible.forEach((id,i)=>{
      const r=panelConfig(id),col=i%cols,row=Math.floor(i/cols);
      setPanelZone(id,'float');r.collapsed=false;
      r.x=gap+col*(cellW+gap);r.y=gap+row*(cellH+gap);
      r.w=clamp(cellW,180,space.w-16);r.h=clamp(cellH,96,space.h-16);r.order=i;
    });
    applyLayout(true);saveState();if($('#settingsDialog').open)renderSettings();
  }
  function panelWidget(id){const custom=settings.customPanels.find(p=>p.id===id),r=panelConfig(id);return custom|| (r.content&&r.content!=='native'?{id,type:r.content,title:r.name,notes:r.notes||''}:null);}
  function activeWidgets(){return panelIds().map(panelWidget).filter(Boolean);}
  function widgetBody(panel){return panel.classList.contains('widget-panel')?$('.panel-content',panel):$('.panel-replacement',panel);}
  function syncPanelElements(){
    const ids=panelIds();$$('.widget-panel').forEach(panel=>{if(!ids.includes(panel.dataset.panel)){const canvas=$('canvas',panel);if(canvas)resizeObserver?.unobserve(canvas);panel.remove();}});
    for(const widget of settings.customPanels){let panel=$(`[data-panel="${widget.id}"]`);if(!panel){panel=document.createElement('aside');panel.className='panel widget-panel';panel.dataset.panel=widget.id;$('#floatingPanels').append(panel);}}
    for(const id of ids){const panel=$(`[data-panel="${id}"]`);if(!panel)continue;preparePanel(panel,id);const widget=panelWidget(id);
      if(!id.startsWith('widget-')){const native=$('.panel-content:not(.panel-replacement)',panel);let replacement=$('.panel-replacement',panel);if(widget&&!replacement){replacement=document.createElement('div');replacement.className='panel-content panel-replacement';panel.append(replacement);}native.hidden=!!widget;if(replacement)replacement.hidden=!widget;}
      panel.dataset.widget=widget?.type||'native';renderPanelHead(panel,id);
    }refreshWidgets();
  }
  function panelLiveSliderHTML(id,prop,labelKey,min,max,step,val,unit='px'){
    return `<label class="panel-live-slider"><span>${escapeHTML(t(labelKey))} <output data-panel-out="${id}:${prop}">${Math.round(val*10)/10}${unit}</output></span><input type="range" data-panel-slider="${id}" data-prop="${prop}" data-unit="${unit}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
  }
  function panelShapeChipsHTML(id,currentShape){
    return `<div class="shape-chips">${[['inherit','inheritStyle'],['standard','shapeCustom'],['pill','shapePill'],['sharp','shapeBrutalist'],['sketch','shapeDrawn']].map(([val,label])=>`<button type="button" class="shape-chip" data-action="setPanelShape" data-id="${id}" data-value="${val}" aria-pressed="${(currentShape||'inherit')===val}">${escapeHTML(t(label))}</button>`).join('')}</div>`;
  }
  function showPanelEditor(id){
    const r=panelConfig(id),widget=settings.customPanels.find(p=>p.id===id),kind=widget?.type||r.content||'native',p=resolvedColors(),space=workspaceSize();
    panelEditBackup={id,record:structuredClone(r),widgetType:widget?.type};
    const fields=`<p class="settings-intro">${escapeHTML(panelTitle(id))}</p>`+textField('name','panelTitle',r.name||widget?.title||'')+`<label>${t('panelType')}<select name="content" data-panel-live-select="${id}">${[...(!widget?['native']:[]),...WIDGET_TYPES].map(type=>`<option value="${type}" ${kind===type?'selected':''}>${type==='native'?t('nativeContent'):t(type)}</option>`).join('')}</select></label>`+
      `<label>${t('panelPosition')}<select name="zone" data-panel-live-zone="${id}">${PANEL_ZONES.map(zone=>`<option value="${zone}" ${r.zone===zone?'selected':''}>${t(zone==='float'?'floating':zone)}</option>`).join('')}</select></label><div class="panel-edit-toggles"><label class="form-check"><input name="visible" type="checkbox" data-panel-live-check="${id}:visible" ${r.visible?'checked':''}>${t('panelVisible')}</label><label class="form-check"><input name="header" type="checkbox" data-panel-live-check="${id}:header" ${r.header!==false?'checked':''}>${t('panelHeader')}</label></div>`+
      `<details class="studio-details" open><summary>${t('advancedSize')}</summary>`+
      `<div class="panel-live-sliders">`+
      panelLiveSliderHTML(id,'w','panelWidth',180,Math.max(600,space.w-16),2,Math.round(r.w),'px')+
      panelLiveSliderHTML(id,'h','panelHeight',80,Math.max(600,space.h-16),2,Math.round(r.h),'px')+
      panelLiveSliderHTML(id,'radius','roundness',0,44,1,r.radius??settings.radius,'px')+
      panelLiveSliderHTML(id,'borderWidth','panelBorderWidth',0,6,0.5,r.borderWidth??settings.borderWidth,'px')+
      panelLiveSliderHTML(id,'opacity','panelOpacity',30,100,1,r.opacity??settings.surfaceOpacity,'%')+
      panelLiveSliderHTML(id,'padding','panelPadding',4,32,1,r.padding??settings.panelPadding,'px')+
      panelLiveSliderHTML(id,'scale','panelScale',80,125,1,r.scale??100,'%')+
      (r.zone==='float'?panelLiveSliderHTML(id,'x','left',0,Math.max(100,space.w-180),2,Math.round(r.x),'px')+panelLiveSliderHTML(id,'y','top',0,Math.max(100,space.h-100),2,Math.round(r.y),'px'):'')+
      `</div>`+
      `<label>${t('panelShape')}</label>${panelShapeChipsHTML(id,r.shape)}`+
      `<label>${t('spectrumStyle')}<select name="spectrumStyle"><option value="">${t('inheritStyle')}</option>${SPECTRUM_STYLES.map(type=>`<option value="${type}" ${r.spectrumStyle===type?'selected':''}>${t(type)}</option>`).join('')}</select></label></details>`+
      `<details class="studio-details" open><summary>${t('panelStyle')}</summary><label class="form-check"><input type="checkbox" name="themeColor" ${!r.color&&!r.ink&&!r.line&&r.radius==null?'checked':''}>${t('inheritStyle')}</label><div class="colors-grid">${[['color','panelColor',p.surface],['ink','panelText',p.text],['line','panelBorder',p.outline]].map(([name,label,fallback])=>`<label class="color-row"><span>${t(label)}</span><input type="color" name="${name}" data-panel-live-color="${id}:${name}" value="${r[name]||fallback}"></label>`).join('')}</div><div id="panelPhotoEditor">${backgroundEditorHTML(id)}</div></details>`;
    openForm(t('panelOptions'),fields,form=>{
      panelEditBackup=null;
      const inherit=form.has('themeColor'),type=String(form.get('content'));r.name=String(form.get('name')||'').trim().slice(0,70);r.visible=form.has('visible');r.header=form.has('header');
      if(inherit){r.color='';r.ink='';r.line='';r.radius=null;r.borderWidth=null;r.opacity=null;r.shape='inherit';}
      else{r.color=safeColor(form.get('color'));r.ink=safeColor(form.get('ink'));r.line=safeColor(form.get('line'));}
      r.spectrumStyle=SPECTRUM_STYLES.includes(form.get('spectrumStyle'))?form.get('spectrumStyle'):'';
      if(widget&&WIDGET_TYPES.includes(type))widget.type=type;else if(!widget)r.content=WIDGET_TYPES.includes(type)?type:'native';if(type!==kind&&type!=='native'&&r.h<220)r.h=260;
      if(id==='now')settings.showNow=r.visible;setPanelZone(id,form.get('zone'));applyLayout();renderAll();if($('#settingsDialog').open)renderSettings();saveState();
    });$('#editFields').dataset.panel=id;$$('input[type="range"]', $('#editFields')).forEach(rangeFill);void loadPhotoThumbnails();
  }
  function layoutMiniHTML(panels){return `<div class="layout-mini" aria-hidden="true"><i class="mini-library"></i>${Object.entries(panels).filter(([,p])=>p.visible!==false).slice(0,11).map(([id,p],i)=>`<i class="mini-zone mini-zone-${p.zone||'float'}" style="--order:${i};${p.color?`background:${safeColor(p.color)}`:''}"></i>`).join('')}</div>`;}
  function panelSettingsHTML(){
    const space=workspaceSize();
    return rescueResetBarHTML()+`<div class="studio-help">${icon('move')}<div><strong>${t('editLayout')}</strong><p>${t('panelHelp')}</p></div><div class="settings-buttons" style="margin:0"><button class="button primary" data-action="layoutFromSettings">${icon('move')}${t('editLayout')}</button><button class="button secondary" data-action="gigaSettings">${icon('sliders')}${t('gigaCustom')}</button></div></div>`+
      `<div class="studio-section-title"><h4>${t('layoutPresets')}</h4><div class="settings-buttons" style="margin:0">${settingButton('addPanel','addPanel')}${settingButton('saveLayout','saveLayout')}</div></div>`+
      `<div class="workspace-presets-grid">${WORKSPACE_PRESET_META.map(([id,labelKey,descKey])=>{const info=getWorkspacePresetPreview(id);return `<article class="workspace-preset-card ${info.modified?'is-modified':''}"><button class="workspace-preset-main" data-action="workspacePreset" data-value="${id}">${layoutMiniHTML(info.panels)}<div class="workspace-preset-info"><strong><span>${escapeHTML(info.name)}</span>${info.modified?`<span class="preset-badge">${t('modifiedBadge')}</span>`:''}</strong><small>${escapeHTML(t(descKey))}</small></div></button><div class="workspace-preset-actions"><button data-action="saveIntoLayoutPreset" data-id="${id}" title="${escapeHTML(t('saveIntoPreset'))}">${t('saveIntoPreset')}</button><button data-action="renameLayoutPreset" data-id="${id}">${t('rename')}</button>${info.modified?`<button data-action="resetLayoutPreset" data-id="${id}">${t('resetPreset')}</button>`:''}</div></article>`;}).join('')}</div>`+
      group('globalGeometry',
        settingToggle('peekOnSlider','peekOnSlider','peekOnSliderDesc')+
        settingRange('workspaceGap','workspaceGap',0,32,1,'px')+
        settingRange('workspaceMargin','workspaceMargin',0,36,1,'px')+
        settingRange('radius','roundness',0,44,1,'px')+
        settingRange('borderWidth','borderWidth',0,6,0.5,'px')+
        settingRange('shadow','shadows',0,24,1,'px')+
        settingRange('surfaceOpacity','surfaceOpacity',settings.autoContrast?60:35,100,1,'%')+
        settingRange('glassBlur','glassBlur',0,24,1,'px')
      )+
      `<div class="panel-cards">`+
      panelIds().map(id=>{const r=panelConfig(id),widget=panelWidget(id),symbol={queue:'list',spectrum:'music',equalizer:'settings',notes:'edit',quickActions:'layout',miniPlayer:'play',artworkPanel:'disc',photoPanel:'image'}[widget?.type]||{navigation:'library',now:'disc',player:'play'}[id];return `<article class="panel-card ${r.visible?'':'panel-is-hidden'}"><div class="panel-card-title"><span class="panel-type-icon">${icon(symbol||'layout')}</span><div><strong>${escapeHTML(panelTitle(id))}</strong><small>${t(widget?.type||'nativeContent')}</small></div><button class="button secondary small" data-action="panelVisibility" data-id="${id}">${t(r.visible?'hide':'show')}</button></div><div class="panel-positions">${PANEL_ZONES.map(zone=>`<button data-action="panelDockPosition" data-id="${id}" data-value="${zone}" aria-pressed="${r.zone===zone}">${t(zone==='float'?'floating':zone)}</button>`).join('')}</div>`+
      `<div class="panel-live-sliders">`+
      panelLiveSliderHTML(id,'w','panelWidth',180,Math.max(600,space.w-16),2,Math.round(r.w),'px')+
      panelLiveSliderHTML(id,'h','panelHeight',80,Math.max(600,space.h-16),2,Math.round(r.h),'px')+
      panelLiveSliderHTML(id,'radius','roundness',0,44,1,r.radius??settings.radius,'px')+
      panelLiveSliderHTML(id,'opacity','panelOpacity',30,100,1,r.opacity??settings.surfaceOpacity,'%')+
      `</div>`+
      panelShapeChipsHTML(id,r.shape)+
      `<div class="panel-card-footer"><button class="button secondary" data-action="pinPanel" data-id="${id}">${icon(r.pinned?'lock':'unlock')}${t(r.pinned?'unpinPanel':'pinPanel')}</button><button class="button secondary" data-action="panelOptions" data-id="${id}">${icon('settings')}${t('edit')}</button><button class="button secondary" data-action="collapsePanel" data-id="${id}">${t(r.collapsed?'panelExpand':'panelCollapse')}</button>${id.startsWith('widget-')?`<button class="text-button" data-action="removePanel" data-id="${id}">${t('panelRemove')}</button>`:''}</div></article>`;}).join('')+`</div>`+
      (settings.savedLayouts.length?group('savedLayouts',`<div class="layout-gallery">${settings.savedLayouts.map(item=>`<article class="saved-layout-card"><button data-action="loadLayout" data-id="${escapeHTML(item.id)}">${layoutMiniHTML(item.panels)}<strong>${escapeHTML(item.name)}</strong><span>${t('useTheme')} →</span></button><button class="text-button" data-action="deleteLayout" data-id="${escapeHTML(item.id)}">${t('panelRemove')}</button></article>`).join('')}</div>`):'')+
      `<details class="studio-details" open><summary>${t('advanced')}</summary>${settingToggle('snapPanels','snapPanels','snapPanelsDesc')}${settingToggle('panelsLocked','panelsLocked','panelsLockedDesc')}<div class="settings-buttons"><button class="button secondary" data-action="cascadePanels">${icon('float')}${t('cascadePanels')}</button><button class="button secondary" data-action="tilePanels">${icon('grid')}${t('tilePanels')}</button>${settingButton('restorePanels','restoreContent')}${settingButton('resetLayout','resetLayout')}</div>${note('restoreContentHint')}</details>`;
  }
  function activeCSSVariablesText(){
    const p=resolvedColors();
    return `:root {
  --bg: ${p.bg};
  --surface: ${p.surface};
  --sidebar: ${p.sidebar};
  --player: ${p.player};
  --text: ${p.text};
  --accent: ${p.accent};
  --visualizer: ${p.visualizer};
  --outline: ${p.outline};
  --radius: ${settings.radius}px;
  --panel-shape: ${computeShapeCSS({})};
  --workspace-gap: ${settings.workspaceGap}px;
  --workspace-margin: ${settings.workspaceMargin}px;
  --border-width: ${settings.borderWidth}px;
  --border-style: ${settings.borderStyle};
  --glass-blur: ${settings.glassBlur}px;
  --surface-opacity: ${settings.surfaceOpacity}%;
  --motion: ${settings.motionDuration}ms;
}`;
  }
  function gigaSettingsHTML(){
    return `<h3>${t('gigaCustom')}</h3><p class="settings-intro">${t('gigaIntro')}</p>${rescueResetBarHTML()}`+
      `<div class="giga-banner"><div><strong>⚡ ${t('gigaCustom')}</strong><p>${t('peekOnSliderDesc')}</p></div><div class="settings-buttons" style="margin:0"><button class="button primary" data-action="randomTheme">${icon('dice')}${t('randomTheme')}</button><button class="button secondary" data-action="cascadePanels">${icon('float')}${t('cascadePanels')}</button><button class="button secondary" data-action="tilePanels">${icon('grid')}${t('tilePanels')}</button></div></div>`+
      group('globalGeometry',
        settingToggle('peekOnSlider','peekOnSlider','peekOnSliderDesc')+
        settingRange('workspaceGap','workspaceGap',0,32,1,'px')+
        settingRange('workspaceMargin','workspaceMargin',0,36,1,'px')+
        settingRange('topbarHeight','topbarHeight',52,108,2,'px')+
        settingRange('panelPadding','panelPadding',6,32,1,'px')+
        settingRange('headerHeight','headerHeight',24,50,1,'px')+
        settingRange('gridSize','gridSize',1,32,1,'px')+
        settingRange('snapDistance','snapDistance',0,32,1,'px')+
        settingToggle('showGrid','showGrid')+
        settingToggle('showSnapGuides','showSnapGuides')+
        settingToggle('showSizeHud','showSizeHud')
      )+
      group('panelStyle',
        settingSelect('shapeProfile','shapeProfile',[['custom',t('shapeCustom')],['drawn',t('shapeDrawn')],['pill',t('shapePill')],['brutalist',t('shapeBrutalist')],['cyber',t('shapeCyber')]])+
        settingRange('radius','roundness',0,44,1,'px')+
        settingToggle('use4Corners','use4Corners')+
        `<div class="corners-4-grid" ${settings.use4Corners?'':'hidden'}>`+
        settingRange('cornerTL','cornerTL',0,48,1,'px')+
        settingRange('cornerTR','cornerTR',0,48,1,'px')+
        settingRange('cornerBR','cornerBR',0,48,1,'px')+
        settingRange('cornerBL','cornerBL',0,48,1,'px')+
        `</div>`+
        settingSelect('borderStyle','borderStyle',[['solid',t('solid')],['dashed',t('dashed')],['dotted',t('dotted')],['double',t('double')],['none',t('none')]])+
        settingRange('borderWidth','borderWidth',0,6,0.5,'px')+
        settingRange('shadow','shadows',0,24,1,'px')+
        settingRange('surfaceOpacity','surfaceOpacity',settings.autoContrast?60:35,100,1,'%')+
        settingRange('glassBlur','glassBlur',0,24,1,'px')
      )+
      group('typographyPhysics',
        settingSelect('fontFamily','fontFamily',[['default',t('fontDefault')],['sans',t('fontSans')],['mono',t('fontMono')],['serif',t('fontSerif')],['rounded',t('fontRounded')]])+
        settingRange('fontScale','textScale',80,130,2,'%')+
        settingRange('letterSpacing','letterSpacing',-10,20,1,'×0.1px')+
        settingSelect('motionCurve','motionCurve',[['spring',t('curveSpring')],['smooth',t('curveSmooth')],['snappy',t('curveSnappy')],['linear',t('curveLinear')]])+
        settingRange('motionDuration','motionDuration',0,600,20,' ms')+
        settingToggle('dragTilt','dragTilt')+
        settingToggle('activePanelGlow','activePanelGlow')
      )+
      group('customCSSHeading',
        `<p class="setting-description">${t('customCSSHint')}</p><textarea id="customCSSInput" class="custom-css-box" placeholder="/* Например: .panel { border-radius: 28px 8px; } */" spellcheck="false">${escapeHTML(settings.customCSS||'')}</textarea>`+
        `<div class="settings-buttons" style="margin-top:10px"><button class="button secondary" data-action="copyCSSVars">${icon('copy')}${t('copyCSSVars')}</button></div>`+
        `<pre id="cssVarsPreview" class="css-vars-preview">${escapeHTML(activeCSSVariablesText())}</pre>`
      );
  }
  function renderSnapGuides(linesX=[],linesY=[]){
    const host=$('#snapGuides');if(!host)return;
    if(!settings.showSnapGuides||(!linesX.length&&!linesY.length)){host.hidden=true;host.innerHTML='';return;}
    host.hidden=false;
    host.innerHTML=linesX.map(x=>`<div class="snap-line-x" style="left:${Math.round(x)}px"></div>`).join('')+linesY.map(y=>`<div class="snap-line-y" style="top:${Math.round(y)}px"></div>`).join('');
  }
  function updatePanelHud(x,y,text){
    const hud=$('#panelHud');if(!hud)return;
    if(!settings.showSizeHud||!text){hud.hidden=true;return;}
    hud.hidden=false;hud.textContent=text;
    const space=workspaceSize();
    hud.style.left=`${clamp(x,64,space.w-64)}px`;
    hud.style.top=`${clamp(y,28,space.h-16)}px`;
  }
  function snapPanelPosition(rect,space,neighbors,enabled){
    let r={...rect};const linesX=[],linesY=[];
    if(enabled){
      const step=Math.max(1,settings.gridSize||8),dist=settings.snapDistance??12;
      r.x=Math.round(r.x/step)*step;r.y=Math.round(r.y/step)*step;
      const gap=settings.workspaceGap||12;
      const xs=[8,space.w-r.w-8,Math.round((space.w-r.w)/2)],ys=[8,space.h-r.h-8,Math.round((space.h-r.h)/2)];
      for(const other of neighbors){
        xs.push(other.x,other.x+other.w+gap,other.x-r.w-gap,other.x+other.w-r.w);
        ys.push(other.y,other.y+other.h+gap,other.y-r.h-gap,other.y+other.h-r.h);
      }
      const near=(n,values)=>values.reduce((best,v)=>Math.abs(n-v)<Math.abs(n-best)&&Math.abs(n-v)<=dist?v:best,n+dist+99);
      const sx=near(r.x,xs),sy=near(r.y,ys);
      if(Math.abs(r.x-sx)<=dist){r.x=sx;linesX.push(sx===Math.round((space.w-r.w)/2)?space.w/2:sx);}
      if(Math.abs(r.y-sy)<=dist){r.y=sy;linesY.push(sy===Math.round((space.h-r.h)/2)?space.h/2:sy);}
    }
    renderSnapGuides(linesX,linesY);
    return fitPanelRect(r,space);
  }
  function detectDockTarget(x,y,altKey){
    if(altKey||narrowWindow?.matches)return null;const workspace=$('#workspace').getBoundingClientRect(),localX=x-workspace.left,localY=y-workspace.top;const node=document.elementFromPoint(x,y);const explicit=node?.closest('[data-target]');let zone=explicit?.dataset.target||null;
    if(!zone){if(localX<52)zone='left';else if(localX>workspace.width-52)zone='right';else if(localY<44)zone='top';else if(localY>workspace.height-44)zone='bottom';else zone=node?.closest('.dock')?.dataset.zone||null;}
    if(!zone)return null;
    const dock=$(`#dock-${zone}`),panels=[...dock.children].filter(panel=>!panel.hidden&&panel.dataset.panel!==panelDrag.id),vertical=zone==='left'||zone==='right';const coordinate=vertical?y:x;
    let index=panels.findIndex(panel=>{const box=panel.getBoundingClientRect();return coordinate<(vertical?box.top+box.height/2:box.left+box.width/2);});if(index<0)index=panels.length;
    return {zone,index,ids:panels.map(panel=>panel.dataset.panel)};
  }
  function showDockPreview(target){
    const preview=$('#dockPreview');$$('.dock-target').forEach(node=>node.classList.toggle('over',node.dataset.target===target?.zone));
    if(!target){preview.hidden=true;return;}
    const {zone,index,ids}=target,space=workspaceSize(),dock=$(`#dock-${zone}`),area=$('#workspace').getBoundingClientRect(),box=dock.getBoundingClientRect();let rect;
    if(zone==='left'||zone==='right'){const w=box.width||Math.min(panelConfig(panelDrag.id).w,300),h=space.h/(ids.length+1);rect={x:zone==='left'?0:space.w-w,y:index*h,w,h};}
    else{const h=box.height||130,w=space.w/(ids.length+1);rect={x:index*w,y:zone==='top'?0:space.h-h,w,h};}
    if(box.width&&box.height&&ids.length){const before=ids[index]&&$(`[data-panel="${ids[index]}"]`).getBoundingClientRect();if(before){if(zone==='left'||zone==='right'){rect.y=before.top-area.top;rect.h=Math.max(60,before.height*.6);}else{rect.x=before.left-area.left;rect.w=Math.max(100,before.width*.6);}}}
    preview.hidden=false;Object.assign(preview.style,{left:`${rect.x}px`,top:`${rect.y}px`,width:`${rect.w}px`,height:`${rect.h}px`});$('#dockPreviewLabel').textContent=`${t('panelDrop')} · ${t(zone)}`;
  }
  function endPanelDrag(cancel=true){
    cancelAnimationFrame(panelFrame);panelFrame=0;const drag=panelDrag;panelDrag=null;
    if(drag){const panel=$(`[data-panel="${drag.id}"]`);if(panel){panel.classList.remove('dragging-panel','resizing-panel');panel.style.removeProperty('--drag-tilt');}if(cancel&&drag.moved){settings.panelLayout[drag.id]=drag.original;if(['navigation','now','player'].includes(drag.id))settings[`${drag.id}Dock`]=drag.original.zone;applyLayout();}try{$('#workspace').releasePointerCapture(drag.pointerId);}catch{/* Pointer already released. */}}
    $('#dockTargets').hidden=true;$('#dockPreview').hidden=true;renderSnapGuides();updatePanelHud(0,0,'');document.body.classList.remove('panel-drag-active');$$('.dock-target').forEach(node=>node.classList.remove('over'));
  }
  document.addEventListener('pointerdown',event=>{
    const panel=event.target.closest('.panel.is-floating');if(panel)panel.style.zIndex=String(++floatZ);
    const resize=event.target.closest('[data-resize]'),head=event.target.closest('[data-drag]');if(!resize&&!head)return;
    if(event.button!==0||settings.panelsLocked||(!resize&&event.target.closest('button,input,select,textarea,a')))return;
    const id=resize?.dataset.resize||head.dataset.drag,element=$(`[data-panel="${id}"]`);if(!element||panelConfig(id).pinned)return;
    const box=element.getBoundingClientRect(),area=$('#workspace').getBoundingClientRect();
    event.preventDefault();element.getAnimations?.().forEach(animation=>animation.cancel());
    panelDrag={id,mode:resize?'resize':'move',edge:resize?.dataset.edge||'',pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,lastX:event.clientX,grabRatioX:(event.clientX-box.left)/Math.max(1,box.width),grabOffsetY:event.clientY-box.top,original:structuredClone(panelConfig(id)),rect:{x:box.left-area.left,y:box.top-area.top,w:box.width,h:box.height},moved:false,target:null,event:null};
    $('#workspace').setPointerCapture?.(event.pointerId);if(!resize&&head.focus)head.focus({preventScroll:true});
  });
  function updatePanelPointer(event){
    const drag=panelDrag;if(!drag)return;const dx=event.clientX-drag.startX,dy=event.clientY-drag.startY;if(!drag.moved&&Math.hypot(dx,dy)<7)return;
    const panel=$(`[data-panel="${drag.id}"]`),record=panelConfig(drag.id),space=workspaceSize(),area=$('#workspace').getBoundingClientRect();
    if(!drag.moved){
      drag.moved=true;document.body.classList.add('panel-drag-active');
      if(drag.mode==='move'){
        const wasDocked=record.zone!=='float';
        setPanelZone(drag.id,'float');
        const floatW=wasDocked?clamp(drag.original.w||drag.rect.w,200,Math.min(680,space.w-24)):drag.rect.w;
        const floatH=wasDocked?clamp(drag.original.h||drag.rect.h,118,Math.min(580,space.h-24)):drag.rect.h;
        drag.rect={x:event.clientX-area.left-floatW*clamp(drag.grabRatioX,.15,.85),y:event.clientY-area.top-clamp(drag.grabOffsetY,12,32),w:floatW,h:floatH};
        Object.assign(record,drag.rect);record.collapsed=drag.original.collapsed;applyLayout(false);panel.classList.add('dragging-panel');$('#dockTargets').hidden=!!narrowWindow?.matches;panel.style.zIndex=String(++floatZ);
      }else panel.classList.add('resizing-panel');
    }
    if(drag.mode==='resize'){
      if(record.zone==='float'){
        let {x,y,w,h}=drag.rect;const minW=180,minH=84;
        if(drag.edge.includes('e'))w=clamp(drag.rect.w+dx,minW,space.w-x-6);
        if(drag.edge.includes('s'))h=clamp(drag.rect.h+dy,minH,space.h-y-6);
        if(drag.edge.includes('w')){const cdx=clamp(dx,6-drag.rect.x,drag.rect.w-minW);x=drag.rect.x+cdx;w=drag.rect.w-cdx;}
        if(drag.edge.includes('n')){const cdy=clamp(dy,6-drag.rect.y,drag.rect.h-minH);y=drag.rect.y+cdy;h=drag.rect.h-cdy;}
        if(settings.snapPanels&&!event.altKey){const step=Math.max(1,settings.gridSize||8);if(drag.edge.includes('e')||drag.edge.includes('w'))w=Math.round(w/step)*step;if(drag.edge.includes('s')||drag.edge.includes('n'))h=Math.round(h/step)*step;}
        const next=fitPanelRect({x,y,w,h},space);
        Object.assign(record,next);
        panel.style.width=`${next.w}px`;panel.style.height=`${next.h}px`;panel.style.transform=`translate3d(${next.x}px,${next.y}px,0)`;
        panel.classList.toggle('compact-player',drag.id==='player'&&next.w<640);
        updatePanelHud(next.x+next.w/2,next.y,`${Math.round(next.w)} × ${Math.round(next.h)} px`);
      }else{
        const zone=record.zone;
        if(zone==='left'){
          if(drag.edge.includes('e')||drag.edge.includes('w')){const nw=clamp(drag.rect.w+(drag.edge.includes('e')?dx:-dx),180,580);[...$('#dock-left').children].forEach(p=>{panelConfig(p.dataset.panel).w=nw;});}
          if(drag.edge.includes('s')||drag.edge.includes('n'))record.h=clamp(drag.rect.h+(drag.edge.includes('s')?dy:-dy),90,900);
        }else if(zone==='right'){
          if(drag.edge.includes('w')||drag.edge.includes('e')){const nw=clamp(drag.rect.w+(drag.edge.includes('w')?-dx:dx),180,580);[...$('#dock-right').children].forEach(p=>{panelConfig(p.dataset.panel).w=nw;});}
          if(drag.edge.includes('s')||drag.edge.includes('n'))record.h=clamp(drag.rect.h+(drag.edge.includes('s')?dy:-dy),90,900);
        }else if(zone==='top'){
          if(drag.edge.includes('s')||drag.edge.includes('n')){const nh=clamp(drag.rect.h+(drag.edge.includes('s')?dy:-dy),56,Math.round(space.h*.48));[...$('#dock-top').children].forEach(p=>{panelConfig(p.dataset.panel).h=nh;});}
          if(drag.edge.includes('e')||drag.edge.includes('w'))record.w=clamp(drag.rect.w+(drag.edge.includes('e')?dx:-dx),180,1200);
        }else if(zone==='bottom'){
          if(drag.edge.includes('n')||drag.edge.includes('s')){const nh=clamp(drag.rect.h+(drag.edge.includes('n')?-dy:dy),82,Math.round(space.h*.48));[...$('#dock-bottom').children].forEach(p=>{panelConfig(p.dataset.panel).h=nh;});}
          if(drag.edge.includes('e')||drag.edge.includes('w'))record.w=clamp(drag.rect.w+(drag.edge.includes('e')?dx:-dx),180,1200);
        }
        applyLayout(false);
        const b=panel.getBoundingClientRect();
        updatePanelHud(b.left-area.left+b.width/2,b.top-area.top,`${t(zone)} · ${Math.round(b.width)} × ${Math.round(b.height)} px`);
      }
      resizeSpectrum();return;
    }
    const vx=clamp((event.clientX-(drag.lastX||event.clientX))*0.35,-6,6);drag.lastX=event.clientX;
    const neighbors=$$('.panel.is-floating').filter(node=>node!==panel&&!node.hidden).map(node=>{const r=node.getBoundingClientRect(),origin=$('#workspace').getBoundingClientRect();return {x:r.left-origin.left,y:r.top-origin.top,w:r.width,h:r.height};});
    const rawX=event.clientX-area.left-drag.rect.w*clamp(drag.grabRatioX,.15,.85),rawY=event.clientY-area.top-clamp(drag.grabOffsetY,12,32);
    const next=snapPanelPosition({...drag.rect,x:rawX,y:rawY},space,neighbors,settings.snapPanels&&!event.altKey);record.x=next.x;record.y=next.y;record.w=next.w;record.h=drag.original.collapsed?drag.original.h:next.h;
    const tilt=settings.dragTilt&&settings.animations?` rotate(${vx.toFixed(2)}deg) scale(1.012)`:'';
    panel.style.transform=`translate3d(${next.x}px,${next.y}px,0)${tilt}`;
    panel.style.pointerEvents='none';drag.target=detectDockTarget(event.clientX,event.clientY,event.altKey);panel.style.pointerEvents='';
    showDockPreview(drag.target);
    updatePanelHud(next.x+next.w/2,next.y,drag.target?`${t('panelDrop')}: ${t(drag.target.zone)}`:`${Math.round(next.w)} × ${Math.round(next.h)} px · X:${Math.round(next.x)} Y:${Math.round(next.y)}`);
  }
  document.addEventListener('pointermove',event=>{if(!panelDrag)return;panelDrag.event={clientX:event.clientX,clientY:event.clientY,altKey:event.altKey};if(!panelFrame)panelFrame=requestAnimationFrame(()=>{panelFrame=0;if(panelDrag?.event)updatePanelPointer(panelDrag.event);});});
  document.addEventListener('pointerup',event=>{
    document.querySelectorAll('dialog.dialog-peek').forEach(d=>d.classList.remove('dialog-peek'));
    if(!panelDrag)return;cancelAnimationFrame(panelFrame);panelFrame=0;if(panelDrag.event)updatePanelPointer({clientX:event.clientX,clientY:event.clientY,altKey:event.altKey});
    const drag=panelDrag;if(drag.moved){if(drag.mode==='move'&&drag.target){const {zone,index,ids}=drag.target;setPanelZone(drag.id,zone);ids.splice(index,0,drag.id);ids.forEach((id,i)=>panelConfig(id).order=i);}
      endPanelDrag(false);applyLayout(true);saveState();if($('#settingsDialog').open&&settingsTab==='layout')renderSettings();
    }else endPanelDrag(false);
  });
  document.addEventListener('pointercancel',()=>{document.querySelectorAll('dialog.dialog-peek').forEach(d=>d.classList.remove('dialog-peek'));endPanelDrag(true);});
  document.addEventListener('keydown',event=>{
    if(panelDrag&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();endPanelDrag(true);return;}
    const head=event.target.closest('.panel-head');if(!head||event.target!==head)return;
    if(event.key==='Enter'){event.preventDefault();event.stopImmediatePropagation();showPanelEditor(head.dataset.drag);return;}
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();event.stopImmediatePropagation();if(settings.panelsLocked)return;
    const id=head.dataset.drag,r=panelConfig(id);if(r.pinned)return;if(r.zone!=='float')setPanelZone(id,'float');const step=event.shiftKey?1:(settings.gridSize||16);r.x+=event.key==='ArrowRight'?step:event.key==='ArrowLeft'?-step:0;r.y+=event.key==='ArrowDown'?step:event.key==='ArrowUp'?-step:0;Object.assign(r,fitPanelRect(r,workspaceSize()));applyLayout();$(`[data-panel="${id}"] .panel-head`)?.focus({preventScroll:true});saveState();
  });


  // ============================================================================
  // LIQUID S-CURVE WAVE THEME TRANSITION (VIDEO REFERENCE MATCH)
  // ============================================================================
  let themeTransitionLock = false;
  function buildWavePolygonString(p, toDark = true, n = 38) {
    const pts = ['100% 0%', '100% 100%'];
    const amp = 17.5 * Math.sin(p * Math.PI);
    const phase = (1.0 - p) * 0.55;
    for (let i = n; i >= 0; i--) {
      const v = i / n;
      const y = (v * 100).toFixed(2);
      const lag = 26.0 * Math.pow(v, 1.15) + 18.0 * Math.pow(v, 2.5);
      const baseX = 105.0 - p * 158.0 + lag;
      const sWave = -amp * Math.sin(v * Math.PI * 2.05 - phase) * (1.0 - 0.15 * v);
      const rawX = clamp(baseX + sWave, 0, 100);
      pts.push(`${rawX.toFixed(2)}% ${y}%`);
    }
    return `polygon(${pts.join(',')})`;
  }

  function runThemeWaveTransition(mutateThemeFn) {
    if (!settings.animations || globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || themeTransitionLock) {
      mutateThemeFn();
      return;
    }
    const steps = 26;
    const keyframes = [];
    for (let i = 0; i <= steps; i++) {
      keyframes.push({ clipPath: buildWavePolygonString(i / steps) });
    }
    if (typeof document.startViewTransition === 'function') {
      themeTransitionLock = true;
      try {
        const vt = document.startViewTransition(() => {
          mutateThemeFn();
        });
        vt.ready.then(() => {
          const anim = document.documentElement.animate(keyframes, {
            duration: 680,
            easing: 'cubic-bezier(0.22, 0.88, 0.28, 1)',
            pseudoElement: '::view-transition-new(root)'
          });
          anim.onfinish = () => { themeTransitionLock = false; };
          anim.oncancel = () => { themeTransitionLock = false; };
        }).catch(() => {
          themeTransitionLock = false;
        });
        vt.finished.finally(() => { themeTransitionLock = false; });
        return;
      } catch {
        themeTransitionLock = false;
      }
    }
    // Fallback overlay wave for browsers without View Transitions API
    const overlay = $('#themeWaveOverlay');
    if (!overlay) {
      mutateThemeFn();
      return;
    }
    themeTransitionLock = true;
    const oldBg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#edeef3';
    mutateThemeFn();
    const newBg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#080808';
    overlay.style.background = oldBg;
    overlay.hidden = false;
    const reverseKeyframes = [...keyframes].reverse();
    const anim = overlay.animate(reverseKeyframes, {
      duration: 680,
      easing: 'cubic-bezier(0.22, 0.88, 0.28, 1)'
    });
    anim.onfinish = () => {
      overlay.hidden = true;
      overlay.style.background = newBg;
      themeTransitionLock = false;
    };
    anim.oncancel = () => {
      overlay.hidden = true;
      themeTransitionLock = false;
    };
  }

  // ============================================================================
  // SMOOTH DIALOG OPEN & CLOSE ANIMATION ENGINE
  // ============================================================================
  function openDialogAnimated(dialog) {
    if (!dialog) return;
    dialog.classList.remove('is-closing');
    if (!dialog.open) dialog.showModal();
  }

  function closeDialogAnimated(dialog, onDone) {
    if (!dialog || !dialog.open) {
      onDone?.();
      return;
    }
    if (!settings.animations || globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      dialog.classList.remove('is-closing');
      dialog.close();
      onDone?.();
      return;
    }
    if (dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing');
    let finished = false;
    const complete = () => {
      if (finished) return;
      finished = true;
      dialog.classList.remove('is-closing');
      if (dialog.open) dialog.close();
      onDone?.();
    };
    dialog.addEventListener('animationend', e => {
      if (e.target === dialog) complete();
    }, { once: true });
    setTimeout(complete, 270);
  }

  // ============================================================================
  // INTERACTIVE ONBOARDING & APP GUIDE MODAL (#welcomeDialog)
  // ============================================================================
  let currentGuideStep = 0;
  function renderWelcomeGuide() {
    const body = $('#welcomeBody');
    if (!body) return;
    $$('.welcome-step-tab').forEach(tab => {
      const active = Number(tab.dataset.step) === currentGuideStep;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    const prevBtn = $('#guidePrevBtn');
    const nextBtn = $('#guideNextBtn');
    if (prevBtn) prevBtn.hidden = currentGuideStep === 0;
    if (nextBtn) nextBtn.hidden = currentGuideStep === 3;
    const startupCheck = $('#showGuideOnStartup');
    if (startupCheck) startupCheck.checked = !!settings.showGuideOnStartup;
    const langSelect = $('#welcomeLangSelect');
    if (langSelect) {
      langSelect.innerHTML = Object.entries(LANGUAGE_NAMES).map(([code, label]) => `<option value="${escapeHTML(code)}" ${settings.language === code ? 'selected' : ''}>${escapeHTML(label)}</option>`).join('');
      langSelect.value = settings.language;
    }

    let stepHTML = '';
    if (currentGuideStep === 0) {
      stepHTML = `
        <div class="welcome-step-pane">
          <div class="welcome-lang-bar" role="group" aria-label="${escapeHTML(t('language'))}">
            <span class="welcome-lang-bar-label">${icon('globe')}<span>${escapeHTML(t('guideChooseLang'))}</span></span>
            <div class="welcome-lang-pills">
              ${Object.entries(LANGUAGE_NAMES).map(([code, label]) => `<button type="button" class="welcome-lang-pill ${settings.language === code ? 'active' : ''}" data-action="setGuideLang" data-lang="${escapeHTML(code)}" aria-pressed="${settings.language === code}">${escapeHTML(label)}</button>`).join('')}
            </div>
          </div>
          <div class="welcome-hero-banner">
            <div>
              <h3>${escapeHTML(t('guideStep0Title'))}</h3>
              <p class="welcome-desc-main">${escapeHTML(t('guideStep0Desc'))}</p>
              <p class="welcome-wish">${escapeHTML(t('guideStep0Wish'))}</p>
              <div class="welcome-badges">
                <span class="welcome-badge">✳ 100% OFFLINE</span>
                <span class="welcome-badge">FLAC · MP3 · WAV · OGG</span>
                <span class="welcome-badge">8-BAND STUDIO EQ</span>
                <span class="welcome-badge">LIVE MOVABLE PANELS</span>
              </div>
            </div>
            <div class="welcome-art-box" aria-hidden="true">
              <svg class="welcome-art-svg" viewBox="0 0 220 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g stroke="var(--draw-ink)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="16" y="18" width="188" height="128" rx="20" fill="var(--surface)"/>
                  <rect x="30" y="34" width="76" height="96" rx="12" fill="var(--sticker)"/>
                  <circle cx="68" cy="82" r="28" fill="var(--vinyl)"/>
                  <circle cx="68" cy="82" r="9" fill="var(--recordLabel)"/>
                  <rect x="118" y="36" width="72" height="26" rx="8" fill="var(--accent)"/>
                  <rect x="118" y="70" width="72" height="26" rx="8" fill="var(--sleeve)"/>
                  <rect x="118" y="104" width="72" height="26" rx="8" fill="var(--recordLabel)"/>
                  <path d="M128 49h36M128 83h48M128 117h28"/>
                </g>
              </svg>
            </div>
          </div>
          <div class="welcome-grid">
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('headphones')}</span><strong>${escapeHTML(t('guideCard1Title'))}</strong></div>
              <p>${escapeHTML(t('guideCard1Desc'))}</p>
            </article>
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('move')}</span><strong>${escapeHTML(t('guideCard2Title'))}</strong></div>
              <p>${escapeHTML(t('guideCard2Desc'))}</p>
            </article>
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('sliders')}</span><strong>${escapeHTML(t('guideCard3Title'))}</strong></div>
              <p>${escapeHTML(t('guideCard3Desc'))}</p>
            </article>
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('sun')}</span><strong>${escapeHTML(t('guideCard4Title'))}</strong></div>
              <p>${escapeHTML(t('guideCard4Desc'))}</p>
            </article>
          </div>
        </div>`;
    } else if (currentGuideStep === 1) {
      stepHTML = `
        <div class="welcome-step-pane">
          <div class="welcome-hero-banner">
            <div>
              <h3>${escapeHTML(t('guideStep1Title'))}</h3>
              <p>${escapeHTML(t('guideStep1Desc'))}</p>
            </div>
            <div class="welcome-art-box" aria-hidden="true">
              <svg class="welcome-art-svg" viewBox="0 0 220 140" fill="none">
                <g stroke="var(--draw-ink)" stroke-width="2.4" stroke-linecap="round">
                  <rect x="24" y="20" width="172" height="100" rx="18" fill="var(--surface)"/>
                  <path d="M52 92V56m20 36V38m20 54V64m20 28V32m20 60V48m20 44V58m20 34V42" stroke="var(--visualizer)" stroke-width="7"/>
                </g>
              </svg>
            </div>
          </div>
          <div class="welcome-grid">
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('upload')}</span><strong>${escapeHTML(t('guideMusic1Title'))}</strong></div>
              <p>${escapeHTML(t('guideMusic1Desc'))}</p>
            </article>
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('heart')}</span><strong>${escapeHTML(t('guideMusic2Title'))}</strong></div>
              <p>${escapeHTML(t('guideMusic2Desc'))}</p>
            </article>
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('settings')}</span><strong>${escapeHTML(t('guideMusic3Title'))}</strong></div>
              <p>${escapeHTML(t('guideMusic3Desc'))}</p>
            </article>
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('music')}</span><strong>${escapeHTML(t('guideMusic4Title'))}</strong></div>
              <p>${escapeHTML(t('guideMusic4Desc'))}</p>
            </article>
          </div>
        </div>`;
    } else if (currentGuideStep === 2) {
      stepHTML = `
        <div class="welcome-step-pane">
          <div class="welcome-hero-banner">
            <div>
              <h3>${escapeHTML(t('guideStep2Title'))}</h3>
              <p>${escapeHTML(t('guideStep2Desc'))}</p>
            </div>
            <div class="welcome-art-box" aria-hidden="true">
              <svg class="welcome-art-svg" viewBox="0 0 220 140" fill="none">
                <g stroke="var(--draw-ink)" stroke-width="2.4">
                  <rect x="20" y="18" width="46" height="104" rx="10" fill="var(--sidebar)"/>
                  <rect x="74" y="18" width="72" height="72" rx="10" fill="var(--surface)"/>
                  <rect x="154" y="18" width="46" height="72" rx="10" fill="var(--accent)"/>
                  <rect x="74" y="98" width="126" height="24" rx="8" fill="var(--player)"/>
                </g>
              </svg>
            </div>
          </div>
          <div class="welcome-grid">
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('move')}</span><strong>${escapeHTML(t('guidePanel1Title'))}</strong></div>
              <p>${escapeHTML(t('guidePanel1Desc'))}</p>
            </article>
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('layout')}</span><strong>${escapeHTML(t('guidePanel2Title'))}</strong></div>
              <p>${escapeHTML(t('guidePanel2Desc'))}</p>
            </article>
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('moon')}</span><strong>${escapeHTML(t('guidePanel3Title'))}</strong></div>
              <p>${escapeHTML(t('guidePanel3Desc'))}</p>
            </article>
            <article class="welcome-card">
              <div class="welcome-card-head"><span class="welcome-card-icon">${icon('refresh')}</span><strong>${escapeHTML(t('guidePanel4Title'))}</strong></div>
              <p>${escapeHTML(t('guidePanel4Desc'))}</p>
            </article>
          </div>
        </div>`;
    } else {
      stepHTML = `
        <div class="welcome-step-pane">
          <div class="welcome-hero-banner" style="grid-template-columns:1fr">
            <div>
              <h3>${escapeHTML(t('guideStep3Title'))}</h3>
              <p>${escapeHTML(t('guideStep3Desc'))}</p>
            </div>
          </div>
          <table class="shortcut-table">
            <tbody>
              ${[
                [t('togglePlayback'), t('space')],
                [t('seekShortcut'), '← / →'],
                [t('previous') + ' / ' + t('next'), 'Alt + ← / →'],
                [t('volumeShortcut'), '↑ / ↓'],
                [t('mute'), 'M'],
                [t('favoriteAction'), 'L'],
                [t('shuffle') + ' / ' + t('repeat'), 'S / R'],
                [t('searchShortcut'), '/'],
                [t('settings'), 'Ctrl + ,']
              ].map(([label, key]) => `<tr><td>${escapeHTML(label)}</td><td><kbd>${escapeHTML(key)}</kbd></td></tr>`).join('')}
            </tbody>
          </table>
        </div>`;
    }

    const tryBarHTML = `
      <div class="welcome-try-bar">
        <div>
          <strong>${escapeHTML(t('guideTryTitle'))}</strong>
          <span>${escapeHTML(t('guideTrySub'))}</span>
        </div>
        <div class="welcome-try-actions">
          <button class="button primary" data-action="demoFromGuide">${icon('play')}${escapeHTML(t('tryDemo'))}</button>
          <button class="button secondary" data-action="importFromGuide">${icon('plus')}${escapeHTML(t('addMusic'))}</button>
          <button class="button secondary" data-action="theme">${icon('sun')}${escapeHTML(t('guideTryWave'))}</button>
          <button class="button secondary" data-action="gigaFromGuide">${icon('sliders')}${escapeHTML(t('gigaShort'))}</button>
        </div>
      </div>`;

    body.innerHTML = stepHTML + tryBarHTML;
    localize($('#welcomeDialog'));
    syncCustomSelects($('#welcomeDialog'));
  }

  function openWelcomeGuide(step = 0) {
    currentGuideStep = clamp(step, 0, 3);
    renderWelcomeGuide();
    openDialogAnimated($('#welcomeDialog'));
  }

  function markOnboardingSeen() {
    stored.onboardingSeen = true;
    try { localStorage.setItem('zenith.onboarding.v1', 'seen'); } catch {}
    saveState();
  }

  function updateMediaSession(){
    if(!('mediaSession' in navigator))return;
    const track=currentTrack();
    try{
      navigator.mediaSession.playbackState=!currentId||audio.paused?'paused':'playing';
      if(track&&typeof MediaMetadata!=='undefined')navigator.mediaSession.metadata=new MediaMetadata({title:track.title||t('noTrack'),artist:trackArtist(track),album:track.album||t('unknownAlbum')});
    }catch{/* Ignore unsupported MediaSession metadata errors. */}
  }

  function randomizeHarmoniousTheme(){
    const mode=themeName(),hue=Math.floor(Math.random()*360),hue2=(hue+45+Math.floor(Math.random()*90))%360;
    const hslToHex=(h,s,l)=>{s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return '#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('');};
    const next=mode==='dark'?{
      bg:hslToHex(hue,22,7),surface:hslToHex(hue,20,12),sidebar:hslToHex(hue,22,10),player:hslToHex(hue,24,14),
      hero:hslToHex(hue,25,16),hover:hslToHex(hue,20,19),border:hslToHex(hue,16,28),outline:hslToHex(hue,18,42),
      text:hslToHex(hue,15,94),muted:hslToHex(hue,12,72),accent:hslToHex(hue,78,72),visualizer:hslToHex(hue2,82,70),
      sticker:hslToHex(hue2,80,75),recordLabel:hslToHex(hue,75,72)
    }:{
      bg:hslToHex(hue,24,93),surface:hslToHex(hue,30,98),sidebar:hslToHex(hue,26,90),player:hslToHex(hue2,32,89),
      hero:hslToHex(hue,32,88),hover:hslToHex(hue,24,86),border:hslToHex(hue,16,76),outline:hslToHex(hue,20,32),
      text:hslToHex(hue,28,16),muted:hslToHex(hue,14,40),accent:hslToHex(hue2,70,76),visualizer:hslToHex(hue,52,38),
      sticker:hslToHex((hue+60)%360,80,78),recordLabel:hslToHex(hue2,65,76)
    };
    next.accentText=readableInk(next.accent,'#151515');
    settings.colors[mode]={...settings.colors[mode],...next};
    applyTheme();if($('#settingsDialog').open)renderSettings();saveState();toast(t('saved'));
  }

  function editBuiltinThemeDialog(id){
    const preset=getThemePresets().find(p=>p.id===id);if(!preset)return;
    const fields=textField('name','themeName',preset.name,true)+
      `<label>${t('currentTheme')}<select name="mode"><option value="light" ${preset.mode==='light'?'selected':''}>${t('light')}</option><option value="dark" ${preset.mode==='dark'?'selected':''}>${t('dark')}</option></select></label>`+
      `<div class="colors-grid">${['bg','surface','sidebar','player','text','accent','visualizer','hero','outline'].map(key=>`<label class="color-row"><span>${t(key)}</span><input type="color" name="${key}" value="${preset.colors[key]||BASE_COLORS[preset.mode][key]}"></label>`).join('')}</div>`;
    openForm(t('editPresetColors'),fields,form=>{
      const mode=['light','dark'].includes(form.get('mode'))?form.get('mode'):preset.mode;
      const colors={...preset.colors};
      for(const key of ['bg','surface','sidebar','player','text','accent','visualizer','hero','outline'])if(safeColor(form.get(key)))colors[key]=form.get(key);
      colors.accentText=readableInk(colors.accent,'#151515');
      settings.modifiedThemes[id]={name:String(form.get('name')||preset.name).trim().slice(0,70),mode,colors};
      settings.theme=mode;settings.colors[mode]={...colors};
      applyTheme();renderSettings();saveState();toast(t('presetUpdated'));
    });
  }

  function performThemeReset(){
    const resetKeys=['theme','radius','shadow','fontScale','density','animations','artwork','autoContrast','surfaceOpacity','workspaceGap','workspaceMargin','topbarHeight','borderWidth','borderStyle','panelPadding','headerHeight','glassBlur','shapeProfile','cornerTL','cornerTR','cornerBR','cornerBL','use4Corners','fontFamily','letterSpacing','motionDuration','motionCurve','dragTilt','activePanelGlow','customCSS','spectrumStyle','spectrumGain','spectrumSmooth','spectrumCount','spectrumStroke','spectrumGlow','spectrumColor','spectrumColor2','spectrumGradient','spectrumMirror'];
    for(const k of resetKeys)settings[k]=structuredClone(DEFAULTS[k]);
    settings.colors={light:{},dark:{}};
    settings.backdrops={};
    settings.modifiedThemes={};
    for(const id of panelIds()){
      const r=panelConfig(id);
      Object.assign(r,{color:'',ink:'',line:'',radius:null,borderWidth:null,opacity:null,padding:null,scale:null,shape:'inherit',spectrumStyle:''});
    }
  }
  function performPanelsReset(){
    settings.panelsLocked=false;settings.snapPanels=true;settings.showNow=true;settings.showHero=true;settings.simple=false;
    settings.navigationDock='left';settings.nowDock='right';settings.playerDock='bottom';
    settings.modifiedLayouts={};
    settings.customPanels=[];
    settings.panelLayout={};
    panelConfig('navigation');panelConfig('now');panelConfig('player');
    if(layoutEditing){layoutEditing=false;document.body.classList.remove('is-editing');$('#layoutNotice').hidden=true;endPanelDrag(false);}
  }
  Object.assign(actions,{
    openGuide:()=>openWelcomeGuide(0),
    closeGuide:()=>{markOnboardingSeen();closeDialogAnimated($('#welcomeDialog'));},
    setGuideLang:button=>{const lang=button.dataset.lang;if(Object.hasOwn(LANGUAGE_NAMES,lang)){updateSetting('language',lang);renderWelcomeGuide();}},
    guideStep:button=>{currentGuideStep=clamp(button.dataset.step,0,3);renderWelcomeGuide();},
    guidePrev:()=>{currentGuideStep=clamp(currentGuideStep-1,0,3);renderWelcomeGuide();},
    guideNext:()=>{currentGuideStep=clamp(currentGuideStep+1,0,3);renderWelcomeGuide();},
    demoFromGuide:()=>{markOnboardingSeen();closeDialogAnimated($('#welcomeDialog'),()=>fire(loadDemo));},
    importFromGuide:()=>{markOnboardingSeen();closeDialogAnimated($('#welcomeDialog'),()=>$('#fileInput').click());},
    gigaFromGuide:()=>{markOnboardingSeen();closeDialogAnimated($('#welcomeDialog'),()=>openSettings('giga'));},
    resetThemeOnly:()=>{
      lastResetBackup=structuredClone(settings);
      performThemeReset();
      applyTheme();applyLayout(true);renderAll();if($('#settingsDialog').open)renderSettings();saveState();toast(t('themeOnlyResetToast'));
    },
    resetPanelsOnly:()=>{
      lastResetBackup=structuredClone(settings);
      performPanelsReset();
      applyWorkspacePreset('desk');applyTheme();renderAll();if($('#settingsDialog').open)renderSettings();saveState();toast(t('panelsOnlyResetToast'));
    },
    resetThemeAndPanels:()=>{
      lastResetBackup=structuredClone(settings);
      performThemeReset();
      performPanelsReset();
      applyWorkspacePreset('desk');applyTheme();renderAll();if($('#settingsDialog').open)renderSettings();saveState();toast(t('themeAndPanelsResetToast'));
    },
    undoReset:()=>{
      if(!lastResetBackup)return;
      settings=sanitizeSettings(lastResetBackup);
      lastResetBackup=null;
      applyTheme();applyLayout(true);renderAll();if($('#settingsDialog').open)renderSettings();saveState();toast(t('resetUndoneToast'));
    },
    layoutSettings:()=>openSettings('layout'),gigaSettings:()=>openSettings('giga'),addPanel:newPanelForm,saveLayout:saveLayoutForm,
    cascadePanels:cascadeFloatingPanels,tilePanels:tileFloatingPanels,randomTheme:()=>runThemeWaveTransition(randomizeHarmoniousTheme),
    toggleLockPanels:()=>{settings.panelsLocked=!settings.panelsLocked;applyLayout(false);if($('#settingsDialog').open)renderSettings();saveState();toast(t(settings.panelsLocked?'lockedToast':'unlockedToast'));},
    panelOptions:button=>showPanelEditor(button.dataset.id),
    collapsePanel:button=>{const r=panelConfig(button.dataset.id);r.collapsed=!r.collapsed;applyLayout();if($('#settingsDialog').open)renderSettings();saveState();},
    floatPanel:button=>{const id=button.dataset.id,r=panelConfig(id);setPanelZone(id,r.zone==='float'?({navigation:'left',now:'right',player:'bottom'}[id]||'right'):'float');applyLayout();saveState();},
    panelVisibility:button=>{const id=button.dataset.id,r=panelConfig(id);r.visible=!r.visible;if(id==='now')settings.showNow=r.visible;applyLayout();renderSettings();saveState();},
    setPanelShape:button=>{const id=button.dataset.id,r=panelConfig(id);r.shape=button.dataset.value||'inherit';if(r.shape==='pill')r.radius=34;else if(r.shape==='sharp')r.radius=0;else if(r.shape==='inherit')r.radius=null;applySurfaceStyles();$$(`[data-action="setPanelShape"][data-id="${id}"]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===r.shape)));saveState();},
    removePanel:button=>{const id=button.dataset.id;confirmAction(t('panelRemove'),t('panelRemoveConfirm'),()=>{settings.customPanels=settings.customPanels.filter(p=>p.id!==id);delete settings.panelLayout[id];applyLayout();saveState();if($('#settingsDialog').open)renderSettings();});},
    workspacePreset:button=>applyWorkspacePreset(button.dataset.value),
    saveIntoLayoutPreset:button=>{
      const id=button.dataset.id,meta=WORKSPACE_PRESET_META.find(m=>m[0]===id);if(!meta)return;
      const prev=settings.modifiedLayouts?.[id];
      settings.modifiedLayouts[id]={name:prev?.name||t(meta[1]),panels:structuredClone(settings.panelLayout),widgets:structuredClone(settings.customPanels),showNow:settings.showNow};
      saveState();renderSettings();toast(t('presetUpdated'));
    },
    renameLayoutPreset:button=>{
      const id=button.dataset.id,info=getWorkspacePresetPreview(id);
      openForm(t('rename'),textField('name','layoutName',info.name,true),form=>{
        const name=String(form.get('name')||'').trim();if(!name)return false;
        const prev=settings.modifiedLayouts?.[id]||{panels:structuredClone(settings.panelLayout),widgets:structuredClone(settings.customPanels),showNow:settings.showNow};
        settings.modifiedLayouts[id]={...prev,name:name.slice(0,70)};saveState();renderSettings();
      });
    },
    resetLayoutPreset:button=>{
      const id=button.dataset.id;delete settings.modifiedLayouts[id];applyWorkspacePreset(id);toast(t('presetReset'));
    },
    loadLayout:button=>{
      const layout=settings.savedLayouts.find(item=>item.id===button.dataset.id);if(!layout)return;
      const widgets=cleanCustomPanels(layout.widgets),ids=new Set(widgets.map(p=>p.id)),retained=settings.customPanels.filter(p=>!ids.has(p.id));
      if(widgets.length+retained.length>8){toast(t('panelLimit'));return;}
      const currentNotes=new Map(settings.customPanels.filter(p=>p.type==='notes').map(p=>[p.id,p.notes]));
      const nextPanels=cleanPanelLayout(layout.panels);
      for(const id of ['navigation','now','player'])if(settings.panelLayout[id]?.notes){if(!nextPanels[id])nextPanels[id]={...panelConfig(id)};nextPanels[id].notes=settings.panelLayout[id].notes;}
      for(const widget of retained)nextPanels[widget.id]={...panelConfig(widget.id),visible:false};
      settings.panelLayout=nextPanels;settings.customPanels=[...widgets,...retained];
      for(const widget of settings.customPanels)if(widget.type==='notes'&&currentNotes.has(widget.id))widget.notes=currentNotes.get(widget.id);
      settings.showNow=panelConfig('now').visible;
      for(const id of ['navigation','now','player'])settings[`${id}Dock`]=panelConfig(id).zone;
      applyLayout();saveState();if($('#settingsDialog').open)renderSettings();
    },
    deleteLayout:button=>{settings.savedLayouts=settings.savedLayouts.filter(item=>item.id!==button.dataset.id);saveState();renderSettings();},
    flatEQ:()=>{settings.eq=[0,0,0,0,0,0,0,0];settings.eqPreset='flat';rebuildGraph();syncEQControls();saveState();},
    setAudioMode:button=>{
      const val=button.dataset.value;
      if(!['original','effects','economy'].includes(val))return;
      updateSetting('audioMode',val,true);
      syncEQControls();
    },
    setEqPreset:button=>{
      const val=button.dataset.value;
      if(!val)return;
      if(EQ_PRESETS[val]){
        settings.eq=[...EQ_PRESETS[val]];
        settings.eqPreset=val;
        settings.audioMode='effects';
      }else if(val==='custom'){
        settings.eqPreset='custom';
        settings.audioMode='effects';
      }
      rebuildGraph();
      syncEQControls();
      saveState();
    },
    setSleepTimer:button=>{
      const mins=Number(button.dataset.value)||0;
      setSleep(mins>0?mins:-1);
      if($('#settingsDialog').open&&settingsTab==='audio')renderSettings();
    },
    resetAudioSettings:()=>{
      Object.assign(settings,{audioMode:'original',eq:[0,0,0,0,0,0,0,0],eqPreset:'flat',preamp:0,balance:0,mono:false,limiter:true,speed:1});
      audio.playbackRate=1;
      rebuildGraph();
      syncEQControls();
      if($('#settingsDialog').open&&settingsTab==='audio')renderSettings();
      saveState();
      toast(t('audioResetToast'));
    },
    copyCSSVars:async()=>{
      const text=activeCSSVariablesText();
      try{await navigator.clipboard.writeText(text);}catch{const ta=document.createElement('textarea');ta.value=text;document.body.append(ta);ta.select();document.execCommand('copy');ta.remove();}
      toast(t('cssCopied'));
    }
  });

  Object.assign(actions,{
    spectrumSettings:()=>openSettings('spectrum'),customize:()=>openSettings('appearance'),
    themeFilter:button=>{themeGalleryFilter=button.dataset.value;renderSettings();},
    themePreset:button=>runThemeWaveTransition(()=>{const preset=getThemePresets().find(p=>p.id===button.dataset.id);if(!preset)return;if(preset.visual){applyVisual(preset.visual);return;}settings.theme=preset.mode;settings.colors[preset.mode]={...preset.colors};for(const id of panelIds())Object.assign(panelConfig(id),{color:'',ink:'',line:'',radius:null,borderWidth:null,shape:'inherit'});if(preset.styleProfile){Object.assign(settings,preset.styleProfile);}else{Object.assign(settings,{shapeProfile:'custom',radius:22,borderWidth:1.5,shadow:0,fontFamily:'default',activePanelGlow:false});}settings.autoContrast=true;settings.spectrumColor='';settings.spectrumColor2='';applyTheme();applyLayout(false);renderHeroScene();renderSettings();saveState();}),
    updateBuiltinTheme:button=>{
      const id=button.dataset.id,base=getThemePresets().find(p=>p.id===id);if(!base)return;
      const mode=themeName(),colors=resolvedColors(mode);
      settings.modifiedThemes[id]={name:base.name,mode,colors,visual:visualSnapshot()};
      saveState();renderSettings();toast(t('presetUpdated'));
    },
    editBuiltinTheme:button=>editBuiltinThemeDialog(button.dataset.id),
    resetBuiltinTheme:button=>{
      const id=button.dataset.id;delete settings.modifiedThemes[id];
      const base=DEFAULT_THEME_PRESETS.find(p=>p.id===id);if(base){settings.theme=base.mode;settings.colors[base.mode]={...base.colors};}
      applyTheme();renderSettings();saveState();toast(t('presetReset'));
    },
    saveTheme:()=>saveThemeForm(),
    loadTheme:button=>{const theme=settings.savedThemes.find(p=>p.id===button.dataset.id);if(theme)applyVisual(theme.visual);},
    updateTheme:button=>saveThemeForm(button.dataset.id),
    renameTheme:button=>{const theme=settings.savedThemes.find(p=>p.id===button.dataset.id);if(theme)openForm(t('rename'),textField('name','themeName',theme.name,true),form=>{theme.name=String(form.get('name')).trim().slice(0,70);saveState();renderSettings();});},
    deleteTheme:button=>confirmAction(t('myThemes'),t('themeDelete'),()=>{settings.savedThemes=settings.savedThemes.filter(p=>p.id!==button.dataset.id);saveState();renderSettings();}),
    exportTheme:button=>exportSavedTheme(button.dataset.id),
    importTheme:()=>$('#themeInput').click(),
    choosePhoto:button=>{pendingPhotoTarget=button.dataset.target||'workspace';$('#photoInput').click();},
    removePhoto:button=>{const id=button.dataset.target;delete settings.backdrops[id];void applyAllBackdrops();saveState();if($('#settingsDialog').open)renderSettings();if($('#editFields').dataset.panel===id)renderPanelPhotoBlock(id);},
    panelDockPosition:button=>{setPanelZone(button.dataset.id,button.dataset.value);applyLayout();renderSettings();saveState();},
    restorePanels:()=>{for(const id of ['navigation','now','player']){const p=panelConfig(id);Object.assign(p,{content:'native',name:'',header:true,visible:true,collapsed:false,radius:null,borderWidth:null,opacity:null,padding:null,scale:null,shape:'inherit'});}applyWorkspacePreset('desk');renderAll();},
    spectrumStyle:button=>{settings.spectrumStyle=button.dataset.value;startSpectrum();renderSettings();saveState();},
    spectrumThemeColors:()=>{settings.spectrumColor='';settings.spectrumColor2='';startSpectrum();renderSettings();saveState();},
    addSpectrum:()=>{const id=addCustomPanel('spectrum','');if(id){applyLayout();saveState();$('#settingsDialog').close();}},
    spectrumReset:()=>{for(const key of ['spectrumStyle','spectrumGain','spectrumSmooth','spectrumCount','spectrumStroke','spectrumGlow','spectrumColor','spectrumColor2','spectrumGradient','spectrumMirror'])settings[key]=DEFAULTS[key];startSpectrum();renderSettings();saveState();}
  });
  $('#photoInput').addEventListener('change',event=>{const file=event.target.files?.[0],target=pendingPhotoTarget;event.target.value='';fire(()=>importPhoto(file,target));});
  $('#themeInput').addEventListener('change',event=>{const file=event.target.files?.[0];event.target.value='';fire(()=>importSavedTheme(file));});
  document.addEventListener('change',event=>{
    const node=event.target;if(node.id==='backgroundTarget'){backgroundTarget=node.value;renderSettings();}
    if(node.dataset.backdrop&&node.tagName==='SELECT')updateBackdropControl(node);
  });
  document.addEventListener('input',event=>{
    const node=event.target;
    if(node.dataset.backdrop&&node.type==='range')updateBackdropControl(node);
    if(['spectrumColor','spectrumColor2'].includes(node.dataset.spectrumColor)){settings[node.dataset.spectrumColor]=safeColor(node.value);startSpectrum();drawSpectrumPreviews();saveState();}
  });
  function updateBackdropControl(node){
    const id=node.dataset.target,key=node.dataset.backdrop;if(!['shade','blur','fit','position'].includes(key))return;
    const current={...backdropFor(id),[key]:node.type==='range'?Number(node.value):node.value};settings.backdrops[id]=cleanBackdrops({[id]:current})[id];
    const output=$(`[data-backdrop-output="${key}"]`,node.closest('.background-editor'));if(output)output.textContent=`${node.value}${key==='shade'?'%':'px'}`;
    void applyAllBackdrops();saveState();
  }

  document.addEventListener('click',event=>{
    const tab=event.target.closest('[data-settings-tab]');if(tab){settingsTab=tab.dataset.settingsTab;renderSettings();return;}
    const nav=event.target.closest('[data-view]');if(nav){selectView(nav.dataset.view);return;}
    const button=event.target.closest('[data-action]');
    if(button){event.preventDefault();if(!['trackMenu','playlistOptions'].includes(button.dataset.action))closeMenu();const handler=actions[button.dataset.action];if(handler)fire(()=>handler(button,event));}
    else if(!event.target.closest('#contextMenu'))closeMenu();
  });
  document.addEventListener('contextmenu',event=>{const row=event.target.closest('[data-track]');if(row){event.preventDefault();trackMenu(row.dataset.track,event.clientX,event.clientY);}});
  let searchTimer=0;
  $('#search').addEventListener('input',event=>{renderSearchSuggestions();clearTimeout(searchTimer);searchTimer=setTimeout(()=>{query=event.target.value;page=1;renderLibrary();},90);});
  $('#sortSelect').addEventListener('change',event=>{settings.sort=event.target.value;page=1;renderLibrary();saveState();});
  $('#volume').addEventListener('input',event=>{settings.volume=clamp(event.target.value,0,100);audio.volume=settings.volume/100;audio.muted=false;rangeFill(event.target);$('#muteButton use').setAttribute('href',settings.volume?'#i-volume':'#i-mute');saveState();});
  $('#seek').addEventListener('input',event=>{const duration=Number.isFinite(audio.duration)?audio.duration:0;if(duration){audio.currentTime=clamp(event.target.value/1000*duration,0,duration);$('#currentTime').textContent=formatTime(audio.currentTime);rangeFill(event.target);}});
  $('#seek').addEventListener('change',()=>saveState());
  for(const id of ['fileInput','folderInput'])$(`#${id}`).addEventListener('change',event=>{const files=Array.from(event.target.files||[]);event.target.value='';fire(()=>importFiles(files));});
  $('#settingsInput').addEventListener('change',event=>{const file=event.target.files?.[0];event.target.value='';fire(()=>importPreferences(file));});
  function revertPanelEditBackup(){
    if(!panelEditBackup)return;
    const {id,record,widgetType}=panelEditBackup;panelEditBackup=null;
    settings.panelLayout[id]=record;
    if(['navigation','now','player'].includes(id))settings[`${id}Dock`]=record.zone;
    if(id==='now')settings.showNow=record.visible;
    const widget=settings.customPanels.find(p=>p.id===id);if(widget&&widgetType)widget.type=widgetType;
    applyLayout(false);applySurfaceStyles();saveState();
  }
  actions.closeEdit=()=>{revertPanelEditBackup();closeDialogAnimated($('#editDialog'),()=>{editCallback=null;});};
  $('#editForm').addEventListener('submit',event=>{event.preventDefault();const form=new FormData(event.target),callback=editCallback;fire(async()=>{const result=await callback?.(form);if(result!==false){panelEditBackup=null;closeDialogAnimated($('#editDialog'),()=>{editCallback=null;});}});});
  $('#settingsDialog').addEventListener('close',()=>{ $('#settingsDialog').classList.remove('dialog-peek');startSpectrum();});
  $('#editDialog').addEventListener('cancel',()=>{revertPanelEditBackup();editCallback=null;});
  $('#editDialog').addEventListener('close',()=>{$('#editDialog').classList.remove('dialog-peek');});
  $('#settingsDialog').addEventListener('click',event=>{if(event.target!==event.currentTarget)return;const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeDialogAnimated(event.currentTarget);});
  $('#welcomeDialog')?.addEventListener('click',event=>{if(event.target!==event.currentTarget)return;const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom){markOnboardingSeen();closeDialogAnimated(event.currentTarget);}});
  document.addEventListener('pointerdown',event=>{
    const slider=event.target.closest('dialog input[type="range"]');
    if(slider&&settings.peekOnSlider&&slider.dataset.eq===undefined&&!['preamp','balance','speed'].includes(slider.dataset.setting)){slider.closest('dialog')?.classList.add('dialog-peek');}
  });
  document.addEventListener('dblclick',event=>{
    const eqSlider=event.target.closest('input[data-eq]');
    if(eqSlider){eqSlider.value='0';changeEQ(eqSlider);}
  });
  function handleLivePanelSlider(node){
    const id=node.dataset.panelSlider,prop=node.dataset.prop,unit=node.dataset.unit||'px';
    if(!id||!prop)return;
    rangeFill(node);
    const val=Number(node.value),r=panelConfig(id);
    if(prop==='w'){
      r.w=clamp(val,180,1600);
      if(r.zone==='left'||r.zone==='right')[...$(`#dock-${r.zone}`).children].forEach(p=>{panelConfig(p.dataset.panel).w=r.w;});
    }else if(prop==='h'){
      r.h=clamp(val,80,1400);
      if(r.zone==='top'||r.zone==='bottom')[...$(`#dock-${r.zone}`).children].forEach(p=>{panelConfig(p.dataset.panel).h=r.h;});
    }else if(prop==='radius'){r.radius=clamp(val,0,44);if(r.shape==='inherit')r.shape='standard';}
    else if(prop==='borderWidth')r.borderWidth=clamp(val,0,6);
    else if(prop==='opacity')r.opacity=clamp(val,30,100);
    else if(prop==='padding')r.padding=clamp(val,4,32);
    else if(prop==='scale')r.scale=clamp(val,80,125);
    else if(prop==='x')r.x=clamp(val,0,30000);
    else if(prop==='y')r.y=clamp(val,0,30000);
    $$(`[data-panel-out="${id}:${prop}"]`).forEach(out=>{out.textContent=`${Math.round(val*10)/10}${unit}`;});
    const inherited=$('#editFields input[name="themeColor"]');if(inherited&&['radius','borderWidth','opacity'].includes(prop))inherited.checked=false;
    applyLayout(false);applySurfaceStyles();resizeSpectrum();saveState();
  }
  $('#settingsContent').addEventListener('input',event=>{
    const node=event.target;
    if(node.dataset.panelSlider){handleLivePanelSlider(node);return;}
    if(node.id==='customCSSInput'){settings.customCSS=node.value.slice(0,12000);const styleNode=$('#userCustomCSS');if(styleNode)styleNode.textContent=settings.customCSS;saveState();return;}
    if(node.dataset.color){const key=node.dataset.color;if(COLOR_KEYS.includes(key)&&/^#[\da-f]{6}$/i.test(node.value)){settings.colors[themeName()][key]=node.value;applyTheme();saveState();}return;}
    if(node.dataset.eq!==undefined){changeEQ(node);return;}
    if(node.dataset.setting&&node.type==='range'){rangeFill(node);updateSetting(node.dataset.setting,node.value,true);}
  });
  $('#settingsContent').addEventListener('change',event=>{
    const node=event.target;if(node.id==='sleepSelect'){setSleep(Number(node.value));return;}
    if(node.dataset.setting&&node.type!=='range')updateSetting(node.dataset.setting,node.type==='checkbox'?node.checked:node.value);
  });

  document.addEventListener('input',event=>{
    const node=event.target;
    if(node.dataset.panelSlider&&!node.closest('#settingsContent')){handleLivePanelSlider(node);return;}
    if(node.dataset.panelLiveColor){
      const [id,key]=node.dataset.panelLiveColor.split(':'),r=panelConfig(id);
      if(safeColor(node.value)){r[key]=node.value;const inherited=$('#editFields input[name="themeColor"]');if(inherited)inherited.checked=false;applySurfaceStyles();saveState();}
      return;
    }
    if(node.dataset.eq!==undefined&&!node.closest('#settingsContent'))changeEQ(node);
    if(node.dataset.widgetNote){const widget=settings.customPanels.find(p=>p.id===node.dataset.widgetNote);if(widget)widget.notes=node.value.slice(0,6000);else panelConfig(node.dataset.widgetNote).notes=node.value.slice(0,6000);saveState();}
    if(node.matches('#editFields input[name="color"],#editFields input[name="ink"],#editFields input[name="line"],#editFields input[name="radius"]')){const inherited=$('#editFields input[name="themeColor"]');if(inherited)inherited.checked=false;}
  });
  document.addEventListener('change',event=>{
    if(event.target.id==='showGuideOnStartup'){
      settings.showGuideOnStartup=event.target.checked;
      saveState();
      return;
    }
    if(event.target.id==='welcomeLangSelect'){
      if(Object.hasOwn(LANGUAGE_NAMES,event.target.value)){
        updateSetting('language',event.target.value);
        renderWelcomeGuide();
      }
      return;
    }
    const node=event.target;
    if(node.dataset.panelLiveZone){setPanelZone(node.dataset.panelLiveZone,node.value);applyLayout(true);saveState();return;}
    if(node.dataset.panelLiveSelect){
      const id=node.dataset.panelLiveSelect,type=node.value,r=panelConfig(id),widget=settings.customPanels.find(p=>p.id===id);
      if(widget&&WIDGET_TYPES.includes(type))widget.type=type;else if(!widget)r.content=WIDGET_TYPES.includes(type)?type:'native';
      applyLayout(false);renderAll();saveState();return;
    }
    if(node.dataset.panelLiveCheck){
      const [id,prop]=node.dataset.panelLiveCheck.split(':'),r=panelConfig(id);
      r[prop]=node.checked;if(id==='now'&&prop==='visible')settings.showNow=node.checked;
      applyLayout(false);applySurfaceStyles();saveState();return;
    }
  });

  let dropDepth=0;
  document.addEventListener('dragenter',event=>{if(!Array.from(event.dataTransfer?.types||[]).includes('Files'))return;event.preventDefault();dropDepth++;$('#fileDrop').hidden=false;});
  document.addEventListener('dragover',event=>{if(Array.from(event.dataTransfer?.types||[]).includes('Files')){event.preventDefault();event.dataTransfer.dropEffect='copy';}});
  document.addEventListener('dragleave',()=>{dropDepth=Math.max(0,dropDepth-1);if(!dropDepth)$('#fileDrop').hidden=true;});
  document.addEventListener('drop',event=>{
    if(!Array.from(event.dataTransfer?.types||[]).includes('Files'))return;event.preventDefault();dropDepth=0;$('#fileDrop').hidden=true;
    // Capture FileSystemEntry objects synchronously before DataTransfer is cleared.
    const items=Array.from(event.dataTransfer.items||[]),entries=items.map(item=>item.webkitGetAsEntry?.()).filter(Boolean),fallback=Array.from(event.dataTransfer.files||[]);
    fire(async()=>{let files=fallback;if(entries.some(entry=>entry.isDirectory)){files=[];for(const entry of entries)files.push(...await directoryFiles(entry));}await importFiles(files);});
  });
  globalThis.addEventListener('blur',()=>{dropDepth=0;$('#fileDrop').hidden=true;endPanelDrag();});

  document.addEventListener('keydown',event=>{
    if(!$('#contextMenu').hidden){const items=$$('button',$('#contextMenu')),index=items.indexOf(document.activeElement);if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();items[(index+(event.key==='ArrowDown'?1:items.length-1))%items.length]?.focus();return;}if(event.key==='Escape'){event.preventDefault();closeMenu();return;}}
    if(event.key==='Escape'){endPanelDrag();if(layoutEditing)actions.layout();return;}
    if((event.ctrlKey||event.metaKey)&&event.key===','){event.preventDefault();if(!$('#settingsDialog').open)openSettings();return;}
    if(!settings.shortcuts||$('#settingsDialog').open||$('#editDialog').open||event.target.closest('input,textarea,select,[contenteditable="true"]')||event.ctrlKey||event.metaKey)return;
    if(event.code==='Space'&&event.target.closest('button,a'))return;
    let action;
    switch(event.key.toLowerCase()){
      case ' ':action=togglePlay;break;
      case 'arrowleft':action=event.altKey?previousTrack:()=>{if(currentId&&Number.isFinite(audio.duration))audio.currentTime=Math.max(0,audio.currentTime-5);};break;
      case 'arrowright':action=event.altKey?()=>nextTrack():()=>{if(currentId&&Number.isFinite(audio.duration))audio.currentTime=Math.min(audio.duration,audio.currentTime+5);};break;
      case 'arrowup':case 'arrowdown':action=()=>{settings.volume=clamp(settings.volume+(event.key==='ArrowUp'?5:-5),0,100);audio.volume=settings.volume/100;audio.muted=false;updatePlaybackUI();saveState();};break;
      case 'm':action=actions.mute;break;case 'l':action=actions.favoriteCurrent;break;case 's':action=actions.shuffle;break;case 'r':action=actions.repeat;break;case '/':action=()=>$('#search').focus();break;
    }
    if(action){event.preventDefault();fire(action);}
  });

  let pendingResume=null;
  audio.addEventListener('loadedmetadata',()=>{
    const track=currentTrack();if(!track)return;
    if(Number.isFinite(audio.duration)){track.duration=audio.duration;void persistMetadata(track);$$('[data-duration]').filter(node=>node.dataset.duration===track.id).forEach(node=>{node.textContent=formatTime(track.duration);});}
    if(pendingResume?.id===track.id){audio.currentTime=clamp(pendingResume.time,0,Number.isFinite(audio.duration)?audio.duration:0);pendingResume=null;}
    updateTime();document.body.classList.remove('is-buffering');
  });
  audio.addEventListener('play',()=>{const track=currentTrack();if(track){track.lastPlayed=Date.now();void persistMetadata(track);}updatePlaybackUI();updateMediaSession();saveState();});
  audio.addEventListener('playing',()=>{document.body.classList.remove('is-buffering');updatePlaybackUI();});
  audio.addEventListener('pause',()=>{updatePlaybackUI();updateMediaSession();saveState();});
  audio.addEventListener('waiting',()=>{if(!audio.paused)document.body.classList.add('is-buffering');});
  audio.addEventListener('timeupdate',()=>{updateTime();if(Date.now()-lastPositionSave>4000){lastPositionSave=Date.now();saveState();}});
  audio.addEventListener('ended',()=>fire(()=>nextTrack(true)));
  audio.addEventListener('error',()=>{document.body.classList.remove('is-buffering');if(audio.error&&currentId){toast(t('playbackError'),true);updatePlaybackUI();}});
  audio.addEventListener('volumechange',()=>{$('#muteButton use').setAttribute('href',audio.muted||audio.volume===0?'#i-mute':'#i-volume');});
  document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('is-hidden',document.hidden);startSpectrum();if(document.hidden)saveState(true);});
  globalThis.addEventListener('pagehide',()=>saveState(true));
  let windowResizeFrame=0;
  globalThis.addEventListener('resize',()=>{closeMenu();if(!windowResizeFrame)windowResizeFrame=requestAnimationFrame(()=>{windowResizeFrame=0;applyLayout(false);});});
  systemTheme?.addEventListener('change',()=>{if(settings.theme==='system'){applyTheme();if($('#settingsDialog').open&&settingsTab==='appearance')renderSettings();}});
  narrowWindow?.addEventListener('change',()=>{applyLayout();startSpectrum();});
  if('mediaSession' in navigator){for(const [name,callback] of Object.entries({play:()=>{if(audio.paused)fire(togglePlay);},pause:()=>audio.pause(),previoustrack:()=>fire(previousTrack),nexttrack:()=>fire(()=>nextTrack()),seekbackward:details=>{audio.currentTime=Math.max(0,audio.currentTime-(details.seekOffset||10));},seekforward:details=>{if(Number.isFinite(audio.duration))audio.currentTime=Math.min(audio.duration,audio.currentTime+(details.seekOffset||10));},seekto:details=>{if(Number.isFinite(details.seekTime)&&Number.isFinite(audio.duration))audio.currentTime=clamp(details.seekTime,0,audio.duration);}})){try{navigator.mediaSession.setActionHandler(name,callback);}catch{/* Not every browser supports every action. */}}}


  // ============================================================================
  // V4 TRANSLATIONS & COPY (PINNING, HERO SCENES, MULTI-SELECT, SMART SEARCH)
  // ============================================================================
  const V4_COPY={
    pinPanel:['Pin panel (lock position)','Закрепить панель от перетаскивания','Закріпити панель від перетягування'],
    unpinPanel:['Unpin panel','Открепить панель','Відкріпити панель'],
    pinShort:['Lock panels','Закрепить','Закріпити'],
    resetAudio:['Reset sound settings','Сбросить настройки звука','Скинути налаштування звуку'],
    audioResetToast:['Sound and equalizer settings restored to default','Настройки звука и эквалайзера сброшены','Налаштування звуку та еквалайзера скинуто'],
    panelPinnedToast:['Panel pinned — protected from accidental dragging','Панель закреплена от случайного перетаскивания','Панель закріплено від випадкового перетягування'],
    panelUnpinnedToast:['Panel unpinned — you can move it now','Панель откреплена — можно перемещать','Панель відкріплено — можна переміщувати'],
    heroBgBtn:['Hero background','Фон и анимация','Фон та анімація'],
    heroBgBtnTitle:['Choose background animation, anime/cartoon art or upload GIF','Выбрать анимацию, аниме/мульт-арт или загрузить свою GIF на главный экран','Обрати анімацію, аніме/мульт-арт або завантажити власну GIF на головний екран'],
    heroPickerTitle:['Main screen background & animation','Фон главного экрана','Фон головного екрана'],
    heroTabAnim:['✨ Animations','✨ Анимации','✨ Анімації'],
    heroTabArt:['🎨 Anime & Cartoon','🎨 Аниме и Мульт','🎨 Аніме та Мульт'],
    heroTabGif:['📁 Own GIF / Photo','📁 Своя GIF / Фото','📁 Власна GIF / Фото'],
    sceneDefault:['Cozy Cloud Studio','Уютное облако (Классика)','Затишна хмаринка (Класика)'],
    sceneDefaultSub:['Drawn cassette deck & warm vibes','Рисованная кассетная дека и тёплый вайб','Мальована касетна дека й теплий вайб'],
    sceneAnimLofi:['Lo-Fi Vinyl & Stars','Винил и звёздная ночь','Вініл та зоряна ніч'],
    sceneAnimLofiSub:['Spinning record, floating notes & warm glow','Крутящийся винил, летящие ноты и мягкий свет','Вініл, що крутиться, ноти та м’яке світло'],
    sceneAnimSynth:['Synthwave Cyber Grid','Неоновый Синтвейв','Неоновий Синтвейв'],
    sceneAnimSynthSub:['Retro 3D grid, sunset & reactive skyline','Ретро 3D-сетка, закат и эквалайзер мегаполиса','Ретро 3D-сітка, захід сонця та еквалайзер міста'],
    sceneAnimArcane:['Arcane Hextech Pulse','Аркейн: Хекстек-импульс','Аркейн: Хекстек-імпульс'],
    sceneAnimArcaneSub:['Mystic Zaun/Piltover energy & sound rings','Магическая энергия Зауна и звуковые кольца','Магічна енергія Зауна та звукові кільця'],
    sceneAnimRain:['Night Rain & Lo-Fi Window','Ночной дождь и Lo-Fi','Нічний дощ та Lo-Fi'],
    sceneAnimRainSub:['Raindrops, bokeh lights & cozy reflections','Капли дождя, огни ночного города и уют','Краплі дощу, вогні нічного міста та затишок'],
    sceneAnimAurora:['Liquid Audio Aurora','Северное аудио-сияние','Північне аудіо-сяйво'],
    sceneAnimAuroraSub:['Flowing neon waves reactive to music','Плавные неоновые волны в такт музыке','Плавні неонові хвилі в такт музиці'],
    sceneArtAnimeLofi:['Anime Lo-Fi Girl','Аниме: Lo-Fi девушка у окна','Аніме: Lo-Fi дівчина біля вікна'],
    sceneArtAnimeLofiSub:['Headphones, starry window, cat & vinyl','Наушники, ночное окно, кот и виниловый плеер','Навушники, нічне вікно, кіт і вініловий плеєр'],
    sceneArtAnimeArcane:['Anime: Zaun Neon DJ','Аниме: Аркейн DJ-пульт','Аніме: Аркейн DJ-пульт'],
    sceneArtAnimeArcaneSub:['Jinx/Zaun neon graffiti & hextech speakers','Неоновое граффити в стиле Аркейн и колонки','Неонове графіті в стилі Аркейн та колонки'],
    sceneArtCartoon:['Cartoon Boombox Jam','Cartoon: Мульт-бумбокс','Cartoon: Мульт-бумбокс'],
    sceneArtCartoonSub:['Bold cartoon boombox, cassettes & comic stars','Яркий мультяшный бумбокс, кассеты и комикс-вайб','Яскравий мультяшний бумбокс, касети й комікс-вайб'],
    sceneArtBrutal:['Tactical Reel Deck','Строгий: Студийная дека','Суворий: Студійна дека'],
    sceneArtBrutalSub:['Brushed metal reel-to-reel & VU meters','Строгий металл, катушечный магнитофон и индикаторы','Суворий метал, котушковий магнітофон та індикатори'],
    uploadGifBtn:['Upload GIF / Image to Hero','Загрузить свою GIF / Картинку на главный экран','Завантажити власну GIF / Картинку на головний екран'],
    uploadAppGifBtn:['Upload GIF / Image to App Background','Поставить GIF / Картинку на фон всего окна','Поставити GIF / Картинку на фон усього вікна'],
    gifHint:['Supports animated .GIF, .WebP, .PNG, .JPG up to 25 MB. Animated GIFs play smoothly!','Поддерживаются анимированные .GIF, .WebP, .PNG, .JPG до 25 МБ. Гифки проигрываются с анимацией!','Підтримуються анімовані .GIF, .WebP, .PNG, .JPG до 25 МБ. Гіфки програються з анімацією!'],
    selectTracks:['Select','Выбрать','Вибрати'],
    selectAll:['Select / deselect all','Выделить все / снять выделение','Виділити все / зняти виділення'],
    selectedCount:['Selected: {n}','Выбрано: {n}','Вибрано: {n}'],
    clearSelection:['Clear','Снять','Зняти'],
    batchQueued:['Added {n} tracks to queue','Добавлено в очередь треков: {n}','Додано до черги треків: {n}'],
    batchPlaylistAdded:['Added {n} tracks to playlist','Добавлено в плейлист треков: {n}','Додано до плейлиста треків: {n}'],
    batchFavUpdated:['Updated favorites for {n} tracks','Обновлено избранное для треков: {n}','Оновлено улюблене для треків: {n}'],
    batchDeleteConfirm:['Remove {n} selected tracks from ZENITH? Original files on your computer stay safe.','Удалить выбранные треки ({n} шт.) из коллекции ZENITH? Исходные файлы на устройстве останутся.','Видалити вибрані треки ({n} шт.) із колекції ZENITH? Оригінальні файли на пристрої залишаться.'],
    searchSuggestionsTitle:['MATCHES BY LETTERS & TITLE','ПОХОЖИЕ ТРЕКИ ПО БУКВАМ','СХОЖІ ТРЕКИ ЗА ЛІТЕРАМИ'],
    searchArtistsAlbums:['ARTISTS & ALBUMS','ИСПОЛНИТЕЛИ И АЛЬБОМЫ','ВИКОНАВЦІ ТА АЛЬБОМИ']
  };
  for(const [key,values] of Object.entries(V4_COPY)){EN[key]=values[0];RU[key]=values[1];UK[key]=values[2];}

  // ============================================================================
  // 1 & 6. UNIVERSAL CUSTOM DROPDOWN ENGINE (NO NATIVE OS <SELECT> WINDOWS)
  // ============================================================================
  let activeSelectEl=null;
  function syncCustomSelects(root=document){
    $$('select',root).forEach(sel=>{
      sel.classList.add('z-enhanced');
      let btn=sel.nextElementSibling;
      if(!btn||!btn.classList.contains('z-select-trigger')){
        btn=document.createElement('button');
        btn.type='button';
        btn.className='z-select-trigger';
        btn.setAttribute('aria-haspopup','listbox');
        btn.setAttribute('aria-expanded','false');
        sel.after(btn);
        btn.addEventListener('click',e=>{
          e.preventDefault();
          e.stopPropagation();
          if(activeSelectEl===sel&&!$('#customSelectMenu').hidden){closeCustomSelectMenu();return;}
          openCustomSelectMenu(sel,btn);
        });
      }
      const chosen=sel.selectedOptions?.[0]||sel.options?.[0];
      btn.innerHTML=`<span>${escapeHTML(chosen?chosen.textContent:'')}</span>${icon('chevron')}`;
      btn.disabled=sel.disabled;
    });
  }
  function closeCustomSelectMenu(){
    const menu=$('#customSelectMenu');
    if(menu)menu.hidden=true;
    $$('.z-select-trigger[aria-expanded="true"],#topLangBtn[aria-expanded="true"]').forEach(b=>b.setAttribute('aria-expanded','false'));
    activeSelectEl=null;
  }
  function positionCustomSelectMenu(menu,triggerBtn,minW=170,alignRight=false){
    const host=triggerBtn.closest('dialog[open]')||document.body;
    if(menu.parentElement!==host)host.append(menu);
    menu.hidden=false;
    menu.style.left='0px';
    menu.style.top='0px';
    menu.style.minWidth=`${Math.max(triggerBtn.offsetWidth,minW)}px`;
    const zeroRect=menu.getBoundingClientRect();
    const rect=triggerBtn.getBoundingClientRect();
    const mW=Math.max(rect.width,menu.offsetWidth||minW);
    const mH=Math.min(310,menu.scrollHeight||220);
    const rawLeft=alignRight?rect.right-mW:rect.left;
    const vpLeft=clamp(rawLeft,8,Math.max(8,window.innerWidth-mW-8));
    const vpTop=(rect.bottom+mH+12>window.innerHeight&&rect.top>mH+12)?rect.top-mH-6:rect.bottom+6;
    menu.style.left=`${Math.round(vpLeft-zeroRect.left)}px`;
    menu.style.top=`${Math.round(vpTop-zeroRect.top)}px`;
  }
  function openCustomSelectMenu(sel,triggerBtn){
    const menu=$('#customSelectMenu');if(!menu)return;
    $$('.z-select-trigger[aria-expanded="true"]').forEach(b=>b.setAttribute('aria-expanded','false'));
    activeSelectEl=sel;
    triggerBtn.setAttribute('aria-expanded','true');
    menu.innerHTML=[...sel.options].map(opt=>`<button type="button" role="option" class="z-select-option ${opt.value===sel.value?'selected':''}" data-select-val="${escapeHTML(opt.value)}" aria-selected="${opt.value===sel.value}"><span>${escapeHTML(opt.textContent)}</span>${opt.value===sel.value?icon('check'):''}</button>`).join('');
    positionCustomSelectMenu(menu,triggerBtn,170,false);
  }
  function openTopbarLanguageMenu(btn){
    const menu=$('#customSelectMenu');if(!menu)return;
    if(activeSelectEl==='TOP_LANG'&&!menu.hidden){closeCustomSelectMenu();return;}
    $$('.z-select-trigger[aria-expanded="true"]').forEach(b=>b.setAttribute('aria-expanded','false'));
    activeSelectEl='TOP_LANG';
    btn.setAttribute('aria-expanded','true');
    menu.innerHTML=Object.entries(LANGUAGE_NAMES).map(([code,label])=>`<button type="button" role="option" class="z-select-option ${settings.language===code?'selected':''}" data-top-lang="${escapeHTML(code)}" aria-selected="${settings.language===code}"><span>${escapeHTML(label)} (${code.toUpperCase()})</span>${settings.language===code?icon('check'):''}</button>`).join('');
    positionCustomSelectMenu(menu,btn,190,true);
  }
  document.addEventListener('scroll',e=>{
    if(activeSelectEl&&e.target!==$('#customSelectMenu'))closeCustomSelectMenu();
  },true);
  document.addEventListener('click',e=>{
    const opt=e.target.closest('[data-select-val]');
    if(opt&&activeSelectEl&&activeSelectEl!=='TOP_LANG'){
      e.preventDefault();e.stopPropagation();
      const sel=activeSelectEl;
      sel.value=opt.dataset.selectVal;
      closeCustomSelectMenu();
      syncCustomSelects(sel.parentElement||document);
      sel.dispatchEvent(new Event('input',{bubbles:true}));
      sel.dispatchEvent(new Event('change',{bubbles:true}));
      return;
    }
    const langOpt=e.target.closest('[data-top-lang]');
    if(langOpt){
      e.preventDefault();e.stopPropagation();
      const lang=langOpt.dataset.topLang;
      closeCustomSelectMenu();
      updateSetting('language',lang);
      const codeNode=$('#topLangCode');if(codeNode)codeNode.textContent=lang.toUpperCase();
      if($('#welcomeDialog')?.open)renderWelcomeGuide();
      return;
    }
    if(!e.target.closest('#customSelectMenu,.z-select-trigger,#topLangBtn'))closeCustomSelectMenu();
    if(!e.target.closest('#heroBgPicker,#heroBgBtn,[data-action="toggleHeroPicker"]')){const hp=$('#heroBgPicker');if(hp&&!hp.hidden)hp.hidden=true;}
    if(!e.target.closest('#searchWrap')){const ss=$('#searchSuggestions');if(ss&&!ss.hidden)ss.hidden=true;}
  });

  // ============================================================================
  // 2. HERO BACKGROUND SELECTOR: ANIMATED PRESETS, ANIME/CARTOON ART & GIFS
  // ============================================================================
  let heroPickerTab='anim',heroAnimFrame=0;
  const HERO_SCENES={
    anim:[
      {id:'anim-lofi',title:'sceneAnimLofi',sub:'sceneAnimLofiSub',badge:'60 FPS'},
      {id:'anim-synthwave',title:'sceneAnimSynth',sub:'sceneAnimSynthSub',badge:'60 FPS'},
      {id:'anim-arcane',title:'sceneAnimArcane',sub:'sceneAnimArcaneSub',badge:'ARCANE'},
      {id:'anim-rain',title:'sceneAnimRain',sub:'sceneAnimRainSub',badge:'LO-FI'},
      {id:'anim-aurora',title:'sceneAnimAurora',sub:'sceneAnimAuroraSub',badge:'AUDIO'}
    ],
    art:[
      {id:'default',title:'sceneDefault',sub:'sceneDefaultSub',badge:'CLASSIC'},
      {id:'art-anime-lofi',title:'sceneArtAnimeLofi',sub:'sceneArtAnimeLofiSub',badge:'ANIME'},
      {id:'art-anime-arcane',title:'sceneArtAnimeArcane',sub:'sceneArtAnimeArcaneSub',badge:'ARCANE'},
      {id:'art-cartoon-boombox',title:'sceneArtCartoon',sub:'sceneArtCartoonSub',badge:'CARTOON'},
      {id:'art-brutal-deck',title:'sceneArtBrutal',sub:'sceneArtBrutalSub',badge:'STRICT'}
    ]
  };
  function heroArtSVG(sceneId){
    if(sceneId==='art-anime-lofi'){
      return `<svg viewBox="0 0 460 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#141833"/><stop offset="65%" stop-color="#2a2456"/><stop offset="100%" stop-color="#61366b"/></linearGradient>
          <linearGradient id="lampGlow" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffdf85" stop-opacity="0.7"/><stop offset="100%" stop-color="#ffdf85" stop-opacity="0"/></linearGradient>
        </defs>
        <rect x="150" y="18" width="290" height="215" rx="14" fill="url(#skyGrad)" stroke="var(--draw-ink)" stroke-width="3"/>
        <circle cx="385" cy="64" r="24" fill="#ffefb0" opacity="0.92"/>
        <circle cx="210" cy="48" r="2" fill="#fff"/><circle cx="265" cy="36" r="1.5" fill="#fff"/><circle cx="320" cy="58" r="2" fill="#fff"/><circle cx="190" cy="95" r="1.5" fill="#fff"/>
        <path d="M153 195h35v-45h28v25h24v-60h32v40h22v-52h36v68h28v-38h35v62H153Z" fill="#121329" opacity="0.88"/>
        <g fill="#ffcf6b" opacity="0.8"><rect x="247" y="130" width="5" height="7"/><rect x="256" y="130" width="5" height="7"/><rect x="247" y="142" width="5" height="7"/><rect x="302" y="118" width="6" height="8"/><rect x="312" y="132" width="6" height="8"/></g>
        <line x1="295" y1="18" x2="295" y2="233" stroke="var(--draw-ink)" stroke-width="3"/><line x1="150" y1="128" x2="440" y2="128" stroke="var(--draw-ink)" stroke-width="3"/>
        <path d="M380 232c0-22 14-36 26-36s22 14 22 36Z" fill="#181824" stroke="var(--draw-ink)" stroke-width="2.4"/>
        <path d="M388 202l-6-15 14 8m18-8 14-8-6 15" fill="#181824" stroke="var(--draw-ink)" stroke-width="2.2"/>
        <path d="M422 228c16 2 22 16 12 24" stroke="#181824" stroke-width="5" stroke-linecap="round"/>
        <path d="M40 245h405l12 55H25Z" fill="var(--player)" stroke="var(--draw-ink)" stroke-width="2.8"/>
        <polygon points="85,68 195,245 25,245" fill="url(#lampGlow)"/>
        <path d="M55 245l18-145 36-22" stroke="var(--draw-ink)" stroke-width="4" stroke-linecap="round"/>
        <path d="M95 62l32 16-22 20-24-14Z" fill="var(--sticker)" stroke="var(--draw-ink)" stroke-width="2.6"/>
        <rect x="285" y="228" width="112" height="34" rx="8" fill="var(--surface)" stroke="var(--draw-ink)" stroke-width="2.5"/>
        <g class="tape-reel"><circle cx="332" cy="245" r="22" fill="#232533" stroke="var(--draw-ink)" stroke-width="2.4"/><circle cx="332" cy="245" r="7" fill="var(--recordLabel)"/><path d="M332 226v8m0 22v8m-19-19h8m22 0h8" stroke="#fff" stroke-width="1.5"/></g>
        <path d="M368 230l-14 20" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
        <g stroke="var(--draw-ink)" stroke-width="2.6" stroke-linejoin="round">
          <path d="M135 268c8-56 26-84 62-84s54 28 62 84Z" fill="var(--accent)"/>
          <path d="M152 138c0-32 22-54 48-54s48 22 48 54c0 24-10 46-24 54h-48c-14-8-24-30-24-54Z" fill="#2b2338"/>
          <path d="M168 142c0-20 14-34 32-34s32 14 32 34c0 20-14 35-32 35s-32-15-32-35Z" fill="#ffe6d4"/>
          <path d="M162 128c12-16 32-22 52-16 14 4 24 14 28 28-12-8-26-10-42-6-14 3-26 2-38-6Z" fill="#2b2338"/>
          <path d="M180 144c3 4 7 4 10 0m20 0c3 4 7 4 10 0" stroke-linecap="round"/>
          <path d="M195 158c4 3 8 3 12 0" stroke-linecap="round"/>
          <path d="M150 140c-4-44 104-44 100 0" fill="none" stroke="var(--recordLabel)" stroke-width="8" stroke-linecap="round"/>
          <rect x="140" y="124" width="22" height="38" rx="10" fill="var(--recordLabel)"/>
          <rect x="238" y="124" width="22" height="38" rx="10" fill="var(--recordLabel)"/>
        </g>
      </svg>`;
    }
    if(sceneId==='art-anime-arcane'){
      return `<svg viewBox="0 0 460 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="16" width="424" height="288" rx="18" fill="#0d0f1d" stroke="#c89b3c" stroke-width="3"/>
        <circle cx="230" cy="155" r="105" fill="#181230" stroke="#00e5ff" stroke-width="2" stroke-dasharray="10 6"/>
        <circle cx="230" cy="155" r="78" fill="#11162b" stroke="#ff2a85" stroke-width="2.5"/>
        <polygon points="230,58 256,128 328,128 268,170 290,242 230,198 170,242 192,170 132,128 204,128" fill="#ff2a85" fill-opacity="0.18" stroke="#ff2a85" stroke-width="2"/>
        <g class="tape-reel">
          <circle cx="135" cy="185" r="56" fill="#090b14" stroke="#00e5ff" stroke-width="3.5"/>
          <circle cx="135" cy="185" r="36" stroke="#c89b3c" stroke-width="1.8" stroke-dasharray="8 6"/>
          <circle cx="135" cy="185" r="16" fill="#ff2a85" stroke="#090b14" stroke-width="3"/>
        </g>
        <g class="tape-reel">
          <circle cx="325" cy="185" r="56" fill="#090b14" stroke="#ff2a85" stroke-width="3.5"/>
          <circle cx="325" cy="185" r="36" stroke="#00e5ff" stroke-width="1.8" stroke-dasharray="8 6"/>
          <circle cx="325" cy="185" r="16" fill="#00e5ff" stroke="#090b14" stroke-width="3"/>
        </g>
        <path d="M165 92c8-36 122-36 130 0" stroke="#c89b3c" stroke-width="9" stroke-linecap="round"/>
        <path d="M165 92c8-36 122-36 130 0" stroke="#00e5ff" stroke-width="3" stroke-linecap="round"/>
        <rect x="148" y="82" width="26" height="46" rx="8" transform="rotate(-10 148 82)" fill="#ff2a85" stroke="#c89b3c" stroke-width="2.5"/>
        <rect x="286" y="82" width="26" height="46" rx="8" transform="rotate(10 286 82)" fill="#00e5ff" stroke="#c89b3c" stroke-width="2.5"/>
        <path d="M65 55l28 18-18 8 24 22m295-48-26 20 18 6-24 24" stroke="#ff2a85" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="196" y="150" width="68" height="72" rx="8" fill="#15192e" stroke="#c89b3c" stroke-width="2.5"/>
        <line x1="214" y1="164" x2="214" y2="208" stroke="#00e5ff" stroke-width="3"/><rect x="208" y="176" width="12" height="8" rx="2" fill="#ff2a85"/>
        <line x1="246" y1="164" x2="246" y2="208" stroke="#ff2a85" stroke-width="3"/><rect x="240" y="188" width="12" height="8" rx="2" fill="#00e5ff"/>
      </svg>`;
    }
    if(sceneId==='art-cartoon-boombox'){
      return `<svg viewBox="0 0 460 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#1a1615" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M135 82V50h190v32" fill="none" stroke-width="6"/>
          <rect x="64" y="82" width="332" height="186" rx="26" fill="#ff5252"/>
          <rect x="76" y="94" width="308" height="34" rx="10" fill="#ffea00"/>
          <circle cx="132" cy="196" r="50" fill="#1a1615"/>
          <g class="tape-reel"><circle cx="132" cy="196" r="36" fill="#2979ff"/><circle cx="132" cy="196" r="14" fill="#ffea00"/><path d="M132 160v14m0 44v14m-36-36h14m44 0h14" stroke="#1a1615" stroke-width="3"/></g>
          <circle cx="328" cy="196" r="50" fill="#1a1615"/>
          <g class="tape-reel"><circle cx="328" cy="196" r="36" fill="#2979ff"/><circle cx="328" cy="196" r="14" fill="#ffea00"/><path d="M328 160v14m0 44v14m-36-36h14m44 0h14" stroke="#1a1615" stroke-width="3"/></g>
          <rect x="194" y="152" width="72" height="54" rx="10" fill="#fffdf4"/>
          <circle cx="214" cy="179" r="9" fill="#ff5252"/><circle cx="246" cy="179" r="9" fill="#2979ff"/>
          <path d="M198 226h64" stroke-width="5"/>
          <polygon points="42,58 52,32 66,54 92,46 74,68 88,90 62,82 46,102 48,76 24,68" fill="#ffea00"/>
          <polygon points="408,48 418,26 430,46 452,40 436,60 448,80 424,72 410,90 412,66 392,58" fill="#80d8ff"/>
        </g>
      </svg>`;
    }
    if(sceneId==='art-brutal-deck'){
      return `<svg viewBox="0 0 460 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="36" y="24" width="388" height="272" fill="#131619" stroke="#454f5b" stroke-width="3"/>
        <rect x="52" y="40" width="356" height="156" fill="#0b0c0e" stroke="#282e36" stroke-width="2"/>
        <g class="tape-reel">
          <circle cx="145" cy="118" r="58" fill="#1c2127" stroke="#d97706" stroke-width="2.5"/>
          <circle cx="145" cy="118" r="18" fill="#0b0c0e" stroke="#9ca3af" stroke-width="2"/>
          <path d="M145 64v32m-46 49 28-16m64 16-28-16" stroke="#9ca3af" stroke-width="4"/>
        </g>
        <g class="tape-reel">
          <circle cx="315" cy="118" r="58" fill="#1c2127" stroke="#d97706" stroke-width="2.5"/>
          <circle cx="315" cy="118" r="18" fill="#0b0c0e" stroke="#9ca3af" stroke-width="2"/>
          <path d="M315 64v32m-46 49 28-16m64 16-28-16" stroke="#9ca3af" stroke-width="4"/>
        </g>
        <path d="M145 176h170" stroke="#f59e0b" stroke-width="2"/>
        <rect x="52" y="212" width="110" height="52" fill="#0b0c0e" stroke="#454f5b" stroke-width="2"/>
        <path d="M68 252a42 42 0 0 1 78 0" stroke="#454f5b" stroke-width="2"/><line x1="107" y1="252" x2="128" y2="222" stroke="#f59e0b" stroke-width="2.5"/>
        <rect x="176" y="212" width="110" height="52" fill="#0b0c0e" stroke="#454f5b" stroke-width="2"/>
        <path d="M192 252a42 42 0 0 1 78 0" stroke="#454f5b" stroke-width="2"/><line x1="231" y1="252" x2="248" y2="220" stroke="#f59e0b" stroke-width="2.5"/>
        <rect x="304" y="212" width="28" height="22" fill="#d97706"/><rect x="340" y="212" width="28" height="22" fill="#282e36"/><rect x="376" y="212" width="28" height="22" fill="#282e36"/>
        <rect x="304" y="242" width="100" height="22" fill="#0b0c0e" stroke="#d97706" stroke-width="1.5"/>
      </svg>`;
    }
    return '';
  }
  function renderHeroPicker(){
    const picker=$('#heroBgPicker');if(!picker||picker.hidden)return;
    const cur=settings.heroScene||'default',b=backdropFor('hero');
    let bodyHTML='';
    if(heroPickerTab==='anim'||heroPickerTab==='art'){
      const list=HERO_SCENES[heroPickerTab];
      bodyHTML=`<div class="hero-scene-grid">${list.map(item=>`<button type="button" class="hero-scene-card ${cur===item.id?'active':''}" data-action="setHeroScene" data-scene="${item.id}"><strong><span>${escapeHTML(t(item.title))}</span><span class="preset-badge">${item.badge}</span></strong><small>${escapeHTML(t(item.sub))}</small></button>`).join('')}</div>`;
    }else{
      bodyHTML=`<div class="hero-gif-upload-box"><div class="settings-buttons" style="margin:0"><button type="button" class="button primary" data-action="choosePhoto" data-target="hero">${icon('upload')}${escapeHTML(t('uploadGifBtn'))}</button><button type="button" class="button secondary" data-action="choosePhoto" data-target="workspace">${icon('image')}${escapeHTML(t('uploadAppGifBtn'))}</button>${b.image?`<button type="button" class="button secondary" data-action="removePhoto" data-target="hero">${escapeHTML(t('removePhoto'))}</button>`:''}</div><p class="setting-description">${escapeHTML(t('gifHint'))}</p>${b.image?`<label class="background-range"><span>${escapeHTML(t('shade'))} <output data-backdrop-output="shade">${b.shade}%</output></span><input type="range" data-backdrop="shade" data-target="hero" min="0" max="90" step="1" value="${b.shade}"></label><label class="background-range"><span>${escapeHTML(t('blur'))} <output data-backdrop-output="blur">${b.blur}px</output></span><input type="range" data-backdrop="blur" data-target="hero" min="0" max="20" step="1" value="${b.blur}"></label>`:''}</div>`;
    }
    picker.innerHTML=`<div class="hero-picker-head"><strong>${escapeHTML(t('heroPickerTitle'))}</strong><button type="button" class="icon-button tiny" data-action="toggleHeroPicker">${icon('close')}</button></div><div class="hero-picker-tabs"><button type="button" class="${heroPickerTab==='anim'?'active':''}" data-action="heroPickerTab" data-tab="anim">${escapeHTML(t('heroTabAnim'))}</button><button type="button" class="${heroPickerTab==='art'?'active':''}" data-action="heroPickerTab" data-tab="art">${escapeHTML(t('heroTabArt'))}</button><button type="button" class="${heroPickerTab==='gif'?'active':''}" data-action="heroPickerTab" data-tab="gif">${escapeHTML(t('heroTabGif'))}</button></div>${bodyHTML}`;
    $$('input[type="range"]',picker).forEach(rangeFill);
  }
  function renderHeroScene(){
    cancelAnimationFrame(heroAnimFrame);heroAnimFrame=0;
    const hero=$('#hero'),canvas=$('#heroAnimCanvas'),artBox=$('#heroArtContainer');
    if(!hero||!canvas||!artBox)return;
    const scene=settings.heroScene||'default';
    if(scene!=='custom-photo'&&settings.backdrops.hero?.image){
      // Hide photo layer when a preset animation or artwork is active
      const layer=$(':scope > .photo-layer',hero);if(layer)layer.hidden=true;
      hero.classList.remove('has-photo');
    }else if(scene==='custom-photo'){
      void applyAllBackdrops();
    }
    const isAnim=scene.startsWith('anim-');
    const isCustomArt=scene.startsWith('art-');
    hero.classList.toggle('has-custom-scene',isAnim||isCustomArt||scene==='custom-photo');
    hero.classList.toggle('has-full-bleed-scene',isAnim||scene==='custom-photo');
    canvas.hidden=!isAnim;
    artBox.innerHTML=isCustomArt?heroArtSVG(scene):'';
    artBox.hidden=!isCustomArt;
    if(isAnim&&! hero.hidden&&settings.animations){
      startHeroAnimation(canvas,scene);
    }
    if($('#heroBgPicker')&&!$('#heroBgPicker').hidden)renderHeroPicker();
  }
  function startHeroAnimation(canvas,scene){
    const ctx=canvas.getContext('2d');if(!ctx)return;
    const draw=now=>{
      if(document.hidden||$('#hero')?.hidden||!settings.heroScene?.startsWith('anim-')){heroAnimFrame=0;return;}
      heroAnimFrame=requestAnimationFrame(draw);
      const w=canvas.width=Math.max(300,canvas.clientWidth),h=canvas.height=Math.max(180,canvas.clientHeight);
      const tSec=now/1000,beat=currentBeatEnergy||(!audio.paused?0.25+0.15*Math.sin(tSec*6):0.08);
      const p=resolvedColors();
      ctx.clearRect(0,0,w,h);
      if(scene==='anim-synthwave'){
        const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#0d0620');g.addColorStop(0.58,'#2b0f4c');g.addColorStop(1,'#140826');
        ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
        const sunX=w*0.72,sunY=h*0.44,sunR=Math.min(w,h)*(0.26+beat*0.04);
        const sg=ctx.createLinearGradient(sunX,sunY-sunR,sunX,sunY+sunR);sg.addColorStop(0,'#ffee55');sg.addColorStop(0.5,'#ff5e7e');sg.addColorStop(1,'#b829ff');
        ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sunX,sunY,sunR,0,Math.PI*2);ctx.fill();
        const horizon=h*0.58;
        ctx.fillStyle='#140826';
        for(let i=0;i<5;i++)ctx.fillRect(sunX-sunR,horizon-32+i*8,sunR*2,2+i*0.8);
        ctx.strokeStyle='#00e5ff';ctx.lineWidth=1.4;ctx.globalAlpha=0.55;
        for(let i=-12;i<=12;i++){ctx.beginPath();ctx.moveTo(sunX+i*18,horizon);ctx.lineTo(sunX+i*95,h);ctx.stroke();}
        const offset=(tSec*42)%22;
        for(let y=horizon+offset*0.4;y<h;y+=(y-horizon)*0.28+4){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
        ctx.globalAlpha=1;
      }else if(scene==='anim-arcane'){
        const g=ctx.createRadialGradient(w*0.7,h*0.5,10,w*0.65,h*0.5,w*0.7);g.addColorStop(0,'#1b1f3b');g.addColorStop(0.6,'#0e1020');g.addColorStop(1,'#070811');
        ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
        const cx=w*0.72,cy=h*0.5;
        for(let r=0;r<3;r++){
          ctx.save();ctx.translate(cx,cy);ctx.rotate((r%2?1:-1)*tSec*(0.3+r*0.15));
          ctx.strokeStyle=r===1?'#ff2a85':r===2?'#c89b3c':'#00e5ff';
          ctx.lineWidth=2;ctx.globalAlpha=0.45+beat*0.35;
          ctx.setLineDash(r===0?[12,8]:r===1?[6,10]:[]);
          ctx.beginPath();ctx.arc(0,0,42+r*34+beat*16,0,Math.PI*2);ctx.stroke();
          ctx.restore();
        }
        for(let i=0;i<28;i++){
          const a=i*1.7+tSec*0.4,dist=((i*37+tSec*35)%(w*0.55));
          const px=cx+Math.cos(a)*dist,py=cy+Math.sin(a)*dist*0.6;
          ctx.fillStyle=i%2?'#00e5ff':'#ff2a85';ctx.globalAlpha=0.35+0.4*Math.sin(tSec*3+i);
          ctx.beginPath();ctx.arc(px,py,1.5+(i%3),0,Math.PI*2);ctx.fill();
        }
        ctx.globalAlpha=1;
      }else if(scene==='anim-rain'){
        const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#101828');g.addColorStop(1,'#1e293b');
        ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
        for(let i=0;i<16;i++){
          const bx=(i*73)%w,by=h*0.35+((i*41)%(h*0.55)),br=14+(i%4)*8+beat*10;
          ctx.fillStyle=i%3===0?'#fbbf24':i%2?'#f472b6':'#38bdf8';ctx.globalAlpha=0.16+0.08*Math.sin(tSec*2+i);
          ctx.beginPath();ctx.arc(bx,by,br,0,Math.PI*2);ctx.fill();
        }
        ctx.strokeStyle='#93c5fd';ctx.lineWidth=1.3;ctx.globalAlpha=0.45;
        for(let i=0;i<55;i++){
          const rx=((i*47+tSec*90)%w),ry=((i*83+tSec*340)%h);
          ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-5,ry+16);ctx.stroke();
        }
        ctx.globalAlpha=1;
      }else if(scene==='anim-aurora'){
        ctx.fillStyle=p.hero;ctx.fillRect(0,0,w,h);
        for(let band=0;band<3;band++){
          ctx.beginPath();ctx.moveTo(0,h);
          for(let x=0;x<=w;x+=24){
            const y=h*(0.38+band*0.16)+Math.sin(x*0.008+tSec*(1.4+band*0.4)+band)*(28+beat*42);
            ctx.lineTo(x,y);
          }
          ctx.lineTo(w,h);ctx.closePath();
          ctx.fillStyle=band===0?p.accent:band===1?p.visualizer:p.recordLabel;
          ctx.globalAlpha=0.26+band*0.08;ctx.fill();
        }
        ctx.globalAlpha=1;
      }else{
        // anim-lofi: Spinning Vinyl & Floating Notes
        ctx.fillStyle=p.hero;ctx.fillRect(0,0,w,h);
        const cx=w*0.73,cy=h*0.52,r=Math.min(w,h)*(0.32+beat*0.04);
        ctx.fillStyle=p.accent;ctx.globalAlpha=0.22;ctx.beginPath();ctx.arc(cx,cy,r*1.28,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
        ctx.save();ctx.translate(cx,cy);ctx.rotate(tSec*1.1);
        ctx.fillStyle='#1f222e';ctx.strokeStyle=p.outline;ctx.lineWidth=3;
        ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.strokeStyle='#ffffff33';ctx.lineWidth=1.5;
        for(const gr of [0.8,0.64,0.48]){ctx.beginPath();ctx.arc(0,0,r*gr,0.2,2.4);ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*gr,3.3,5.5);ctx.stroke();}
        ctx.fillStyle=p.recordLabel;ctx.beginPath();ctx.arc(0,0,r*0.32,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.fillStyle=p.surface;ctx.beginPath();ctx.arc(0,0,r*0.08,0,Math.PI*2);ctx.fill();
        ctx.restore();
        ctx.fillStyle=p.text;ctx.font='700 18px sans-serif';
        const symbols=['♪','♫','✦','✳'];
        for(let i=0;i<8;i++){
          const nx=w*0.48+((i*58+tSec*32)%(w*0.48)),ny=h-(((i*43+tSec*45)%h));
          ctx.globalAlpha=0.3+0.3*Math.sin(tSec*2+i);
          ctx.fillText(symbols[i%symbols.length],nx,ny);
        }
        ctx.globalAlpha=1;
      }
    };
    heroAnimFrame=requestAnimationFrame(draw);
  }

  // ============================================================================
  // 7. ADAPTIVE PANEL RESIZE OBSERVER (FULL RESPONSIVENESS ON ANY SIZE)
  // ============================================================================
  let panelSizeObserver=null;
  function updatePanelSizeAttrs(el){
    if(!el||el.hidden)return;
    const w=el.clientWidth||300,h=el.clientHeight||300;
    el.dataset.wSize=w<215?'xs':w<330?'sm':w<540?'md':'lg';
    el.dataset.hSize=h<135?'xs':h<230?'sm':h<400?'md':'lg';
    el.style.setProperty('--pw',`${w}px`);
    el.style.setProperty('--ph',`${h}px`);
  }
  function observeAllPanelSizes(){
    if(!panelSizeObserver&&typeof ResizeObserver!=='undefined'){
      panelSizeObserver=new ResizeObserver(entries=>{
        for(const entry of entries)updatePanelSizeAttrs(entry.target);
      });
    }
    $$('[data-panel],#main').forEach(el=>{
      panelSizeObserver?.observe(el);
      updatePanelSizeAttrs(el);
    });
  }

  // ============================================================================
  // 10. SMART SEARCH AUTOCOMPLETE SUGGESTIONS & FUZZY HIGHLIGHTING
  // ============================================================================
  let activeSugIndex=-1;
  function highlightMatch(text,rawNeedle){
    const str=String(text||'');const needle=normalizeSearchText(rawNeedle);
    if(!needle)return escapeHTML(str);
    const normStr=normalizeSearchText(str);
    const idx=normStr.indexOf(needle);
    if(idx>=0){
      return escapeHTML(str.slice(0,idx))+`<mark>${escapeHTML(str.slice(idx,idx+needle.length))}</mark>`+escapeHTML(str.slice(idx+needle.length));
    }
    // Highlight matching characters in sequence
    let out='',qi=0;
    for(let i=0;i<str.length;i++){
      const c=str[i];
      if(qi<needle.length&&normalizeSearchText(c)===needle[qi]){
        out+=`<mark>${escapeHTML(c)}</mark>`;qi++;
      }else out+=escapeHTML(c);
    }
    return out;
  }
  function renderSearchSuggestions(){
    const box=$('#searchSuggestions'),clearBtn=$('#searchClearBtn');
    const raw=$('#search')?.value||'';
    if(clearBtn)clearBtn.hidden=!raw.length;
    if(!box)return;
    const needle=normalizeSearchText(raw);
    if(!needle||!tracks.length){box.hidden=true;box.innerHTML='';activeSugIndex=-1;return;}
    const matches=tracks.map(track=>({track,score:scoreTrackMatch(track,needle)})).filter(m=>m.score>0).sort((a,b)=>b.score-a.score).slice(0,7);
    const artists=[...new Set(matches.map(m=>m.track.artist).filter(Boolean))].slice(0,3);
    const albums=[...new Set(matches.map(m=>m.track.album).filter(Boolean))].slice(0,3);
    if(!matches.length){box.hidden=true;box.innerHTML='';return;}
    activeSugIndex=-1;
    box.hidden=false;
    box.innerHTML=`<div class="search-sug-header"><span>${escapeHTML(t('searchSuggestionsTitle'))}</span><span>${matches.length}</span></div>`+
      matches.map(({track},i)=>`<div class="search-sug-item" role="option" data-sug-index="${i}" data-action="playSuggestion" data-id="${escapeHTML(track.id)}">${coverMarkup(track)}<div class="search-sug-text"><strong>${highlightMatch(track.title,raw)}</strong><small>${highlightMatch(trackArtist(track),raw)}${track.album?' · '+highlightMatch(track.album,raw):''}</small></div><span class="track-duration">${track.duration?formatTime(track.duration):''}</span></div>`).join('')+
      ((artists.length||albums.length)?`<div class="search-sug-tags">${artists.map(a=>`<button type="button" class="search-sug-tag" data-action="filterSearchTag" data-val="${escapeHTML(a)}">👤 ${highlightMatch(a,raw)}</button>`).join('')}${albums.map(al=>`<button type="button" class="search-sug-tag" data-action="filterSearchTag" data-val="${escapeHTML(al)}">💿 ${highlightMatch(al,raw)}</button>`).join('')}</div>`:'');
    observeCovers();
  }
  $('#search')?.addEventListener('focus',()=>{if($('#search').value.trim())renderSearchSuggestions();});
  $('#search')?.addEventListener('keydown',e=>{
    const box=$('#searchSuggestions');if(!box||box.hidden)return;
    const items=$$('.search-sug-item',box);if(!items.length)return;
    if(e.key==='ArrowDown'){e.preventDefault();activeSugIndex=(activeSugIndex+1)%items.length;items.forEach((el,i)=>el.classList.toggle('active',i===activeSugIndex));}
    else if(e.key==='ArrowUp'){e.preventDefault();activeSugIndex=(activeSugIndex-1+items.length)%items.length;items.forEach((el,i)=>el.classList.toggle('active',i===activeSugIndex));}
    else if(e.key==='Enter'&&activeSugIndex>=0){e.preventDefault();const id=items[activeSugIndex]?.dataset.id;if(id){box.hidden=true;void playTrack(id,true,visibleTracks().map(tr=>tr.id));}}
    else if(e.key==='Escape'){box.hidden=true;}
  });

  // Register all new V4 actions
  Object.assign(actions,{
    pinPanel:button=>{
      const id=button.dataset.id,r=panelConfig(id);
      r.pinned=!r.pinned;
      applyLayout(false);
      if($('#settingsDialog').open)renderSettings();
      saveState();
      toast(t(r.pinned?'panelPinnedToast':'panelUnpinnedToast'));
    },
    openLangMenu:button=>openTopbarLanguageMenu(button),
    toggleHeroPicker:()=>{
      const p=$('#heroBgPicker');if(!p)return;
      p.hidden=!p.hidden;
      if(!p.hidden)renderHeroPicker();
    },
    heroPickerTab:button=>{
      heroPickerTab=button.dataset.tab||'anim';
      renderHeroPicker();
    },
    setHeroScene:button=>{
      settings.heroScene=button.dataset.scene||'default';
      renderHeroScene();
      saveState();
    },
    clearSearch:()=>{
      query='';$('#search').value='';
      $('#searchSuggestions').hidden=true;
      $('#searchClearBtn').hidden=true;
      page=1;renderLibrary();$('#search').focus();
    },
    playSuggestion:button=>{
      $('#searchSuggestions').hidden=true;
      void playTrack(button.dataset.id,true,visibleTracks().map(tr=>tr.id));
    },
    filterSearchTag:button=>{
      const val=button.dataset.val||'';
      $('#search').value=val;query=val;
      $('#searchSuggestions').hidden=true;
      page=1;renderLibrary();
    },
    selectTrack:(button,event)=>{
      const id=button.dataset.id;if(!id)return;
      const list=visibleTracks();
      if(event?.shiftKey&&lastSelectedTrackId&&lastSelectedTrackId!==id){
        const i1=list.findIndex(tr=>tr.id===lastSelectedTrackId),i2=list.findIndex(tr=>tr.id===id);
        if(i1>=0&&i2>=0){
          const [from,to]=i1<i2?[i1,i2]:[i2,i1];
          for(let i=from;i<=to;i++)selectedTrackIds.add(list[i].id);
        }
      }else{
        if(selectedTrackIds.has(id))selectedTrackIds.delete(id);
        else selectedTrackIds.add(id);
      }
      lastSelectedTrackId=id;
      renderLibrary();
    },
    toggleSelectAll:()=>{
      const list=visibleTracks();if(!list.length)return;
      const allSel=list.every(tr=>selectedTrackIds.has(tr.id));
      if(allSel)list.forEach(tr=>selectedTrackIds.delete(tr.id));
      else list.forEach(tr=>selectedTrackIds.add(tr.id));
      renderLibrary();
    },
    clearSelection:()=>{
      selectedTrackIds.clear();lastSelectedTrackId='';
      renderLibrary();
    },
    batchPlay:async()=>{
      const ids=visibleTracks().map(tr=>tr.id).filter(id=>selectedTrackIds.has(id));
      const playIds=ids.length?ids:[...selectedTrackIds].filter(id=>trackMap.has(id));
      if(playIds.length)await playTrack(playIds[0],true,playIds);
    },
    batchQueue:()=>{
      const ids=[...selectedTrackIds].filter(id=>trackMap.has(id));if(!ids.length)return;
      const rest=upcomingIds().filter(id=>!selectedTrackIds.has(id));
      reorderQueue([...ids,...rest]);
      toast(t('batchQueued',{n:ids.length}));
    },
    batchAddPlaylist:()=>{
      const ids=[...selectedTrackIds].filter(id=>trackMap.has(id));if(!ids.length)return;
      const addAllTo=playlist=>{
        let addedCount=0;
        for(const id of ids)if(!playlist.ids.includes(id)){playlist.ids.push(id);addedCount++;}
        saveState();renderAll();toast(t('batchPlaylistAdded',{n:addedCount||ids.length}));
      };
      if(!playlists.length){newPlaylist(playlist=>addAllTo(playlist));return;}
      openForm(t('addPlaylist'),`<label>${t('pickPlaylist')}<select name="playlist">${playlists.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)}</option>`).join('')}</select></label>`,form=>{
        const playlist=playlists.find(p=>p.id===form.get('playlist'));
        if(playlist)addAllTo(playlist);
      });
      syncCustomSelects($('#editDialog'));
    },
    batchFavorite:async()=>{
      const ids=[...selectedTrackIds].filter(id=>trackMap.has(id));if(!ids.length)return;
      const anyUnfav=ids.some(id=>!trackMap.get(id)?.favorite);
      for(const id of ids){const tr=trackMap.get(id);if(tr){tr.favorite=anyUnfav;await persistMetadata(tr);}}
      renderAll();toast(t('batchFavUpdated',{n:ids.length}));
    },
    batchDelete:()=>{
      const ids=[...selectedTrackIds].filter(id=>trackMap.has(id));if(!ids.length)return;
      if(view.startsWith('playlist:')){
        const playlist=playlists.find(p=>`playlist:${p.id}`===view);
        if(playlist){playlist.ids=playlist.ids.filter(id=>!selectedTrackIds.has(id));selectedTrackIds.clear();saveState();renderLibrary();toast(t('removed'));}
        return;
      }
      confirmAction(t('deleteTrack'),t('batchDeleteConfirm',{n:ids.length}),async()=>{
        selectedTrackIds.clear();
        await removeTracks(ids);
        toast(t('deleted'));
      });
    }
  });

  async function initialize(){
    applyTheme();applyLayout();localize();audio.volume=settings.volume/100;audio.playbackRate=settings.speed;$('#volume').value=settings.volume;rangeFill($('#volume'));$('#sortSelect').value=settings.sort;
    $('#trackContent').innerHTML=`<div class="empty-state"><div class="spinner-record"></div><p style="margin-top:18px">${escapeHTML(t('loading'))}</p></div>`;
    try{db=await openDatabase();db.onversionchange=()=>{db.close();db=null;storageWarning('storageUnavailable');};tracks=(await dbRead('tracks'))||[];tracks=tracks.filter(track=>track&&typeof track.id==='string'&&typeof track.title==='string');for(const track of tracks)trackMap.set(track.id,track);}catch{db?.close();db=null;}
    renderAll();syncCustomSelects();observeAllPanelSizes();renderHeroScene();void applyAllBackdrops();
    const seenBefore = stored.onboardingSeen === true || (() => { try { return localStorage.getItem('zenith.onboarding.v1') === 'seen'; } catch { return false; } })();
    if (!seenBefore || settings.showGuideOnStartup) {
      setTimeout(() => openWelcomeGuide(0), 220);
    }
    if(typeof ResizeObserver!=='undefined'){resizeObserver=new ResizeObserver(resizeSpectrum);spectrumCanvases().forEach(canvas=>resizeObserver.observe(canvas));}
    if(settings.rememberPosition&&trackMap.has(stored.lastTrack)){pendingResume={id:stored.lastTrack,time:Number(stored.lastTime)||0};queue=tracks.map(track=>track.id);await playTrack(stored.lastTrack,false);resetShuffleBag();renderQueue();observeCovers();}
  }
  fire(initialize);
})();