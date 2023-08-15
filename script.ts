// Get and creat element
const darkMode = document.getElementById('change-mode') as HTMLDivElement;
const miliSecond = document.getElementById('mili-second') as HTMLDivElement;
const second = document.getElementById('second') as HTMLDivElement;
const minutes = document.getElementById('minutes') as HTMLDivElement;
const start = document.getElementById('start') as HTMLDivElement;
const lap = document.getElementById('lap') as HTMLDivElement;
const table = document.querySelector('.table') as HTMLDivElement;
let mili_sec = 0;
let sec = 0;
let min = 0;
let numberOfLab = 1;
let interval: ReturnType<typeof setInterval>;

interface Clock {
    minute: number,
    seconds: number,
    mili_seconds: number
}

let total: Clock = {
    minute: 0,
    seconds: 0,
    mili_seconds: 0
};

// Dark Mode
darkMode.addEventListener('click', () => {
    const fa = document.querySelector('.fas.fa-sun') as HTMLElement;
    fa.classList.toggle('fa-moon');
    document.body.classList.toggle('dark-mode');
});

// Return number => '02' or '22'
const returnNumber = (num: number): string | number => num < 10 ? "0" + num : num;

// Overall-time
const calculateSum = (min: number, sec: number, mili_sec: number, total: Clock): string => {

    total.mili_seconds += mili_sec;
    total.seconds += sec;
    total.minute += min;
    
    if(total.mili_seconds > 99) {
        total.mili_seconds = total.mili_seconds % 100;
        total.seconds += 1;
    }

    if(total.seconds > 59) {
        total.seconds = total.seconds % 60;
        total.minute += 1;
    }

    return returnNumber(total.minute) + ' : ' + returnNumber(total.seconds) + ' . ' + returnNumber(total.mili_seconds);

};

const startHandler = () => {
    // Lap button active
    lap.style.opacity = '1';
    lap.style.pointerEvents = 'visible';

    if(start.innerHTML === 'Start' || start.innerHTML === 'Resume') {
        // Stop Mode
        start.classList.toggle('start-mode');
        start.innerHTML = 'Stop';
        lap.innerHTML = 'Lap';
        // Interval
        interval = setInterval(() => { // Start Mode
            if(mili_sec < 99) {
                mili_sec += 1;
                miliSecond.innerHTML = returnNumber(mili_sec) + ''; 
            } else {
                mili_sec = 0;
                miliSecond.innerHTML = returnNumber(mili_sec)+ '';
                if(sec < 59) {
                    sec += 1;
                    second.innerHTML = returnNumber(sec) + ' . ';
                } else {
                    sec = 0;
                    second.innerHTML = returnNumber(sec) + ' . ';
                    min += 1;
                    minutes.innerHTML = returnNumber(min) + ' : ';
                }
            }
        }, 10);
    } else if(start.innerHTML === 'Stop') { // Stop mode
        start.innerHTML = 'Resume';
        start.classList.remove('start-mode');
        clearInterval(interval);
        lap.innerHTML = 'Reset';
    }
}

const lapHandler = () => {
    if(lap.innerHTML === 'Lap') { // Add Lap
        
        table.style.display = 'block';
        
        // Creat new div for new lap
        const div = document.createElement('div');
        div.innerHTML =  `
            <p>${numberOfLab}</p>
            <p>${returnNumber(min) + ':' + returnNumber(sec) + '.' + returnNumber(mili_sec)}</p>
            <p>${calculateSum(min, sec, mili_sec, total)}</p>
        `;
        div.setAttribute('class', 'items');
        div.setAttribute('id', `${numberOfLab}`);
        // Add new item to table 
        table.appendChild(div);
        numberOfLab++;

    } else {
        // Reset Mode
        // Reset Every Thing
        clearInterval(interval);
        mili_sec = 0;
        sec = 0;
        min = 0;
        miliSecond.innerHTML = '00';
        second.innerHTML = '00 .&nbsp;';
        minutes.innerHTML = '00 : &nbsp;';
        start.innerHTML = 'Start';
        lap.innerHTML = 'Lap';
        lap.style.opacity = '0.7';
        lap.style.pointerEvents = 'none';
        table.style.display = 'none';
        numberOfLab = 1;
        total.mili_seconds = 0;
        total.seconds = 0;
        total.minute = 0;

        // Save title and remove another child
        let child: Element | null = table.lastElementChild;
        while(child) {
            if(child.className === 'title') {
                break
            } else {
                table.removeChild(child);
                child = table.lastElementChild;
            }
        }
    }
}

start.addEventListener('click', startHandler);
lap.addEventListener('click', lapHandler);