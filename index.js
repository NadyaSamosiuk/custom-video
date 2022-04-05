//Находим элементы
const player = document.querySelector('.video__player');
const video = player.querySelector('.video__player__viewer');
const progress = player.querySelector('.video__player__controls')
const btnPlayVideo = player.querySelector('.video__player__play-btn')
const btnPlayControl = player.querySelector('.control__play-icon')
const btnVolume = player.querySelector('.volume-icon')
const btnFull = player.querySelector('.fullscreen')
const ranges = player.querySelectorAll('.range')
const controlProgress = player.querySelector('.control__progress')
const controlVolume = player.querySelector('.control__volume')
const videoTimeStart = player.querySelector('.video__start')
const videoTimeEnd = player.querySelector('.video__end')
const btnFullScreen = player.querySelector('.fullscreen')


//запускаем или останавлива проигрывание видео
function togglePlay(){
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
}

//Меняем внешний вид  кнопки в зависимости от того, проигрывается ли видео в данный момент
function updateButton() {
    if (this.paused) {
        btnPlayVideo.classList.remove('hidden');
        btnPlayControl.classList.remove('pause');
        btnPlayControl.classList.add('play');
    } else {
        btnPlayVideo.classList.add('hidden');
        btnPlayControl.classList.remove('play');
        btnPlayControl.classList.add('pause');
    }
}

// Включаем или выключаем звук при клике по кнопке Volume/Mute 
function volumeMute (event){
    let volume = +(event.offsetX / controlVolume.offsetWidth).toFixed(2);

    if(video.volume === 0) {
        controlVolume.value = volume;
        video.volume = controlVolume.value;
        btnVolume.classList.remove('mute');
        controlVolume.style.background = `linear-gradient(to right, #bdae82 0%, #bdae82 ${controlVolume.value*100}%, #c8c8c8 ${controlVolume.value*100}%, #c8c8c8 100%)`;
    } else {
        video.volume = 0;
        controlVolume.value = 0;
        btnVolume.classList.add('mute');
        controlVolume.style.background = `linear-gradient(to right, #bdae82 0%, #bdae82 ${controlVolume.value*100}%, #c8c8c8 ${controlVolume.value*100}%, #c8c8c8 100%)`
    }
}

//Убираем добовляем звук при помощи range
function volumeRangeUpdate(event){
   let volume = +(event.offsetX / controlVolume.offsetWidth).toFixed(2);
    
    if (volume < 0.95){
        volume += 0.05;
    }else if (volume >= 0.95){
        volume = 1;
    } else if (volume > 0.05){
        volume -= 0.05;
    }
    if (volume <= 0.05){
        volume = 0;
    } 
    
    video.volume = +volume.toFixed(2);
    controlVolume.value = volume;

    controlVolume.style.background = `linear-gradient(to right, #bdae82 0%, #bdae82 ${volume * 100}%, #c8c8c8 ${volume * 100}%, #c8c8c8 100%)`;

    if(video.volume == 0){
        btnVolume.classList.add('mute')
    }else{
        btnVolume.classList.remove('mute');
    }
}

// Отоброжаем прогресс проигрывания видео
function videoRangeUpdate(){
    const percent = (+(video.currentTime / video.duration).toFixed(2)) * 100;

    controlProgress.value = percent;
    videoTimeStart.innerHTML = videoTime(video.currentTime);
    videoTimeEnd.innerHTML = videoTime(video.duration);
    controlProgress.style.background = `linear-gradient(to right, #bdae82 0%, #bdae82 ${percent}%, #c8c8c8 ${percent}%, #c8c8c8 100%)`;
}

// Рассчитываем время в секундах и минутах
function videoTime(time) { 
    time = Math.floor(time);

    let min = Math.floor(time / 60),
        s = Math.floor(time - min * 60),
        minutes = min,
        seconds = s;

    if(min < 10) {
      minutes = '0' + min;
    }
    if(s < 10) {
      seconds = '0' + s;
    }
    return minutes + ':' + seconds;
}

//Перемотка видео
function scrub(event) { 
    const scrubTime = (event.offsetX / controlProgress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

//Полноэкранный режим
function fullScreen() { 
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        player.requestFullscreen()
    }
}
  
video.addEventListener('click', togglePlay);
btnPlayVideo.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
btnPlayControl.addEventListener('click', togglePlay);
btnVolume.addEventListener('click', volumeMute);
video.addEventListener('timeupdate', videoRangeUpdate);
btnFullScreen.addEventListener('click', fullScreen);

let mousedown = false;

controlVolume.addEventListener('click', volumeRangeUpdate);
controlVolume.addEventListener('mousemove', (event) => mousedown && volumeRangeUpdate(event));
controlVolume.addEventListener('mousedown', () => mousedown = true);
controlVolume.addEventListener('mouseup', () => mousedown = false);

controlProgress.addEventListener('click', scrub);
controlProgress.addEventListener('mousemove', (event) => mousedown && scrub(event));
controlProgress.addEventListener('mousedown', () => mousedown = true);
controlProgress.addEventListener('mouseup', () => mousedown = false);
