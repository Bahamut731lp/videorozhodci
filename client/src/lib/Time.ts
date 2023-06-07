export function getISODuration(millis: number) {
    let minutes = Math.floor(millis / 60000)
    let seconds = Number(Math.floor(((millis % 60000) / 1000)).toFixed(0));

    if (seconds == 60) {
        minutes += 1;
        seconds = 0;
    }
    
    return (
        minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0")
    );
}