export function parseSubtitles(subtitles) {
  try {
    let subtitlesArray = subtitles.split('\n\n').filter((item) => item.trim() !== '');

    let subtitlesObjects = subtitlesArray.map((item) => {
      let parts = item.split('\n');
      let timestamps = parts[1].split('-->');
      let startTimestamp = convertToSeconds(timestamps[0]);
      let endTimestamp = convertToSeconds(timestamps[1]);
      return {
        number: parts[0],
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
        content: parts[2],
      };
    });

    return subtitlesObjects;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function convertToSeconds(timestamp) {
  try {
    let parts = timestamp.split(':');
    if (parts.length < 3) {
      console.log(`Timestamp Error. Invalid timestamp: ${timestamp}`);
      throw new Error(`Timestamp Error. Invalid timestamp: ${timestamp}`);
    }
    let hours = parseInt(parts[0]);
    let minutes = parseInt(parts[1]);
    let seconds = parseFloat(parts[2].replace(',', '.'));
    return hours * 3600 + minutes * 60 + seconds;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
