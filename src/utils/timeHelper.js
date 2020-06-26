const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes*60000);
}

const addHours = (date, hours) => {
    return new Date(date.getTime() + hours*60*60000);
}

module.exports = {
  addMinutes,
  addHours
}