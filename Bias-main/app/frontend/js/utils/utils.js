
export function random(min, max) {
    return Math.random() * (max - min) + min;
}

export function formatDateTime(dateTimeStr) {
    const d = new Date(dateTimeStr);
    
    return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC' 
    }).format(d).replace(/,/g, '')
}

export function formatStr(str) {
    if(str) {
        str = str.replace('_', ' ');
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return 'N/A';
}




