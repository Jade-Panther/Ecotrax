'''
A variety of helper functions for managing time
'''
from timezonefinder import TimezoneFinder
from zoneinfo import ZoneInfo
from datetime import datetime, time, date


tf = TimezoneFinder()

def convert_to_dt(date_str):
    try:
        split_date = date_str.split(' ')
        return {'date': datetime.strptime(split_date[0], "%Y-%m-%d").date(), 'time': datetime.strptime(split_date[1] + ' ' + split_date[2], "%I:%M %p").time() }
    except ValueError as e:
        print(f"Error parsing date: {e}")
        return False

def get_timezone(lat, lon):
    return tf.timezone_at(lat=lat, lng=lon)

def check_date(date_str, lat, lon):
    try:
        tz_name = get_timezone(lat, lon)
        if tz_name is None:
            return False

        tz = ZoneInfo(tz_name)

        dt = convert_to_dt(date_str)
        naive_dt = datetime.combine(dt['date'], dt['time'])

        local_dt = naive_dt.replace(tzinfo=tz)
        utc_dt = local_dt.astimezone(ZoneInfo("UTC"))

        now_utc = datetime.now(ZoneInfo("UTC"))

        return utc_dt < now_utc

    except Exception as e:
        print(f"Error parsing date: {e}")
        return False


def date_is_between(date_str, day_start, day_end, year_start, year_end):
    valid = True
    dt = convert_to_dt(date_str)

    # Check if between times
    if day_start:
        valid &= dt['time'] >= datetime.strptime(day_start, "%I:%M %p").time()
    if day_end:
        valid &= dt['time'] <= datetime.strptime(day_end, "%I:%M %p").time()
    
    # Check if between year
    if year_start:
        valid &= dt['date'] >= datetime(int(year_start), 1, 1).date()
    if year_end:
        valid &= dt['date'] <= datetime(int(year_end), 12, 31).date()

    return valid

def minutes_to_time(minutes):
    hours = minutes // 60
    mins = minutes % 60
    return time(hour=hours, minute=mins)


print(get_timezone(39.470125122358176, -99.93818430053282))